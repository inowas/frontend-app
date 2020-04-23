import React from 'react';
import {FeatureGroup, Polyline} from 'react-leaflet';
import {BoundingBox, Cells, GridSize} from '../../core/model/geometry';

const renderGridCell = (key: number, xMin: number, xMax: number, yMin: number, yMax: number, styles: any) => (
    <Polyline
        key={key}
        positions={[
            {lng: xMin, lat: yMin},
            {lng: xMin, lat: yMax},
            {lng: xMax, lat: yMax},
            {lng: xMax, lat: yMin},
            {lng: xMin, lat: yMin}
        ]}
        {...styles.line}
    />
);

const calculateGridCells = (boundingBox: BoundingBox, gridSize: GridSize, cells: Cells) => {

    const dX = boundingBox.dX / gridSize.nX;
    const dY = boundingBox.dY / gridSize.nY;
    const gridCells: Array<[number, number, number, number]> = [];

    cells.cells.forEach((a) => {
        const x = a[0];
        const y = a[1];

        const cXmin = boundingBox.xMin + x * dX;
        const cXmax = boundingBox.xMin + (x + 1) * dX;
        const cYmin = boundingBox.yMax - y * dY;
        const cYmax = boundingBox.yMax - (y + 1) * dY;

        gridCells.push([cXmin, cXmax, cYmin, cYmax]);
    });

    return gridCells;
};

interface IProps {
    boundingBox: BoundingBox;
    gridSize: GridSize;
    cells: Cells;
    styles: any;
}

const activeCellsLayer = (props: IProps) => {

    const gridCells = calculateGridCells(props.boundingBox, props.gridSize, props.cells);
    return (
        <FeatureGroup>
            {gridCells.map((c, k) => renderGridCell(k, c[0], c[1], c[2], c[3], props.styles))}
        </FeatureGroup>
    );
};

export default activeCellsLayer;
