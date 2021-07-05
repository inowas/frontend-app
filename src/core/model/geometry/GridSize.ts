import { Array2D } from './Array2D.type';
import { GenericObject } from '../genericObject/GenericObject';
import { IGridSize } from './GridSize.type';
import { isEqual } from 'lodash';

type IGridSizeArray = [number, number];

class GridSize extends GenericObject<IGridSize> {

  public get nX() {
    return this._props.n_x;
  }

  public set nX(value) {
    if (this.delr?.length !== value) {
      this.delr = undefined;
    }
    this._props.n_x = value;
  }

  public get nY() {
    return this._props.n_y;
  }

  public set nY(value) {
    if (this.delc?.length !== value) {
      this.delc = undefined;
    }

    this._props.n_y = value;
  }

  public get delc() {
    return this._props.delc;
  }

  public set delc(value) {
    if (Array.isArray(value)) {
      this.nY = value.length;
    }
    this._props.delc = value;
  }

  public get delr() {
    return this._props.delr;
  }

  public set delr(value) {
    if (Array.isArray(value)) {
      this.nX = value.length;
    }
    this._props.delr = value;
  }

  public static fromNxNy(nX: number, nY: number) {
    return new GridSize({ n_x: nX, n_y: nY });
  }

  public static fromArray([nX, nY]: IGridSizeArray) {
    return new GridSize({ n_x: nX, n_y: nY });
  }

  public static fromObject({ n_x, n_y }: IGridSize) {
    return new GridSize({ n_x, n_y });
  }

  public static fromData(data: Array2D<number>) {
    if (data.length === 0) {
      throw new Error('Data expected to have at least one row and one column.');
    }

    return new GridSize({ n_x: data[0].length, n_y: data.length });
  }

  public sameAs = (obj: GridSize) => {
    return isEqual(obj.toObject(), this.toObject());
  };

  public isWithIn = (x: number, y: number) => {
    return (x >= 0 && x <= (this.nX - 1) && y >= 0 && y <= (this.nY - 1));
  };
}

export default GridSize;
