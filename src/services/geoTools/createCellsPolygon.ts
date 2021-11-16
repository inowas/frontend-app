import * as turf from '@turf/turf';
import { BoundingBox, Cells, Geometry, GridSize } from '../../core/model/geometry';
import { IRotationProperties } from '../../core/model/geometry/Geometry.type';

export const createCellsPolygon = (
  bbox: BoundingBox,
  gridSize: GridSize,
  cells: Cells,
  rotation?: IRotationProperties
) => {
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
    });

    if (startIdx.length !== endIdx.length) {
      throw new Error('startIdx.length !== endIdx.length');
    }

    const startEndIdxArr = startIdx.map((e, idx) => [startIdx[idx], endIdx[idx]]);

    startEndIdxArr.forEach((e) => {
      const x0 = e[0];
      const x1 = e[1];
      const y = rIdx;

      const cXmin = bbox.xMin + gridSize.getDistanceXStart(x0) * bbox.dX;
      const cXmax = bbox.xMin + gridSize.getDistanceXEnd(x1) * bbox.dX;
      const cYmin = bbox.yMax - gridSize.getDistanceYStart(y) * bbox.dY;
      const cYmax = bbox.yMax - gridSize.getDistanceYEnd(y) * bbox.dY;

      mergedCells.push([cXmin, cXmax, cYmin, cYmax]);
    });
  });

  const turfPolygons = mergedCells.map((c) => {
    const [xMin, xMax, yMin, yMax] = c;
    return turf.polygon([
      [
        [xMin, yMin],
        [xMin, yMax],
        [xMax, yMax],
        [xMax, yMin],
        [xMin, yMin],
      ],
    ]);
  });

  let turfPolygon: turf.helpers.Feature<turf.helpers.Polygon> | null = null;

  if (turfPolygons.length > 0) {
    turfPolygon = turfPolygons[0];
    turfPolygons.forEach((p) => {
      if (turfPolygon !== null) {
        turfPolygon = turf.union(turfPolygon, p) as turf.helpers.Feature<turf.helpers.Polygon>;
      }
    });
  }

  if (turfPolygon === null) {
    return null;
  }

  if (rotation && rotation.angle % 360 !== 0) {
    turfPolygon = turf.transformRotate(turfPolygon, rotation.angle, {
      pivot: rotation.geometry.centerOfMass,
    });
  }

  const geometry = Geometry.fromGeoJson(turfPolygon.geometry);
  return geometry;
};
