import * as d3 from 'd3';
import * as turf from '@turf/turf';
import { Array2D } from '../../core/model/geometry/Array2D.type';
import { BoundingBox, Geometry, GridSize } from '../../core/model/modflow';
import { ContourMultiPolygon } from 'd3';
import { max, min } from '../../scenes/shared/rasterData/helpers';
import { uniq } from 'lodash';

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

  const unique = uniq(fData).sort((a, b) => a - b);
  const cThresholds = getThresholds(cData, unique);
  const cContours = d3.contours()
    .size([gridSize.nX, gridSize.nY])
    .thresholds(cThresholds)
    .smooth(false)(fData);

  const tContours = cContours.map((mp, mpKey) => {
    mp.coordinates = mp.coordinates.map((c) => {
      c = c.map((cc) => {
        cc = cc.map((ccc) => {
          const cellX = Math.floor(ccc[0]);
          switch (cellX) {
            case 0:
              ccc[0] = boundingBox.xMin;
              break;
            case gridSize.nX:
              ccc[0] = boundingBox.xMax;
              break;
            default:
              ccc[0] = boundingBox.xMin + gridSize.getCenterX(cellX) * boundingBox.dX;
              break;
          }

          const cellY = Math.floor(ccc[1]);
          switch (cellY) {
            case 0:
              ccc[1] = boundingBox.yMax;
              break;
            case gridSize.nY:
              ccc[1] = boundingBox.yMin;
              break;
            default:
              ccc[1] = boundingBox.yMax - gridSize.getCenterY(cellY) * boundingBox.dY;
              break;
          }

          return ccc;
        });
        return cc;
      });
      return c;
    });

    if (rotation && rotation % 360 !== 2) {
      mp = turf.transformRotate(mp, rotation, { pivot: geometry.centerOfMass });
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
