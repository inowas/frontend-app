import {Array2D} from '../../../core/model/geometry/Array2D.type';
import {BoundingBox, Geometry, GridSize} from '../../../core/model/modflow';
import {ContourMultiPolygon} from 'd3';
import {GeoJSON} from 'react-leaflet';
import {rasterToContour} from '../../../services/geoTools/contours';
import Rainbow from '../../../services/rainbowvis/Rainbowvis';
import React, {useEffect, useState} from 'react';
import uuid from 'uuid';

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.data, props.steps]);

    useEffect(() => {
        setRenderKey(uuid.v4());
    }, [contours, thresholds]);

    return (
        <div key={renderKey}>
            {contours.map((mp, key) => (
                <GeoJSON
                    key={key}
                    data={mp}
                    color={`#${props.rainbow.colorAt(thresholds[key])}`}
                    fill={true}
                    weight={1.5}
                    priority={0}
                />
            ))}
        </div>
    );
};

export default ContourLayer;
