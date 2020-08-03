import * as turf from '@turf/turf';
import _ from 'lodash';
import {Array2D} from '../../core/model/geometry/Array2D.type';
import {BoundingBox, Geometry, GridSize} from '../../core/model/modflow';

interface IPoint3D {
    x: number;
    y: number;
    z: number;
}

export const distanceWeighting = (
    area: Geometry,
    boundingBox: BoundingBox,
    gridSize: GridSize,
    points: IPoint3D[],
    rotation?: number,
    range: number = 5
): Array2D<number> => {
    const raster = new Array(gridSize.nY).fill(0).map(() => new Array(gridSize.nX).fill(0)) as Array2D<number>;

    const dX = boundingBox.dX / gridSize.nX;
    const dY = boundingBox.dY / gridSize.nY;

    for (let y = 0; y < gridSize.nY; y++) {
        for (let x = 0; x < gridSize.nX; x++) {
            const cX = boundingBox.xMin + x * dX + dX / 2;
            const cY = boundingBox.yMax - y * dY - dY / 2;

            const pointsWithDistance = points.map((p) => {
                return {
                    ...p,
                    d: turf.distance([cX, cY], [p.x, p.y])
                };
            });

            let pointsInRange = [];

            if (pointsWithDistance.filter((p) => p.d <= range).length < 3) {
                pointsInRange = _.orderBy(pointsWithDistance, ['d'], ['asc']).slice(0, 3);
            } else {
                pointsInRange = pointsWithDistance.filter((p) => p.d <= range);
            }

            let sum1 = 0;
            let sum2 = 0;

            pointsInRange.forEach((p) => {
                sum1 += p.z / p.d;
                sum2 += 1 / p.d;
            });

            raster[y][x] = sum1 / sum2;
        }
    }

    return raster;
};
