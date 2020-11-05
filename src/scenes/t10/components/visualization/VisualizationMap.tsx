import {LatLngExpression} from 'leaflet';
import _ from 'lodash';
import React, {SyntheticEvent, useState} from 'react';
import {CircleMarker, Map, Tooltip} from 'react-leaflet';
import {Button, Dropdown, DropdownProps, Grid, Popup} from 'semantic-ui-react';
import {BoundingBox} from '../../../../core/model/geometry';
import {Rtm} from '../../../../core/model/rtm/monitoring';
import {ISensor} from '../../../../core/model/rtm/monitoring/Sensor.type';
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
    timeRef: number;
    timestamp: number;
    tsData: ITimeStamps;
}

const VisualizationMap = (props: IProps) => {
    const [selectedParameter, setSelectedParameter] = useState<string | undefined>(props.parameters[0].parameter.type);
    const [showScale, setShowScale] = useState<boolean>(false);

    const getMinMax = () => {
        const params = props.parameters.filter((p) => p.parameter.type === selectedParameter);
        const left = params.filter((p) => p.meta.axis === 'left');
        const right = params.filter((p) => p.meta.axis === 'right');
        if (left.length > 0 && right.length > 0) {
            return {
                min: Math.min(props.tsData.left.min, props.tsData.right.min),
                max: Math.max(props.tsData.left.max, props.tsData.right.max)
            };
        }
        if (left.length > 0) {
            return {
                min: props.tsData.left.min,
                max: props.tsData.left.max
            };
        }
        if (right.length > 0) {
            return {
                min: props.tsData.right.min,
                max: props.tsData.right.max
            };
        }
        return {
            min: 0,
            max: 0
        };
    };

    const rainbow = rainbowFactory(getMinMax(), heatMapColors.default);

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

    const handleToggleScale = () => setShowScale(!showScale);

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

            if (showScale && props.tsData) {
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

    const handleChangeParameter = (e: SyntheticEvent, {value}: DropdownProps) => {
        if (typeof value === 'string') {
            return setSelectedParameter(value);
        }
    };

    const selectOptions = _.uniq(props.parameters.map((p) => p.parameter.type)).map((p) => {
        return {key: p, value: p, text: p};
    });

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column>
                        <Popup
                            content="Show color scale"
                            trigger={
                                <Button
                                    onClick={handleToggleScale}
                                    icon="chart pie"
                                    primary={showScale}
                                />
                            }
                        />
                        <Dropdown
                            search={true}
                            selection={true}
                            onChange={handleChangeParameter}
                            options={selectOptions}
                            placeholder="Select parameter"
                            value={selectedParameter}
                        />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    {selectedParameter &&
                    <Map
                        maxZoom={19}
                        bounds={calculateBoundingBox().getBoundsLatLng()}
                        style={{
                            height: '400px',
                            width: '100%',
                            zIndex: 1
                        }}
                    >
                        <BasicTileLayer/>
                        {props.rtm.sensors.all.filter(
                            (s) => props.parameters.filter(
                                (p) => p.meta.active && p.sensor.id === s.id && p.parameter.type === selectedParameter
                            ).length > 0
                        ).map((s, sKey) => {
                            return renderMarker(sKey, s.toObject());
                        })}
                        {showScale && renderLegend()}
                    </Map>
                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default VisualizationMap;
