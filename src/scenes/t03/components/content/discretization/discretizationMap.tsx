import {Control, DrawEvents, LatLngBoundsExpression, LatLngExpression} from 'leaflet';
import _, {uniqueId} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {Polygon} from 'react-leaflet';
import {FeatureGroup, LayersControl, Map} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import {Button} from 'semantic-ui-react';
import {BoundingBox, Cells, Geometry, GridSize} from '../../../../../core/model/geometry';
import {IGeometry} from '../../../../../core/model/geometry/Geometry.type';
import BoundaryCollection from '../../../../../core/model/modflow/boundaries/BoundaryCollection';
import AffectedCellsLayer from '../../../../../services/geoTools/affectedCellsLayer';
import {rotateCoordinateAroundPoint} from '../../../../../services/geoTools/getCellFromClick';
import {BasicTileLayer} from '../../../../../services/geoTools/tileLayers';
import {renderBoundaryOverlays, renderBoundingBoxLayer} from '../../maps/mapLayers';

interface IProps {
    boundingBox: BoundingBox;
    boundaries: BoundaryCollection;
    cells: Cells | null;
    geometry: Geometry | null;
    gridSize: GridSize;
    intersection?: number;
    readOnly: boolean;
    rotation?: number;
    onChangeCells: (cells: Cells) => void;
    onChangeGeometry?: (geometry: Geometry) => void;
    onChangeIntersection?: (intersection: number) => void;
}

const style = {
    map: {
        height: '400px',
        width: '100%'
    }
};

const discretizationMap = (props: IProps) => {
    const cellsRef = useRef<Cells | null>(null);
    const mapRef = useRef<Map>(null);
    const readOnlyRef = useRef<boolean>(true);
    const isDrawingRef = useRef<boolean>(false);
    const refDrawControl = useRef<Control>(null);
    const [geometry, setGeometry] = useState<IGeometry | null>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);

    useEffect(() => {
        if (props.cells) {
            cellsRef.current = props.cells;
        }

        if (props.geometry) {
            setGeometry(props.geometry.toObject());
        }

        readOnlyRef.current = props.readOnly;
    }, []);

    useEffect(() => {
        if (props.cells) {
            cellsRef.current = props.cells;
        }
    }, [props.cells]);

    useEffect(() => {
        readOnlyRef.current = props.readOnly;
    }, [props.readOnly]);

    const onCreated = (e: DrawEvents.Created) => {
        if (e.layerType === 'rectangle' || e.layerType === 'polyline') {
            if (!cellsRef.current) {
                return;
            }

            if (mapRef && mapRef.current) {
                mapRef.current.leafletElement.removeLayer(e.layer);
            }

            const c: Cells = cellsRef.current;
            c.toggleByGeometry(Geometry.fromGeoJson(e.layer.toGeoJSON()), props.boundingBox, props.gridSize);
            cellsRef.current = c;
            return props.onChangeCells(c);
        }
        if (!props.onChangeGeometry) {
            return;
        }
        const polygon = e.layer;
        const g = Geometry.fromGeoJson(polygon.toGeoJSON());
        setGeometry(g.toObject());
        return props.onChangeGeometry(g);
    };

    const onEdited = (e: DrawEvents.Edited) => {
        e.layers.eachLayer((layer: any) => {
            if (!props.onChangeGeometry) {
                return;
            }
            const g = Geometry.fromGeoJson(layer.toGeoJSON());
            setGeometry(g.toObject());
            props.onChangeGeometry(g);
        });
    };

    const getBoundsLatLng = () => {
        if (props.boundingBox) {
            return props.boundingBox.getBoundsLatLng();
        }

        if (geometry) {
            return Geometry.fromObject(geometry).getBoundsLatLng();
        }

        return [[60, 10], [45, 30]];
    };

    const handleClickOnMap = ({latlng}: { latlng: any }) => {
        if (isDrawingRef.current || readOnlyRef.current || !cellsRef.current || !props.boundingBox || !props.gridSize
            || !props.geometry) {
            return null;
        }

        const latlngRot = props.rotation ?
            rotateCoordinateAroundPoint(latlng, props.geometry.centerOfMass, props.rotation) : latlng;
        const x = latlngRot.lng;
        const y = latlngRot.lat;

        const c: Cells = cellsRef.current;
        c.toggle([x, y], props.boundingBox, props.gridSize);
        cellsRef.current = _.cloneDeep(c);
        props.onChangeCells(c);
    };

    const handleToggleDrawing = () => setIsDrawing(!isDrawing);

    const renderActiveCellsLayer = () => {
        if (!props.cells) {
            return null;
        }
        if (props.geometry && props.rotation && props.rotation % 360 !== 0) {
            return (
                <AffectedCellsLayer
                    boundingBox={props.boundingBox}
                    gridSize={props.gridSize}
                    cells={props.cells}
                    rotation={{geometry: props.geometry, angle: props.rotation}}
                />
            );
        }
        return (
            <AffectedCellsLayer
                boundingBox={props.boundingBox}
                gridSize={props.gridSize}
                cells={props.cells}
            />
        );
    };

    return (
        <React.Fragment>
            {!props.readOnly &&
            <Button.Group attached="top">
                <Button primary={!isDrawing} onClick={handleToggleDrawing}>Single Selection</Button>
                <Button primary={isDrawing} onClick={handleToggleDrawing}>Multi-Selection</Button>
            </Button.Group>
            }
            <Map
                style={style.map}
                bounds={getBoundsLatLng() as LatLngBoundsExpression}
                maxZoom={16}
                onclick={handleClickOnMap}
                ref={mapRef}
            >
                <BasicTileLayer/>
                {!props.readOnly && <FeatureGroup>
                    <EditControl
                        position="topright"
                        draw={{
                            circle: false,
                            circlemarker: false,
                            marker: false,
                            polyline: isDrawing && geometry !== null,
                            rectangle: isDrawing && geometry !== null,
                            polygon: geometry === null
                        }}
                        edit={{
                            edit: geometry !== null && !!props.onChangeGeometry,
                            remove: false
                        }}
                        onCreated={onCreated}
                        onEdited={onEdited}
                        ref={refDrawControl}
                    />
                    {geometry &&
                    <Polygon
                        key={uniqueId()}
                        positions={Geometry.fromObject(geometry).coordinatesLatLng as LatLngExpression[]}
                    />
                    }
                </FeatureGroup>
                }
                {props.boundaries.length > 0 &&
                <LayersControl position="topright">
                    {renderBoundaryOverlays(props.boundaries)}
                </LayersControl>
                }
                {renderActiveCellsLayer()}
                {renderBoundingBoxLayer(props.boundingBox, props.rotation, props.geometry || undefined)}
            </Map>
        </React.Fragment>
    );
};

export default discretizationMap;
