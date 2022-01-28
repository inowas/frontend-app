import { ICell, IGridSize } from './Geometry.type';
import { IParameter } from './Parameter.type';

export interface IGameObject {
  boundaryId?: string;
  id: string;
  type: string;
  location: ICell;
  size: IGridSize;
  parameters: IParameter[];
}
