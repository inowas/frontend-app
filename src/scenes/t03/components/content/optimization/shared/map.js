import React from 'react';
import PropTypes from 'prop-types';
import {GeoJSON, Map, Rectangle, FeatureGroup, CircleMarker} from 'react-leaflet';
import {uniqueId} from 'lodash';
import {Button, Form, Grid, Header, Message, Modal, Segment} from 'semantic-ui-react';
import InputRange from './inputRange';
import InputObjectList from './inputObjectList';
import {EditControl} from 'react-leaflet-draw';
import {getActiveCellFromCoordinate} from 'services/geoTools';
import {ModflowModel} from 'core/model/modflow';
import {getBoundsLatLonFromGeoJSON} from 'services/geoTools';
import {generateKey, getStyle} from '../../../maps';
import {BasicTileLayer} from 'services/geoTools/tileLayers';
import {AbstractPosition, OptimizationLocation, OptimizationObjectsCollection} from 'core/model/modflow/optimization';

const styles = {
    map: {
        height: '400px',
        width: '100%'
    }
};

class OptimizationMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            location: {
                ...this.props.location.toObject(),
                type: this.props.location.type ? this.props.location.type : 'bbox',
                objects: this.props.location.objectsCollection ? this.props.location.objectsCollection.toArray() : []
            },
            showOverlay: false,
            hasError: false,
            validationWarning: false,
            isEditing: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            location: {
                ...nextProps.location.toObject(),
                type: nextProps.location.type ? nextProps.location.type : 'bbox',
                objects: nextProps.location.objectsCollection ? nextProps.location.objectsCollection.toArray() : []
            }
        });
    }

    toggleEditingState = () => this.setState({
        isEditing: !this.state.isEditing
    });

    validateLocation = p => p.col.min <= p.col.max && p.row.min <= p.row.max && p.col.min >= 0 && p.row.min >= 0 && p.col.max <= this.props.model.gridSize.nX && p.row.max <= this.props.model.gridSize.nY;

    handleChangeLocation = ({name, from, to}) => {
        const location = {
            ...this.state.location,
            [name]: {
                ...this.state.location[name],
                min: from,
                max: to
            }
        };

        return this.setState({
            validationWarning: !this.validateLocation(location),
            location: location
        });
    };

    handleChangeLocationType = (e, {name, value}) => this.setState({
        location: {
            ...this.state.location,
            [name]: value
        },
        validationWarning: value === 'bbox' && !this.validateLocation(this.state.location)
    });

    handleChangeLocationObjects = objectsCollection => {
        const location = OptimizationLocation.fromObject(this.state.location);
        location.objectsCollection = objectsCollection;
        return this.setState({
            location: location.toObject()
        });
    };

    drawObject = (location, color = 'red') => {
        const styles = {
            line: {
                color: color,
                weight: 0.3
            }
        };

        const bbox = this.props.model.boundingBox;
        const gridSize = this.props.model.gridSize;

        const dX = (bbox.xMax - bbox.xMin) / gridSize.nX;
        const dY = (bbox.yMax - bbox.yMin) / gridSize.nY;

        const cXmin = bbox.xMin + location.col.min * dX;
        const cXmax = bbox.xMin + location.col.max * dX;
        const cYmin = bbox.yMax - location.row.min * dY;
        const cYmax = bbox.yMax - location.row.max * dY;

        if (cXmin === cXmax && cYmin === cYmax && !this.state.isEditing) {
            return (
                <CircleMarker
                    key={uniqueId()}
                    center={[
                        cYmin,
                        cXmin
                    ]}
                    {...styles.line}
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
                {...styles.line}
            />
        );
    };

    onEditPath = e => {
        const layers = e.layers;

        layers.eachLayer(layer => {
            const geoJson = layer.toGeoJSON();
            const geometry = geoJson.geometry;

            // Latitude (S/N)
            let ymin = 90;
            let ymax = -90;
            // Longitude (E/W)
            let xmin = 180;
            let xmax = -180;

            geometry.coordinates[0].forEach(c => {
                if (c[0] <= xmin) {
                    xmin = c[0];
                }
                if (c[0] >= xmax) {
                    xmax = c[0];
                }
                if (c[1] <= ymin) {
                    ymin = c[1];
                }
                if (c[1] >= ymax) {
                    ymax = c[1];
                }
            });

            const cmin = getActiveCellFromCoordinate([xmin, ymax], this.props.model.boundingBox, this.props.model.gridSize);
            const cmax = getActiveCellFromCoordinate([xmax, ymin], this.props.model.boundingBox, this.props.model.gridSize);

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

            return this.setState({
                validationWarning: !this.validateLocation(p),
                location: {
                    ...this.state.location,
                    row: {
                        ...this.state.location.row,
                        min: p.row.min,
                        max: p.row.max
                    },
                    col: {
                        ...this.state.location.col,
                        min: p.col.min,
                        max: p.col.max
                    }
                }
            });
        });
    };

    onSaveModal = (e) => {
        this.props.onChange(e, {
            'name': this.props.name,
            'value': this.state.location
        });
        return this.setState({
            showOverlay: false
        });
    };

    onCancelModal = () => this.setState({
        showOverlay: false
    });

    onClickToggleMap = () => this.setState({
        showOverlay: true
    });

    printMap(readOnly = false) {
        const {model} = this.props;

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
                dragging={this.state.showOverlay}
                boxZoom={this.state.showOverlay}
                touchZoom={this.state.showOverlay}
                doubleClickZoom={this.state.showOverlay}
                scrollWheelZoom={this.state.showOverlay}
                bounds={getBoundsLatLonFromGeoJSON(model.geometry.toGeoJSON())}
                ref={map => {
                    this.map = map
                }}
                style={styles.map}
            >
                <BasicTileLayer/>
                <GeoJSON
                    key={generateKey(model.geometry.toGeoJSON())}
                    data={model.geometry.toGeoJSON()}
                    style={getStyle('area')}
                />
                {this.state.location.type === 'bbox' && !readOnly &&
                <div>
                    <FeatureGroup>
                        <EditControl
                            position="bottomright"
                            onEdited={this.onEditPath}
                            onEditStart={this.toggleEditingState}
                            onEditStop={this.toggleEditingState}
                            {...options}
                        />
                        {this.drawObject(this.state.location)}
                    </FeatureGroup>
                </div>
                }
                {this.state.location.type === 'bbox' && readOnly &&
                <FeatureGroup>
                    {this.drawObject(this.state.location)}
                </FeatureGroup>
                }
                {this.state.location.type === 'object' &&
                <div>
                    {
                        this.state.location.objects.map(object => this.drawObject(object.position, 'red'))
                    }
                </div>
                }
            </Map>
        );
    }

    render() {
        if (this.props.onlyBbox && this.props.onlyObjects) {
            throw new Error('The optimizationMap component can receive prop onlyBbox or onlyObjects but not both.');
        }

        return (
            <div>
                <Button fluid
                        onClick={this.onClickToggleMap}
                >
                    {this.props.label ? this.props.label : 'Edit Location'}
                </Button>
                {this.printMap(true)}
                {this.state.showOverlay &&
                <Modal size={'large'} open onClose={this.onCancelModal} dimmer={'inverted'}>
                    <Modal.Header>{this.props.label ? this.props.label : 'Edit Location'}</Modal.Header>
                    <Modal.Content>
                        <Grid divided={'vertically'}>
                            <Grid.Row columns={2}>
                                <Grid.Column width={7}>
                                    <div>
                                        {!this.props.onlyBbox && !this.props.onlyObjects &&
                                        <Grid celled="internally">
                                            <Grid.Row textAlign="center">
                                                {!this.props.onlyBbox &&
                                                <Grid.Column width={8}>
                                                    <Form.Checkbox
                                                        name="type"
                                                        label="At optimization object"
                                                        value="object"
                                                        checked={this.state.location.type === 'object'}
                                                        onChange={this.handleChangeLocationType}
                                                    />
                                                </Grid.Column>
                                                }
                                                {!this.props.onlyObjects &&
                                                <Grid.Column width={8}>
                                                    <Form.Checkbox
                                                        name="type"
                                                        label="At bounding box"
                                                        value="bbox"
                                                        checked={this.state.location.type === 'bbox'}
                                                        onChange={this.handleChangeLocationType}
                                                    />
                                                </Grid.Column>
                                                }
                                            </Grid.Row>
                                        </Grid>
                                        }
                                        {this.state.location.type === 'bbox' &&
                                        <Segment color="blue">
                                            <Form>
                                                <Header as="h3" dividing>Location</Header>
                                                <InputRange
                                                    name="lay"
                                                    from={this.state.location.lay.min}
                                                    to={this.state.location.lay.max}
                                                    label="Layer"
                                                    label_from="min"
                                                    label_to="max"
                                                    onChange={this.handleChangeLocation}
                                                />
                                                <InputRange
                                                    name="row"
                                                    from={this.state.location.row.min}
                                                    to={this.state.location.row.max}
                                                    label="Row"
                                                    label_from="min"
                                                    label_to="max"
                                                    onChange={this.handleChangeLocation}
                                                />
                                                <InputRange
                                                    name="col"
                                                    from={this.state.location.col.min}
                                                    to={this.state.location.col.max}
                                                    label="Column"
                                                    label_from="min"
                                                    label_to="max"
                                                    onChange={this.handleChangeLocation}
                                                />
                                            </Form>
                                        </Segment>
                                        }
                                        {this.state.location.type === 'object' &&
                                        <Segment color="blue">
                                            <Header as="h3" dividing>Objects</Header>
                                            <InputObjectList
                                                name="objects"
                                                label="Optimization Objects"
                                                placeholder="object ="
                                                disabled={this.state.location.type !== 'object' || this.state.location.objects.length >= this.props.objectsCollection.length}
                                                addableObjects={
                                                    this.props.objectsCollection && this.props.objectsCollection.length > 0
                                                        ? this.props.objectsCollection
                                                        : new OptimizationObjectsCollection()
                                                }
                                                objectsInList={
                                                    this.state.location.objects && this.state.location.objects.length > 0
                                                        ? OptimizationObjectsCollection.fromArray(this.state.location.objects)
                                                        : new OptimizationObjectsCollection()
                                                }
                                                onChange={this.handleChangeLocationObjects}
                                            />
                                        </Segment>
                                        }
                                        {this.state.validationWarning
                                            ?
                                            <Message
                                                warning
                                                header='Warning'
                                                content='Coordinates have to be located inside the model boundaries.'
                                            />
                                            :
                                            <div/>
                                        }
                                    </div>
                                </Grid.Column>
                                <Grid.Column width={9}>
                                    <Segment attached="bottom">
                                        {this.printMap(this.state.location.type === 'object')}
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button negative onClick={this.onCancelModal}>Cancel</Button>
                        <Button
                            positive
                            onClick={this.onSaveModal}
                            disabled={this.state.hasError || this.state.validationWarning}>
                            Save
                        </Button>
                    </Modal.Actions>
                </Modal>
                }
            </div>
        );
    }
}

OptimizationMap.propTypes = {
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.instanceOf(AbstractPosition).isRequired,
    label: PropTypes.string,
    objectsCollection: PropTypes.instanceOf(OptimizationObjectsCollection),
    onlyObjects: PropTypes.bool,
    onlyBbox: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
};

export default OptimizationMap;