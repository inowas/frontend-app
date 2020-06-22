import * as turf from '@turf/turf';
import * as d3 from 'd3';
import {ContourMultiPolygon} from 'd3';
import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import {FeatureGroup, GeoJSON} from 'react-leaflet';
import uuid from 'uuid';
import {Array2D} from '../../../core/model/geometry/Array2D.type';
import {BoundingBox, Geometry, GridSize} from '../../../core/model/modflow';
import Rainbow from '../../../services/rainbowvis/Rainbowvis';
import {max, min} from './helpers';

interface IProps {
    boundingBox: BoundingBox;
    data: number | Array2D<number>;
    geometry: Geometry;
    gridSize: GridSize;
    rainbow: Rainbow;
    rotation: number;
    steps?: number;
}

const contourLayer = (props: IProps) => {
    const [contours, setContours] = useState<ContourMultiPolygon[]>([]);
    const [renderKey, setRenderKey] = useState<string>(uuid.v4());
    const [thresholds, setThresholds] = useState<number[]>([]);

    useEffect(() => {
        generateContours();
    }, [props.data]);

    useEffect(() => {
        setRenderKey(uuid.v4());
    }, [contours, thresholds]);

    const generateContours = () => {
        const cData: Array2D<number> = !Array.isArray(props.data) ?
            Array(props.gridSize.nY).fill(0).map(() => Array(props.gridSize.nX).fill(props.data)) as Array2D<number> :
            props.data;

        const fData = ([] as number[]).concat(...cData);
        const cThresholds = props.steps === 0 ?
            _.uniq(fData).sort((a, b) => a - b) : d3.range(min(cData), max(cData), props.steps || undefined);
        const cContours = d3.contours().size([props.gridSize.nX, props.gridSize.nY])
            .thresholds(cThresholds)(fData);

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

            if (props.rotation % 360 !== 0) {
                return turf.transformRotate(mp, props.rotation, {pivot: props.geometry.centerOfMass});
            }

            return mp;
        });

        setContours(tContours);
        setThresholds(cThresholds);
    };

    return (
        <FeatureGroup key={renderKey}>
            {contours.map((mp, key) => (
                <GeoJSON
                    key={key}
                    data={mp}
                    color={`#${props.rainbow.colorAt(thresholds[key])}`}
                    fillOpacity={0.8}
                />
            ))}
        </FeatureGroup>
    );
};

export default contourLayer;
