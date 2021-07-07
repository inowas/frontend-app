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

  //distX => Array of relative startPoints of cells from 0 (xMin)
  public get distX(): Array<number> {
    if (!this._props.distX) {
      this._props.distX = new Array(this.nX).fill(1 / this.nX)
        .reduce((a, x, i) => [...a, a.length > 0 ? x + a[i - 1] : x], [])
        .map((value: number) => parseFloat(value.toPrecision(5))) as Array<number>;
      this._props.distX.pop();
      this._props.distX = [0, ...this._props.distX];
    }

    return this._props.distX;
  }

  public set distX(value) {
    if (value[0] !== 0) {
      value.unshift(0);
    }
    if (value[value.length - 1] === 1) {
      value.pop();
    }

    this.nX = value.length;
    this._props.distX = value;
  }

  public getDistXStart(): Array<number> {
    return this.distX;
  }

  public getDistXEnd(): Array<number> {
    const distXEnd = [...this.distX, 1];
    distXEnd.shift();
    return distXEnd;
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

  //distY => Array of relative startPoints of cells from 0 (yMin)
  public get distY(): Array<number> {
    if (!this._props.distY) {
      this._props.distY = new Array(this.nY).fill(1 / this.nY)
        .reduce((a, x, i) => [...a, a.length > 0 ? x + a[i - 1] : x], [])
        .map((value: number) => parseFloat(value.toPrecision(5))) as Array<number>;
      this._props.distY.pop();
      this._props.distY = [0, ...this._props.distY];
    }

    return this._props.distY;
  }

  public set distY(value) {
    if (value[0] !== 0) {
      value.unshift(0);
    }
    if (value[value.length - 1] === 1) {
      value.pop();
    }
    this.nY = value.length;
    this._props.distY = value;
  }

  public getDistYStart(): Array<number> {
    return this.distY;
  }

  public getDistYEnd(): Array<number> {
    const distYEnd = [...this.distY, 1];
    distYEnd.shift();
    return distYEnd;
  }

  public getCentersX(): Array<number> {
    return this.getDistXEnd().map((end: number, idx) => (end + this.getDistXStart()[idx]) / 2);
  }

  public getCentersY(): Array<number> {
    return this.getDistYEnd().map((end: number, idx) => (end + this.getDistYStart()[idx]) / 2);
  }

  public get delc() {
    const distY = [...this.distY, 1];
    return distY.slice(1).map((n, i) => n - distY[i])
      .map((value: number) => parseFloat(value.toPrecision(5)));
  }

  public get delr() {
    const distX = [...this.distX, 1];
    return distX.slice(1).map((n, i) => n - distX[i])
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

  public getCellFromDistX = (dist: number) => {
    let cellX = 0;

    this.distX.forEach((distX: number, idx) => {
      if (dist > distX) {
        cellX = idx;
      }
    });

    return cellX;
  };

  public getCellFromDistY = (distY: number) => {
    let cellY = 0;
    this.distY.forEach((value: number, idx) => {
      if (value < distY) {
        cellY = idx;
      }
    });

    return this.nY - cellY - 1;
  };
}

export default GridSize;
