import {Point} from 'geojson';
import {DrawEvents} from 'leaflet';
import {uniqueId} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {CircleMarker, FeatureGroup, Map} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import {GeoJson} from '../../../core/model/geometry/Geometry.type';
import {Geometry} from '../../../core/model/modflow';
import {Rtm, Sensor} from '../../../core/model/rtm';
import {SensorCollection} from '../../../core/model/rtm/SensorCollection';
import {getStyle} from '../../../services/geoTools/mapHelpers';
import {BasicTileLayer} from '../../../services/geoTools/tileLayers';
import CenterControl from '../../shared/leaflet/CenterControl';
import {usePrevious} from '../../shared/simpleTools/helpers/customHooks';

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
        height: '400px',
        marginBottom: '20px',
        marginTop: '20px'
    }
};

const flyToZoomLevel: number = 15;

const sensorMap = (props: IProps) => {
    const [geometry, setGeometry] = useState<GeoJson | null>(
        props.geometry ? Geometry.fromGeoJson(props.geometry).toObject() : null
    );
    const refMap = useRef<Map>(null);
    const refPrevSensor = usePrevious<Sensor>(props.sensor);

    useEffect(() => {
        setGeometry(props.geometry ? Geometry.fromGeoJson(props.geometry).toObject() : null);
    }, [props.geometry]);

    useEffect(() => {
        if (refPrevSensor && props.sensor && refPrevSensor.id !== props.sensor.id) {
            if (refMap && refMap.current) {
                const latLng = {
                    lat: props.sensor.geolocation.coordinates[1],
                    lng: props.sensor.geolocation.coordinates[0]
                };
                refMap.current.leafletElement.flyTo(latLng, flyToZoomLevel);
            }
        }
    }, [props.sensor]);

    const handleCreated = (e: DrawEvents.Created) => {
        const cGeometry = Geometry.fromGeoJson(e.layer.toGeoJSON()).toObject() as Point;
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
        return sensors.all.filter((s) => props.sensor && s.id !== props.sensor.id).map((s) => {
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

    return (
        <Map
            style={style.map}
            bounds={bGeometry.getBoundsLatLng()}
            ref={refMap}
        >
            {refMap && refMap.current &&
            <CenterControl
                map={refMap.current}
                bounds={bGeometry.getBoundsLatLng()}
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

export default sensorMap;
