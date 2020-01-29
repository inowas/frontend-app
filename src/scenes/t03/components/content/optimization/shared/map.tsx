import * as L from 'leaflet';
import {uniqueId} from 'lodash';
import React, {FormEvent, useEffect, useState} from 'react';
import {CircleMarker, FeatureGroup, GeoJSON, Map, Rectangle} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import {Button, CheckboxProps, Form, Grid, Header, Message, Modal, Segment} from 'semantic-ui-react';
import {ModflowModel} from '../../../../../../core/model/modflow';
import OptimizationObjectsCollection from '../../../../../../core/model/modflow/optimization/ObjectsCollection';
import OptimizationLocation from '../../../../../../core/model/modflow/optimization/OptimizationLocation';
import {
    ELocationType,
    IOptimizationLocation
} from '../../../../../../core/model/modflow/optimization/OptimizationLocation.type';
import {getActiveCellFromCoordinate} from '../../../../../../services/geoTools';
import {BasicTileLayer} from '../../../../../../services/geoTools/tileLayers';
import {getStyle} from '../../../maps';
import InputObjectList from './inputObjectList';
import {IInputRangeResult, InputRange} from './inputRange';

interface IProps {
    model: ModflowModel;
    name: string;
    location: OptimizationLocation;
    label?: string;
    objectsCollection?: OptimizationObjectsCollection;
    onlyObjects?: boolean;
    onlyBbox?: boolean;
    onChange: (result: {
        name: string,
        value: OptimizationLocation
    }) => any;
    readOnly?: boolean;
}

const styles = {
    map: {
        height: '400px',
        width: '100%'
    }
};

