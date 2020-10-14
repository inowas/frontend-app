import {ContourMultiPolygon} from 'd3';
import React, {useEffect, useState} from 'react';
import {FeatureGroup, GeoJSON} from 'react-leaflet';
import uuid from 'uuid';
import {Array2D} from '../../../core/model/geometry/Array2D.type';
import {BoundingBox, Geometry, GridSize} from '../../../core/model/modflow';
import {rasterToContour} from '../../../services/geoTools/contours';
import Rainbow from '../../../services/rainbowvis/Rainbowvis';

interface IProps {
    boundingBox: BoundingBox;
    data: number | Array2D<number>;
    geometry: Geometry;
    gridSize: GridSize;
    ibound?: Array2D<number>;
    rainbow: Rainbow;
    rotation: number;
    steps?: number;
}

const ContourLayer = (props: IProps) => {
    const [contours, setContours] = useState<ContourMultiPolygon[]>([]);
    const [renderKey, setRenderKey] = useState<string>(uuid.v4());
    const [thresholds, setThresholds] = useState<number[]>([]);

    useEffect(() => {
        const data: Array2D<number> = !Array.isArray(props.data) ?
            Array(props.gridSize.nY).fill(0).map(() => Array(props.gridSize.nX).fill(props.data)) as
                Array2D<number> : props.data;
        let ibound;
        if (props.ibound) {
            const iboundContour = rasterToContour(props.ibound, props.boundingBox, props.geometry, props.gridSize,
                undefined, props.rotation);
            if (iboundContour.contours.length > 0) {
                ibound = iboundContour.contours[1];
            }
        }
        const cResult = rasterToContour(data, props.boundingBox, props.geometry, props.gridSize, props.steps,
            props.rotation, ibound);
        setContours(cResult.contours);
        setThresholds(cResult.thresholds);
    }, [props.data, props.steps]);

    useEffect(() => {
        setRenderKey(uuid.v4());
    }, [contours, thresholds]);

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

export default ContourLayer;
