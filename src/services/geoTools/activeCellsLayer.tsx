import {union} from '@turf/turf';
import * as turf from '@turf/turf';
import {LatLngExpression} from 'leaflet';
import React from 'react';
import {FeatureGroup, Polygon, Polyline} from 'react-leaflet';
import {BoundingBox, Cells, Geometry, GridSize} from '../../core/model/geometry';

const createCellPolygons = (boundingBox: BoundingBox, gridSize: GridSize, cells: Cells, style: object = {}) => {

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

    return gridCells.map((c, idx) => {
        const [xMin, xMax, yMin, yMax] = c;
        return (
            <Polyline
                key={idx}
                positions={[
                    {lng: xMin, lat: yMin},
                    {lng: xMin, lat: yMax},
                    {lng: xMax, lat: yMax},
                    {lng: xMax, lat: yMin},
                    {lng: xMin, lat: yMin}
                ]}
                {...style}
            />
        );
    });
};

const createPolygon = (boundingBox: BoundingBox, gridSize: GridSize, cells: Cells, style: object = {}) => {

    const dX = boundingBox.dX / gridSize.nX;
    const dY = boundingBox.dY / gridSize.nY;
    const mergedCells: Array<[number, number, number, number]> = [];

    const grid = cells.calculateIBound(gridSize.nY, gridSize.nX);

    grid.forEach((row, rIdx) => {
        const startIdx: number[] = [];
        const endIdx: number[] = [];

        row.forEach((v, cIdx) => {

                if (v === 1) {
                    if (cIdx === 0) {
                        startIdx.push(cIdx);
                    }

                    if (cIdx > 0 && grid[rIdx][cIdx - 1] === 0) {
                        startIdx.push(cIdx);
                    }

                    if (cIdx === row.length - 1) {
                        endIdx.push(cIdx);
                    }

                    if (cIdx < row.length - 1 && grid[rIdx][cIdx + 1] === 0) {
                        endIdx.push(cIdx);
                    }
                }
            }
        );

        if (startIdx.length !== endIdx.length) {
            throw new Error('startIdx.length !== endIdx.length');
        }

        const startEndIdxArr = startIdx.map((e, idx) => [startIdx[idx], endIdx[idx]]);
        startEndIdxArr.forEach((e) => {
            const x0 = e[0];
            const x1 = e[1];
            const y = rIdx;

            const cXmin = boundingBox.xMin + x0 * dX;
            const cXmax = boundingBox.xMin + (x1 + 1) * dX;
            const cYmin = boundingBox.yMax - y * dY;
            const cYmax = boundingBox.yMax - (y + 1) * dY;

            mergedCells.push([cXmin, cXmax, cYmin, cYmax]);
        });
    });

    const turfPolygons = mergedCells.map((c) => {
        const [xMin, xMax, yMin, yMax] = c;
        return (
            turf.polygon([[
                [xMin, yMin],
                [xMin, yMax],
                [xMax, yMax],
                [xMax, yMin],
                [xMin, yMin]
            ]])
        );
    });

    let turfPolygon: turf.helpers.Feature<turf.helpers.Polygon> | null = null;

    if (turfPolygons.length > 0) {
        turfPolygon = turfPolygons[0];
        turfPolygons.forEach((p) => {
            if (turfPolygon !== null) {
                turfPolygon = union(turfPolygon, p) as turf.helpers.Feature<turf.helpers.Polygon>;
            }
        });
    }

    if (turfPolygon === null) {
        return [];
    }

    const geometry = Geometry.fromGeoJson(turfPolygon.geometry);
    return (
        <Polygon
            positions={geometry.coordinatesLatLng as LatLngExpression[]}
            {...style}
        />
    );
};

interface IProps {
    boundingBox: BoundingBox;
    gridSize: GridSize;
    cells: Cells;
    styles: any;
    asPolygon?: boolean;
}

const cellsLayer = (props: IProps) => {

    if (props.asPolygon) {
        return (
            <FeatureGroup>
                {createPolygon(props.boundingBox, props.gridSize, props.cells, props.styles.line)};
            </FeatureGroup>
        );
    }

    return (
        <FeatureGroup>
            {createCellPolygons(props.boundingBox, props.gridSize, props.cells, props.styles.line)};
        </FeatureGroup>
    );
};

export default cellsLayer;
