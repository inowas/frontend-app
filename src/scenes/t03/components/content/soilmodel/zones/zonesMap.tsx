import {BasicTileLayer} from '../../../../../../services/geoTools/tileLayers';
import {DrawEvents, LatLngExpression} from 'leaflet';
import {EditControl} from 'react-leaflet-draw';
import {FeatureGroup, LayersControl, Map, Polygon} from 'react-leaflet';
import {Geometry} from '../../../../../../core/model/geometry';
import {ModflowModel} from '../../../../../../core/model/modflow';
import {Zone, ZonesCollection} from '../../../../../../core/model/modflow/soilmodel';
import {renderAreaLayer, renderBoundaryOverlays, renderBoundingBoxLayer} from '../../../maps/mapLayers';
import {uniqueId} from 'lodash';
import BoundaryCollection from '../../../../../../core/model/modflow/boundaries/BoundaryCollection';
import React from 'react';

const styles = {
    map: {
        height: '400px',
        width: '100%'
    }
};

interface IProps {
    boundaries: BoundaryCollection;
    geometry?: Geometry;
    model: ModflowModel;
    zone?: Zone;
    zones: ZonesCollection;
    onCreatePath: (e: DrawEvents.Created) => any;
    onEditPath: (e: DrawEvents.Edited) => any;
    readOnly?: boolean;
}

const ZonesMap = (props: IProps) => {
    const {geometry, model, readOnly, zone, zones} = props;

    const options = {
        edit: {
            remove: false
        },
        draw: {
            polyline: false,
            polygon: !(zone && zone.geometry) && !geometry,
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            poly: {
                allowIntersection: false
            }
        }
    };

    const getGeometry = () => {
        if (zone && zone.geometry) {
            return Geometry.fromGeoJson(zone.geometry);
        }
        if (geometry) {
            return Geometry.fromGeoJson(geometry);
        }
        return null;
    };

    const bgZones = zone ? zones.findBy('id', zone.id, false) : zones.all;
    const iGeometry = getGeometry();

    return (
        <Map
            key={zone ? zone.id : undefined}
            zoomControl={false}
            dragging={!readOnly}
            maxZoom={16}
            boxZoom={!readOnly}
            touchZoom={!readOnly}
            doubleClickZoom={!readOnly}
            scrollWheelZoom={!readOnly}
            bounds={model.boundingBox.getBoundsLatLng()}
            style={styles.map}
        >
            <BasicTileLayer/>
            {renderBoundingBoxLayer(model.boundingBox, model.rotation, model.geometry)}
            {renderAreaLayer(model.geometry)}
            {props.boundaries.length > 0 &&
            <LayersControl position="topright">
                {renderBoundaryOverlays(props.boundaries)}
            </LayersControl>
            }
            {bgZones.length > 0 ?
                <FeatureGroup>
                    {bgZones.map((z) => {
                        if (z.geometry) {
                            return (
                                <Polygon
                                    key={z.id}
                                    id={z.id}
                                    positions={Geometry.fromGeoJson(z.geometry).coordinatesLatLng as LatLngExpression[]}
                                    color="grey"
                                    weight={1}
                                    fillOpacity={0.3}
                                />
                            );
                        }

                        return null;

                    }).filter(x => x)}
                </FeatureGroup>
                :
                <div/>
            }
            <FeatureGroup>
                {!readOnly &&
                <EditControl
                    position="bottomright"
                    onCreated={props.onCreatePath}
                    onEdited={props.onEditPath}
                    {...options}
                />
                }
                {iGeometry &&
                <Polygon
                    key={uniqueId(iGeometry.hash())}
                    id={-1}
                    positions={iGeometry.coordinatesLatLng as LatLngExpression[]}
                    color="#7C4DFF"
                />
                }
            </FeatureGroup>
        </Map>
    );
};

export default ZonesMap;
