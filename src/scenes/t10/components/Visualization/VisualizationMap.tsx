import {LatLngExpression} from 'leaflet';
import React from 'react';
import {CircleMarker, Map, Tooltip} from 'react-leaflet';
import {BoundingBox} from '../../../../core/model/geometry';
import { Rtm } from '../../../../core/model/rtm';
import {ISensor} from '../../../../core/model/rtm/Sensor.type';
import {BasicTileLayer} from '../../../../services/geoTools/tileLayers';
import {ColorLegend} from '../../../shared/rasterData';
import {rainbowFactory} from '../../../shared/rasterData/helpers';
import {heatMapColors} from '../../../t05/defaults/gis';
import {IParameterWithMetaData, ITimeStamps} from './types';

interface IProps {
    data: IParameterWithMetaData[];
    isAnimated: boolean;
    parameters: IParameterWithMetaData[];
    rtm: Rtm;
    showScale: boolean;
    timeRef: number;
    timestamp: number;
    tsData: ITimeStamps;
}

const visualizationMap = (props: IProps) => {
    const rainbow = rainbowFactory({
        min: Math.min(props.tsData.left.min, props.tsData.right.min),
        max: Math.max(props.tsData.left.max, props.tsData.right.max)
    }, heatMapColors.default);

    const calculateBoundingBox = () => {
        return BoundingBox.fromPoints(
            props.rtm.sensors.all.filter(
                (s) => props.parameters.filter((p) => p.sensor.id === s.id).length > 0
            ).map((s) => {
                return {
                    type: 'Point',
                    coordinates: [s.geolocation.coordinates[0], s.geolocation.coordinates[1]]
                };
            })
        );
    };

    const renderLegend = () => {
        const gradients = rainbow.gradients.slice().reverse();
        const lastGradient = gradients[gradients.length - 1];
        const legend = gradients.map((gradient) => ({
            color: '#' + gradient.endColor,
            value: Number(gradient.maxNum).toFixed(2)
        }));

        legend.push({
            color: '#' + lastGradient.startColor,
            value: Number(lastGradient.minNum).toFixed(2)
        });
        return <ColorLegend legend={legend} unit={''}/>;
    };

    const renderMarker = (key: number, sensor: ISensor) => {
        const parameter = props.data.filter((p) => p.sensor.id === sensor.id);
        if (parameter.length > 0) {
            let fillColor = parameter[0].meta.color;
            let fillOpacity = 0.8;
            let value = null;

            if (props.showScale && props.tsData) {
                const row = parameter[0].data.filter((r) => r.x === (props.isAnimated ? props.tsData.timestamps[
                    props.timeRef] : props.timestamp));
                if (row.length > 0) {
                    value = row[0].y;
                    fillColor = `#${rainbow.colorAt(row[0].y)}`;
                } else {
                    fillColor = `#000`;
                    fillOpacity = 0.3;
                }
            }

            return (
                <CircleMarker
                    center={
                        [
                            sensor.geolocation.coordinates[1],
                            sensor.geolocation.coordinates[0]
                        ] as LatLngExpression
                    }
                    fillColor={fillColor}
                    fillOpacity={fillOpacity}
                    key={key}
                    radius={10}
                    stroke={false}
                >
                    <Tooltip direction="top">
                        {sensor.name} {value ? `(${value})` : null}
                    </Tooltip>
                </CircleMarker>
            );
        }
        return null;
    };

    return (
        <Map
            maxZoom={19}
            bounds={calculateBoundingBox().getBoundsLatLng()}
            style={{
                height: '400px',
                width: '100%'
            }}
        >
            <BasicTileLayer/>
            {props.rtm.sensors.all.filter(
                (s) => props.parameters.filter(
                    (p) => p.meta.active && p.sensor.id === s.id
                ).length > 0
            ).map((s, sKey) => {
                return renderMarker(sKey, s.toObject());
            })}
            {props.showScale && renderLegend()}
        </Map>
    );
};

export default visualizationMap;
