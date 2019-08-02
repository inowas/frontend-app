import {DrawEvents} from 'leaflet';
import React, {useRef} from 'react';
import {FeatureGroup, GeoJSON, Map, MapProps, Polygon} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import {IBoundingBox} from '../../../core/model/geometry/BoundingBox.type';
import {BoundingBox} from '../../../core/model/modflow';
import {IZone} from '../../../core/model/zones/Zone.type';
import {getStyle} from '../../../services/geoTools/mapHelpers';
import {BasicTileLayer} from '../../../services/geoTools/tileLayers';

const styles = {
    map: {
        height: '400px',
        width: '100%'
    }
};

interface IProps {
    boundingBox: IBoundingBox;
    zone: IZone;
    zones: IZone[];
    onCreatePath: (e: DrawEvents.Created) => any;
    onEditPath: (e: DrawEvents.Edited) => any;
    readOnly: boolean;
}

const zonesMap = (props: IProps) => {
    const {readOnly, zone, zones} = props;
    const boundingBox = BoundingBox.fromObject(props.boundingBox);
    const options = {
        edit: {
            remove: false
        },
        draw: {
            polyline: false,
            polygon: !zone.geometry,
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            poly: {
                allowIntersection: false
            }
        }
    };

    const bgZones = zones.filter((z) => z.id !== zone.id && z.priority !== 0);

    let mapRef = null;
    const createMapRef = (map: Map<MapProps>) => {
        mapRef = useRef(map);
    };

    return (
        <Map
            zoomControl={false}
            dragging={!readOnly}
            boxZoom={!readOnly}
            touchZoom={!readOnly}
            doubleClickZoom={!readOnly}
            scrollWheelZoom={!readOnly}
            bounds={boundingBox.getBoundsLatLng()}
            ref={createMapRef}
            style={styles.map}
        >
            <BasicTileLayer/>
            <GeoJSON
                key={boundingBox.hash()}
                data={boundingBox.geoJson}
                style={getStyle('area')}
            />
            {bgZones.length > 0 ?
                <FeatureGroup>
                    {bgZones.map((z) => {
                        if (z.geometry) {
                            return (
                                <Polygon
                                    key={z.id}
                                    id={z.id}
                                    positions={z.geometry}
                                    color="grey"
                                    weight={1}
                                    fillOpacity={0.3}
                                />
                            );
                        }
                    })}
                </FeatureGroup>
                :
                <div/>
            }
            <FeatureGroup>
                <EditControl
                    position="bottomright"
                    onCreated={props.onCreatePath}
                    onEdited={props.onEditPath}
                    {...options}
                />
                {zone.geometry &&
                <Polygon
                    key={zone.id}
                    id={zone.id}
                    positions={zone.geometry}
                    color="#7C4DFF"
                />
                }
            </FeatureGroup>
        </Map>
    );
};

export default zonesMap;
