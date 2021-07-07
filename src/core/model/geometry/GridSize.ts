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
    if (value > 0) {
      this._props.n_x = value;
      this._props.distX = undefined;
    }
  }

  public get distX(): Array<number> {
    if (!this._props.distX) {
      this._props.distX = new Array(this.nX).fill(1 / this.nX)
        .reduce((a, x, i) => [...a, a.length > 0 ? x + a[i - 1] : x], [])
        .map((value: number) => parseFloat(value.toPrecision(5))) as Array<number>;
      this._props.distX = [0, ...this._props.distX];
    }

    return this._props.distX;
  }

  public set distX(value) {
    if (value[0] !== 0) {
      value.unshift(0);
    }
    this.nX = value.length - 1;
    this._props.distX = value;
  }

  public get nY() {
    return this._props.n_y;
  }

  public set nY(value) {
    if (value > 0) {
      this._props.n_y = value;
      this._props.distY = undefined;
    }
  }

  public get distY(): Array<number> {
    if (!this._props.distY) {
      this._props.distY = new Array(this.nY).fill(1 / this.nY)
        .reduce((a, x, i) => [...a, a.length > 0 ? x + a[i - 1] : x], [])
        .map((value: number) => parseFloat(value.toPrecision(5))) as Array<number>;
      this._props.distY = [0, ...this._props.distY];
    }

    return this._props.distY;
  }

  public set distY(value) {
    if (value[0] !== 0) {
      value.unshift(0);
    }
    this.nY = value.length - 1;
    this._props.distY = value;
  }

  public get delc() {
    return this.distY.slice(1).map((n, i) => n - this.distY[i])
      .map((value: number) => parseFloat(value.toPrecision(5)));
  }

  public get delr() {
    return this.distX.slice(1).map((n, i) => n - this.distX[i])
      .map((value: number) => parseFloat(value.toPrecision(5)));

  }

  public static fromNxNy(nX: number, nY: number) {
    return new GridSize({ n_x: nX, n_y: nY });
  }

  public static fromArray([nX, nY]: IGridSizeArray) {
    return new GridSize({ n_x: nX, n_y: nY });
  }

  public static fromObject({ n_x, n_y, distX, distY }: IGridSize) {
    return new GridSize({ n_x, n_y, distX, distY });
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
