import {BasicTileLayer} from '../../../services/geoTools/tileLayers';
import {CircleMarker, FeatureGroup, Map} from 'react-leaflet';
import {DrawEvents} from 'leaflet';
import {EditControl} from 'react-leaflet-draw';
import {GeoJson} from '../../../core/model/geometry/Geometry.type';
import {Geometry} from '../../../core/model/modflow';
import {Point} from 'geojson';
import {Rtm, Sensor} from '../../../core/model/rtm/monitoring';
import {SensorCollection} from '../../../core/model/rtm/monitoring/SensorCollection';
import {getStyle} from '../../../services/geoTools/mapHelpers';
import {uniqueId} from 'lodash';
import {usePrevious} from '../../shared/simpleTools/helpers/customHooks';
import CenterControl from '../../shared/leaflet/CenterControl';
import React, {useEffect, useRef, useState} from 'react';
import uuidv4 from 'uuid/v4';

interface IProps {
    readOnly?: boolean;
    rtm: Rtm;
    onChangeGeometry: (point: Point) => any;
    onToggleEditMode?: () => any;
    geometry?: Point;
    sensor?: Sensor;
}

const style = {
    map: {
        height: '400px'
    }
};

const SensorMap = (props: IProps) => {
    const [mapKey, setMapKey] = useState<string>(uuidv4());
    const [geometry, setGeometry] = useState<GeoJson | null>(
        props.geometry ? Geometry.fromGeoJson(props.geometry).toObject() : null
    );
    const refMap = useRef<Map>(null);
    const refPrevSensor = usePrevious<Sensor>(props.sensor);

    const setBoundingBox = () => {
        let bGeometry = props.rtm.geometry;
        if (!bGeometry) {
            bGeometry = Geometry.fromGeoJson({
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [[[13.74, 51.03], [13.75, 51.03], [13.75, 51.04], [13.74, 51.04], [13.74, 51.03]]]
                }
            });
        }
        return bGeometry.getBoundsLatLng();
    };

    const [boundingBox] = useState<Array<[number, number]>>(setBoundingBox());

    useEffect(() => {
        setGeometry(props.geometry ? Geometry.fromGeoJson(props.geometry).toObject() : null);
        if (props.geometry && refMap.current) {
            refMap.current.leafletElement.panTo({
                lat: props.geometry.coordinates[1],
                lng: props.geometry.coordinates[0]
            });
        }
    }, [props.geometry]);

    useEffect(() => {
        if (refPrevSensor && props.sensor && refPrevSensor.id !== props.sensor.id) {
            if (refMap && refMap.current) {
                const latLng = {
                    lat: props.sensor.geolocation.coordinates[1],
                    lng: props.sensor.geolocation.coordinates[0]
                };
                refMap.current.leafletElement.flyTo(latLng);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.sensor]);

    const handleCreated = (e: DrawEvents.Created) => {
        const cGeometry = Geometry.fromGeoJson(e.layer.toGeoJSON()).toObject() as Point;
        setMapKey(uuidv4());
        props.onChangeGeometry(cGeometry);
        return setGeometry(cGeometry);
    };

    const handleEdited = (e: DrawEvents.Edited) => {
        e.layers.eachLayer((layer: any) => {
            const cGeometry = Geometry.fromGeoJson(layer.toGeoJSON()).toObject() as Point;
            props.onChangeGeometry(cGeometry);
            return setGeometry(cGeometry);
        });
    };

    const editControl = () => {
        return (
            <FeatureGroup>
                <EditControl
                    position="topright"
                    draw={{
                        circle: false,
                        circlemarker: !geometry && !props.readOnly,
                        marker: false,
                        polyline: false,
                        rectangle: false,
                        polygon: false
                    }}
                    edit={{
                        edit: !!geometry && !props.readOnly,
                        remove: false
                    }}
                    onCreated={handleCreated}
                    onEdited={handleEdited}
                    onEditStart={props.onToggleEditMode}
                    onEditStop={props.onToggleEditMode}
                />
                {geometry && renderGeometry()}
            </FeatureGroup>
        );
    };

    const renderGeometry = () => {
        const rGeometry = Geometry.fromGeoJson(geometry);

        return (
            <CircleMarker
                key={uniqueId(rGeometry.hash())}
                center={[
                    rGeometry.coordinates[1],
                    rGeometry.coordinates[0]
                ]}
                {...getStyle('sensor_active')}
            />
        );
    };

    const renderSensors = (sensors: SensorCollection) => {
        return sensors.all.filter((s) => !props.sensor || (props.sensor && s.id !== props.sensor.id)).map((s) => {
            const rGeometry = Geometry.fromGeoJson(s.geolocation);
            return (
                <CircleMarker
                    key={uniqueId(rGeometry.hash())}
                    center={[
                        rGeometry.coordinates[1],
                        rGeometry.coordinates[0]
                    ]}
                    {...getStyle('sensor')}
                />
            );
        });
    };

    return (
        <Map
            style={style.map}
            bounds={boundingBox}
            ref={refMap}
            key={mapKey}
        >
            {refMap && refMap.current &&
            <CenterControl
                map={refMap.current}
                bounds={boundingBox}
            />
            }
            <BasicTileLayer/>
            {editControl()}
            <FeatureGroup>
                {renderSensors(props.rtm.sensors)}
            </FeatureGroup>
        </Map>
    );
};

export default SensorMap;
