//distX => Array of relative startPoints of cells from 0 (xMin)
//distY => Array of relative startPoints of cells from 0 (yMin)

export interface IGridSize {
  n_x: number;
  n_y: number;
  distX?: Array<number>;
  distY?: Array<number>;
}
