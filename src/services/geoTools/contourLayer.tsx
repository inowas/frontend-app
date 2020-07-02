import * as turf from '@turf/turf';
import {ContourMultiPolygon} from 'd3';
import * as d3 from 'd3';
import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import {GeoJSON, LayersControl} from 'react-leaflet';
import uuid from 'uuid';
import {Array2D} from '../../core/model/geometry/Array2D.type';
import {BoundingBox, Geometry, GridSize} from '../../core/model/modflow';
import {max, min} from '../../scenes/shared/rasterData/helpers';
import Rainbow from '../rainbowvis/Rainbowvis';

interface IProps {
    boundingBox: BoundingBox;
    data: number | Array2D<number>;
    discrete?: boolean;
    geometry: Geometry;
    gridSize: GridSize;
    rainbow: Rainbow;
    resolution?: number;
    rotation: number;
}

const contourLayer = (props: IProps) => {
    const [contours, setContours] = useState<ContourMultiPolygon[]>([]);
    const [thresholds, setThresholds] = useState<number[]>([]);
    const [renderKey, setRenderKey] = useState<string>(uuid.v4());

    useEffect(() => {
        generateContours(props.data);
    }, [props.data]);

    useEffect(() => {
        setRenderKey(uuid.v4());
    }, [contours, thresholds]);

    const generateContours = (data: number | Array2D<number>) => {
        if (!Array.isArray(data)) {
            return;
        }
        const data1D = ([] as number[]).concat(...data);
        const unique = _.uniqWith(data1D);

        const resolution = props.resolution || 50;
        const minValue = min(data);
        const maxValue = max(data);
        const step = (maxValue - minValue) / resolution;

        const cThresholds: number[] = props.discrete ? unique : d3.range(
            minValue, maxValue, props.resolution || unique.length > 50 ? step : undefined
        );

        const cContours = d3.contours().size([props.gridSize.nX, props.gridSize.nY]).thresholds(cThresholds)(data1D);

        const xMin = props.boundingBox.xMin;
        const yMax = props.boundingBox.yMax;
        const dX = props.boundingBox.dX / props.gridSize.nX;
        const dY = props.boundingBox.dY / props.gridSize.nY;

        const tContours = cContours.map((mp) => {
            mp.coordinates = mp.coordinates.map((c) => {
                c = c.map((cc) => {
                    cc = cc.map((ccc) => {
                        ccc[0] = xMin + ccc[0] * dX;
                        ccc[1] = yMax - ccc[1] * dY;
                        return ccc;
                    });
                    return cc;
                });
                return c;
            });
            return props.rotation % 360 !== 0 ?
                turf.transformRotate(mp, props.rotation, {pivot: props.geometry.centerOfMass}) : mp;
        });

        setContours(tContours);
        setThresholds(cThresholds);
    };

    const renderPolygon = (mp: ContourMultiPolygon, key: number) => {
        const value = thresholds[key];
        return (
            <LayersControl.Overlay key={key} checked={true} name={`Value: ${value}`} position="topright">
                <GeoJSON
                    data={mp}
                    color={`#${props.rainbow.colorAt(value)}`}
                    fillOpacity={0.8}
                />
            </LayersControl.Overlay>
        );
    };

    return (
        <LayersControl key={renderKey} position="topright">
            {contours.map((mp, key) => renderPolygon(mp, key))}
        </LayersControl>
    );
};

export default contourLayer;