const optimizationMap = (props: IProps) => {
    const [location, setLocation] = useState<IOptimizationLocation>({
        ...props.location.toObject(),
        type: props.location.type ? props.location.type : ELocationType.BBOX,
        objects: props.location.objectsCollection ? props.location.objectsCollection.toObject() : []
    });
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);
    const [validationWarning, setValidationWarning] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        setLocation({
            ...props.location.toObject(),
            type: props.location.type ? props.location.type : ELocationType.BBOX,
            objects: props.location.objectsCollection ? props.location.objectsCollection.toObject() : []
        });
    }, [props.location]);

    const toggleEditingState = () => setIsEditing(!isEditing);

    const validateLocation = (p: IOptimizationLocation) =>
        p.col.min <= p.col.max && p.row.min <= p.row.max && p.col.min >= 0 && p.row.min >= 0 &&
        p.col.max <= props.model.gridSize.nX && p.row.max <= props.model.gridSize.nY;

    const handleChangeLocation = ({name, from, to}: IInputRangeResult) => {
        const cLocation: IOptimizationLocation = {
            ...location,
            [name]: {
                ...location[name],
                min: from,
                max: to
            }
        };
        setValidationWarning(!validateLocation(cLocation));
        setLocation(location);
    };

    const handleChangeLocationType = (e: FormEvent, {name, value}: CheckboxProps) => {
        if (typeof name === 'string') {
            setLocation({
                ...location,
                [name]: value
            });
            setValidationWarning(value === ELocationType.BBOX && !validateLocation(location));
        }
    };

    const handleChangeLocationObjects = (objectsCollection: OptimizationObjectsCollection) => {
        const cLocation = OptimizationLocation.fromObject(location);
        cLocation.objectsCollection = objectsCollection;
        setLocation(cLocation.toObject());
    };

    const drawObject = (cLocation: IOptimizationLocation, color = 'red') => {
        const dStyles = {
            line: {
                color,
                weight: 0.3
            }
        };

        const bbox = props.model.boundingBox;
        const gridSize = props.model.gridSize;

        const dX = (bbox.xMax - bbox.xMin) / gridSize.nX;
        const dY = (bbox.yMax - bbox.yMin) / gridSize.nY;

        const cXmin = bbox.xMin + cLocation.col.min * dX;
        const cXmax = bbox.xMin + cLocation.col.max * dX;
        const cYmin = bbox.yMax - cLocation.row.min * dY;
        const cYmax = bbox.yMax - cLocation.row.max * dY;

        if (cXmin === cXmax && cYmin === cYmax && !isEditing) {
            return (
                <CircleMarker
                    key={uniqueId()}
                    center={[
                        cYmin,
                        cXmin
                    ]}
                    radius={10}
                    {...dStyles.line}
                />
            );
        }
        return (
            <Rectangle
                key={uniqueId()}
                bounds={[
                    {lng: cXmin, lat: cYmin},
                    {lng: cXmin, lat: cYmax},
                    {lng: cXmax, lat: cYmax},
                    {lng: cXmax, lat: cYmin},
                ]}
                {...dStyles.line}
            />
        );
    };

    const handleEditPath = (e: L.DrawEvents.Edited) => {
        const layers = e.layers;

        layers.eachLayer((layer: L.Layer) => {
            if (layer instanceof L.Rectangle || layer instanceof L.CircleMarker) {
                const geoJson = layer.toGeoJSON();
                const geometry = geoJson.geometry;

                // Latitude (S/N)
                let ymin = 90;
                let ymax = -90;
                // Longitude (E/W)
                let xmin = 180;
                let xmax = -180;

                const coordinateArray = geometry.coordinates[0];
                if (Array.isArray(coordinateArray)) {
                    coordinateArray.forEach((c: number[] | number[][]) => {
                        const c0 = c[0];
                        const c1 = c[1];
                        if (c[0] <= xmin) {
                            xmin = !Array.isArray(c0) ? c0 : NaN;
                        }
                        if (c[0] >= xmax) {
                            xmax = !Array.isArray(c0) ? c0 : NaN;
                        }
                        if (c[1] <= ymin) {
                            ymin = !Array.isArray(c1) ? c1 : NaN;
                        }
                        if (c[1] >= ymax) {
                            ymax = !Array.isArray(c1) ? c1 : NaN;
                        }
                    });
                }

                const cmin = getActiveCellFromCoordinate([xmin, ymax], props.model.boundingBox, props.model.gridSize);
                const cmax = getActiveCellFromCoordinate([xmax, ymin], props.model.boundingBox, props.model.gridSize);

                const p = {
                    row: {
                        min: cmin[1],
                        max: cmax[1]
                    },
                    col: {
                        min: cmin[0],
                        max: cmax[0]
                    }
                };

                const cLocation = {
                    ...location,
                    row: {
                        ...location.row,
                        min: p.row.min,
                        max: p.row.max
                    },
                    col: {
                        ...location.col,
                        min: p.col.min,
                        max: p.col.max
                    }
                };

                setValidationWarning(!validateLocation(cLocation));
                setLocation(cLocation);
            }
        });
    };

    const handleSaveModal = () => {
        props.onChange({
            name: props.name,
            value: OptimizationLocation.fromObject(location)
        });
        return setShowOverlay(false);
    };

    const handleCancelModal = () => setShowOverlay(false);

    const handleClickToggleMap = () => setShowOverlay(true);

    const printMap = (readOnly = false) => {
        const {model} = props;

        const options = {
            edit: {
                remove: false
            },
            draw: {
                polyline: false,
                polygon: false,
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false
            }
        };

        return (
            <Map
                className="boundaryGeometryMap"
                zoomControl={false}
                dragging={showOverlay}
                boxZoom={showOverlay}
                touchZoom={showOverlay}
                doubleClickZoom={showOverlay}
                scrollWheelZoom={showOverlay}
                bounds={model.geometry.getBoundsLatLng()}
                style={styles.map}
            >
                <BasicTileLayer/>
                <GeoJSON
                    key={model.geometry.hash()}
                    data={model.geometry.toGeoJSON()}
                    style={getStyle('area')}
                />
                {location.type === ELocationType.BBOX && !readOnly &&
                <div>
                    <FeatureGroup>
                        <EditControl
                            position="bottomright"
                            onEdited={handleEditPath}
                            onEditStart={toggleEditingState}
                            onEditStop={toggleEditingState}
                            {...options}
                        />
                        {drawObject(location)}
                    </FeatureGroup>
                </div>
                }
                {location.type === ELocationType.BBOX && readOnly &&
                <FeatureGroup>
                    {drawObject(location)}
                </FeatureGroup>
                }
                {location.type === ELocationType.OBJECT &&
                <div>
                    {
                        location.objects.map((object) => drawObject(object.position, 'red'))
                    }
                </div>
                }
            </Map>
        );
    };

    if (props.onlyBbox && props.onlyObjects) {
        throw new Error('The optimizationMap component can receive prop onlyBbox or onlyObjects but not both.');
    }

    return (
        <div>
            <Button
                fluid={true}
                onClick={handleClickToggleMap}
            >
                {props.label ? props.label : 'Edit Location'}
            </Button>
            {printMap(true)}
            {showOverlay &&
            <Modal size={'large'} open={true} onClose={handleCancelModal} dimmer={'inverted'}>
                <Modal.Header>{props.label ? props.label : 'Edit Location'}</Modal.Header>
                <Modal.Content>
                    <Grid divided={'vertically'}>
                        <Grid.Row columns={2}>
                            <Grid.Column width={7}>
                                <div>
                                    {!props.onlyBbox && !props.onlyObjects &&
                                    <Grid celled="internally">
                                        <Grid.Row textAlign="center">
                                            {!props.onlyBbox &&
                                            <Grid.Column width={8}>
                                                <Form.Checkbox
                                                    name="type"
                                                    label="At optimization object"
                                                    value="object"
                                                    checked={location.type === 'object'}
                                                    onChange={handleChangeLocationType}
                                                />
                                            </Grid.Column>
                                            }
                                            {!props.onlyObjects &&
                                            <Grid.Column width={8}>
                                                <Form.Checkbox
                                                    name="type"
                                                    label="At bounding box"
                                                    value="bbox"
                                                    checked={location.type === 'bbox'}
                                                    onChange={handleChangeLocationType}
                                                />
                                            </Grid.Column>
                                            }
                                        </Grid.Row>
                                    </Grid>
                                    }
                                    {location.type === ELocationType.BBOX &&
                                    <Segment color="blue">
                                        <Form>
                                            <Header as="h3" dividing={true}>Location</Header>
                                            <InputRange
                                                name="lay"
                                                from={location.lay.min}
                                                to={location.lay.max}
                                                label="Layer"
                                                label_from="min"
                                                label_to="max"
                                                onChange={handleChangeLocation}
                                            />
                                            <InputRange
                                                name="row"
                                                from={location.row.min}
                                                to={location.row.max}
                                                label="Row"
                                                label_from="min"
                                                label_to="max"
                                                onChange={handleChangeLocation}
                                            />
                                            <InputRange
                                                name="col"
                                                from={location.col.min}
                                                to={location.col.max}
                                                label="Column"
                                                label_from="min"
                                                label_to="max"
                                                onChange={handleChangeLocation}
                                            />
                                        </Form>
                                    </Segment>
                                    }
                                    {location.type === ELocationType.OBJECT &&
                                    <Segment color="blue">
                                        <Header as="h3" dividing={true}>Objects</Header>
                                        <InputObjectList
                                            name="objects"
                                            label="Optimization Objects"
                                            placeholder="object ="
                                            disabled={
                                                !(location.type !== ELocationType.OBJECT || (props.objectsCollection &&
                                                    location.objects.length >= props.objectsCollection.length))
                                            }
                                            addableObjects={
                                                props.objectsCollection && props.objectsCollection.length > 0
                                                    ? props.objectsCollection
                                                    : new OptimizationObjectsCollection()
                                            }
                                            objectsInList={
                                                location.objects && location.objects.length > 0
                                                    ? OptimizationObjectsCollection.fromObject(location.objects)
                                                    : new OptimizationObjectsCollection()
                                            }
                                            onChange={handleChangeLocationObjects}
                                        />
                                    </Segment>
                                    }
                                    {validationWarning
                                        ?
                                        <Message
                                            warning={true}
                                            header="Warning"
                                            content="Coordinates have to be located inside the model boundaries."
                                        />
                                        :
                                        <div/>
                                    }
                                </div>
                            </Grid.Column>
                            <Grid.Column width={9}>
                                <Segment attached="bottom">
                                    {printMap(location.type === ELocationType.OBJECT)}
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative={true} onClick={handleCancelModal}>Cancel</Button>
                    <Button
                        positive={true}
                        onClick={handleSaveModal}
                        disabled={hasError || validationWarning}
                    >
                        Save
                    </Button>
                </Modal.Actions>
            </Modal>
            }
        </div>
    );
};

export default optimizationMap;
