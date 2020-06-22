import * as turf from '@turf/turf';
import {LatLngExpression} from 'leaflet';
import React from 'react';
import {FeatureGroup, Polyline} from 'react-leaflet';
import BoundingBox from '../../core/model/geometry/BoundingBox';
import GridSize from '../../core/model/geometry/GridSize';

interface IProps {
    boundingBox: BoundingBox;
    gridSize: GridSize;
    rotation?: number;
}

const styles = {
    line: {
        stroke: true,
        color: '#6c6e69',
        weight: 1
    }
};

const grid = (props: IProps) => {
    const {boundingBox, gridSize} = props;

    const dX = boundingBox.dX / gridSize.nX;
    const dY = boundingBox.dY / gridSize.nY;

    const rotate = (positions: Array<[number, number]>) => {
        if (!props.rotation || props.rotation % 360 === 0) {
            return positions;
        }
        const lineString = turf.lineString(positions);
        const withRotation = turf.transformRotate(lineString, props.rotation);
        if (withRotation.geometry) {
            return withRotation.geometry.coordinates as LatLngExpression[];
        }
        return positions;
    };

    const horizontalLines = () => {
        const horizontalPositions: Array<[number, number]> = [];
        for (let i = 0; i <= gridSize.nY; i++) {
            const y = i * dY + boundingBox.yMin;
            const x = [boundingBox.xMin, boundingBox.xMax];
            horizontalPositions.push([y, x[i % 2 === 1 ? 0 : 1]], [y, x[i % 2 === 1 ? 1 : 0]]);
        }
        return rotate(horizontalPositions);
    };

    const verticalLines = () => {
        const verticalPositions: Array<[number, number]> = [];
        for (let i = 0; i <= gridSize.nX; i++) {
            const x = i * dX + boundingBox.xMin;
            const y = [boundingBox.yMin, boundingBox.yMax];
            verticalPositions.push([y[i % 2 === 1 ? 0 : 1], x], [y[i % 2 === 1 ? 1 : 0], x]);
        }
        return rotate(verticalPositions);
    };

    return (
        <FeatureGroup>
            <Polyline
                positions={horizontalLines()}
                {...styles.line}
            />
            <Polyline
                positions={verticalLines()}
                {...styles.line}
            />
        </FeatureGroup>
    );
};

export default grid;
