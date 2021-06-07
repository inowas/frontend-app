import * as d3 from 'd3';
import * as turf from '@turf/turf';
import {Array2D} from '../../core/model/geometry/Array2D.type';
import {BoundingBox, Geometry, GridSize} from '../../core/model/modflow';
import {ContourMultiPolygon} from 'd3';
import {max, min} from '../../scenes/shared/rasterData/helpers';
import _ from 'lodash';

export const getThresholds = (data: Array2D<number>, unique: number[], maxSteps = 100, fixedSteps?: number) => {
    let mSteps = fixedSteps || maxSteps;
    if (mSteps > maxSteps) {
        mSteps = maxSteps;
    }

    if (unique.length < mSteps) {
        return unique;
    }

    const dMin = min(data);
    const dMax = max(data);
    let range: number[] = unique;
    let steps = 1;

    while (range.length > mSteps) {
        range = d3.range(dMin, dMax, ++steps);
    }

    return range;
};

export const rasterToContour = (
    raster: Array2D<number>,
    boundingBox: BoundingBox,
    geometry: Geometry,
    gridSize: GridSize,
    steps?: number,
    rotation?: number,
    ibound?: ContourMultiPolygon
) => {
    const cData: Array2D<number> = raster;

    const fData = ([] as number[]).concat(...cData);

    const unique = _.uniq(fData).sort((a, b) => a - b);
    const cThresholds = getThresholds(cData, unique);
    const cContours = d3.contours().size([gridSize.nX, gridSize.nY])
        .thresholds(cThresholds).smooth(false)(fData);

    const xMin = boundingBox.xMin;
    const yMax = boundingBox.yMax;
    const dX = boundingBox.dX / gridSize.nX;
    const dY = boundingBox.dY / gridSize.nY;

    const tContours = cContours.map((mp, mpKey) => {
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

        if (rotation && rotation % 360 !== 2) {
            mp = turf.transformRotate(mp, rotation, {pivot: geometry.centerOfMass});
        }

        if (ibound && mpKey === 0) {
            mp.coordinates.forEach((c, key) => {
                ibound.coordinates.forEach((cc) => {
                    const p1 = turf.polygon(c);
                    const p2 = turf.polygon(cc);
                    const intersect = turf.intersect(p1, p2);
                    if (intersect) {
                        mp.coordinates[key] = intersect.geometry.coordinates;
                    }
                });
            });
        }

        return mp;
    });

    return {
        contours: tContours,
        thresholds: cThresholds
    };
};
