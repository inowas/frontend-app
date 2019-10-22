import React from 'react';
import PropTypes from 'prop-types';
import {Polyline, FeatureGroup} from 'react-leaflet';
import {pure} from 'recompose';
import {Cells, BoundingBox, GridSize} from '../../core/model/geometry';

const renderGridCell = (key, xMin, xMax, yMin, yMax, styles) => {
    return (<Polyline key={key} positions={[
        {lng: xMin, lat: yMin},
        {lng: xMin, lat: yMax},
        {lng: xMax, lat: yMax},
        {lng: xMax, lat: yMin},
        {lng: xMin, lat: yMin}
    ]} {...styles.line}/>);
};

const calculateGridCells = (boundingBox, gridSize, cells) => {

    const dX = boundingBox.dX / gridSize.nX;
    const dY = boundingBox.dY / gridSize.nY;
    const gridCells = [];

    cells.cells.forEach(a => {
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

const ActiveCellsLayer = ({boundingBox, gridSize, cells, styles}) => {
    if (!(cells instanceof Cells)){
        return null;
    }

    const gridCells = calculateGridCells(boundingBox, gridSize, cells);

    return (
        <FeatureGroup>
            {gridCells.map((c, k) => renderGridCell(k, c[0], c[1], c[2], c[3], styles))};
        </FeatureGroup>
    );
};

ActiveCellsLayer.propTypes = {
    boundingBox: PropTypes.instanceOf(BoundingBox),
    gridSize: PropTypes.instanceOf(GridSize),
    cells: PropTypes.instanceOf(Cells),
    styles: PropTypes.object
};

export default pure(ActiveCellsLayer);
