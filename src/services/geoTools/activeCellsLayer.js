import {Polyline, FeatureGroup} from 'react-leaflet';
import React from 'react';
import {pure} from 'recompose';
import {getMinMaxFromBoundingBox} from "./index";

const styles = {
    line: {
        color: 'grey',
        weight: 0.3
    }
};

const renderGridCell = (key, xMin, xMax, yMin, yMax) => {
    return (<Polyline key={key} positions={[
        {lng: xMin, lat: yMin},
        {lng: xMin, lat: yMax},
        {lng: xMax, lat: yMax},
        {lng: xMax, lat: yMin},
        {lng: xMin, lat: yMin}
    ]} {...styles.line}/>);
};

const calculateActiveCells = (boundingBox, gridSize, activeCells) => {
    const {xMin, xMax, yMin, yMax} = getMinMaxFromBoundingBox(boundingBox);

    const dX = (xMax - xMin) / gridSize.n_x;
    const dY = (yMax - yMin) / gridSize.n_y;

    const gridCells = [];

    activeCells.forEach(a => {
        const x = a[0];
        const y = a[1];

        const cXmin = xMin + x * dX;
        const cXmax = xMin + (x + 1) * dX;
        const cYmin = yMax - y * dY;
        const cYmax = yMax - (y + 1) * dY;

        gridCells.push([cXmin, cXmax, cYmin, cYmax]);
    });

    return gridCells;
};

const ActiveCellsLayer = ({boundingBox, gridSize, activeCells}) => {
    if (!activeCells) {
        return null;
    }

    const gridCells = calculateActiveCells(boundingBox, gridSize, activeCells);

    return (
        <FeatureGroup>
            {gridCells.map((c, k) => renderGridCell(k, c[0], c[1], c[2], c[3]))};
        </FeatureGroup>
    );
};

export default pure(ActiveCellsLayer);
