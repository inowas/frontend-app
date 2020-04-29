import React from 'react';
import {FeatureGroup, Polyline} from 'react-leaflet';
import {BoundingBox} from '../../core/model/geometry';
import GridSize from '../../core/model/geometry/GridSize';

interface IProps {
    boundingBox: BoundingBox;
    gridSize: GridSize;
}

const styles = {
    line: {
        stroke: true,
        color: '#6c6e69',
        weight: 1
    }
};

const grid = (props: IProps) => {
    const dX = props.boundingBox.dX / props.gridSize.nX;
    const dY = props.boundingBox.dY / props.gridSize.nY;

    const horizontalLines = () => {
        const horizontalPositions: Array<[number, number]> = [];
        for (let i = 0; i <= props.gridSize.nY; i++) {
            const y = i * dY + props.boundingBox.yMin;
            const x = [props.boundingBox.xMin, props.boundingBox.xMax];
            horizontalPositions.push([y, x[i % 2 === 1 ? 0 : 1]], [y, x[i % 2 === 1 ? 1 : 0]]);
        }
        return horizontalPositions;
    };

    const verticalLines = () => {
        const verticalPositions: Array<[number, number]> = [];
        for (let i = 0; i <= props.gridSize.nX; i++) {
            const x = i * dX + props.boundingBox.xMin;
            const y = [props.boundingBox.yMin, props.boundingBox.yMax];
            verticalPositions.push([y[i % 2 === 1 ? 0 : 1], x], [y[i % 2 === 1 ? 1 : 0], x]);
        }
        return verticalPositions;
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
