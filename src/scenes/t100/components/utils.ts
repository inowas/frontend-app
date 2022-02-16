import { IVector2D } from '../../../core/marPro/Geometry.type';

export const getSnappingPoint = (grid: IVector2D[], x: number, y: number) => {
  let shortestDistance: number | null = null;
  let shortestKey = -1;
  grid.forEach((c, key) => {
    const d = Math.floor(Math.pow(c.x - x, 2) + Math.pow(c.y - y, 2));
    if (shortestDistance === null || d < shortestDistance) {
      shortestDistance = d;
      shortestKey = key;
    }
  });
  return grid[shortestKey];
};
