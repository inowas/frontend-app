import { IVector2D } from '../../../core/marPro/Geometry.type';
import { Vector2d } from 'konva/lib/types';

export const getSnappingPoint = (grid: IVector2D[], x: number, y: number, offset: Vector2d) => {
  let shortestDistance: number | null = null;
  let shortestKey = -1;
  grid.forEach((c, key) => {
    const d = Math.floor(Math.pow(c.x - offset.x - x, 2) + Math.pow(c.y - offset.y - y, 2));
    if (shortestDistance === null || d < shortestDistance) {
      shortestDistance = d;
      shortestKey = key;
    }
  });
  return grid[shortestKey];
};
