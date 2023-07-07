import * as turf from '@turf/turf';
import { BoundingBox, GridSize } from '../../core/model/modflow';
import { Feature, Point } from '@turf/helpers';
import { getActiveCellFromCoordinate } from './index';

export const rotateCoordinateAroundPoint = (
  point1: { lng: number, lat: number },
  point2: Feature<Point | null>,
  rotation: number
): { lat: number, lng: number } => {
  const point = turf.point([point1.lng, point1.lat]);
  const result = turf.transformRotate(point, -1 * rotation, { pivot: point2 });
  return result.geometry ? {
    lat: result.geometry.coordinates[1],
    lng: result.geometry.coordinates[0]
  } : { lat: NaN, lng: NaN };
};

export const getCellFromClick = (
  boundingBox: BoundingBox,
  gridSize: GridSize,
  latLon: { lng: number, lat: number },
  rotation?: number,
  center?: Feature<Point | null>
): [number, number] => {
  const rot = rotation && center && rotation % 360 !== 0 ?
    rotateCoordinateAroundPoint(latLon, center, rotation) : latLon;
  console.log(rot);
  const x = rot.lng;
  const y = rot.lat;

  return getActiveCellFromCoordinate([x, y], boundingBox, gridSize) as [number, number];
};
