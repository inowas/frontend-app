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
    if (value.length === 0 || value[0] !== 0) {
      value.unshift(0);
    }
    if (value[value.length - 1] === 1) {
      value.pop();
    }

    this.nX = value.length;
    this._props.distX = value;
  }

  public getDistancesXStart(): Array<number> {
    return this.distX;
  }

  public getDistanceXStart(x: number): number {
    return this.getDistancesXStart()[x];
  }

  public getDistancesXEnd(): Array<number> {
    const distXEnd = [...this.distX, 1];
    distXEnd.shift();
    return distXEnd;
  }

  public getDistanceXEnd(x: number): number {
    if (x > 0 && x < 1) {
      const index = this.distX.indexOf(x);
      if (index) {
        return this.getDistancesXEnd()[index];
      }
      return 1;
    }
    return this.getDistancesXEnd()[x];
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
    if (value.length === 0 || value[0] !== 0) {
      value.unshift(0);
    }
    if (value[value.length - 1] === 1) {
      value.pop();
    }
    this.nY = value.length;
    this._props.distY = value;
  }

  public getDistancesYStart(): Array<number> {
    return this.distY;
  }

  public getDistanceYStart(y: number): number {
    return this.getDistancesYStart()[y];
  }

  public getDistancesYEnd(): Array<number> {
    const distYEnd = [...this.distY, 1];
    distYEnd.shift();
    return distYEnd;
  }

  public getDistanceYEnd(y: number): number {
    if (y > 0 && y < 1) {
      const index = this.distY.indexOf(y);
      if (index) {
        return this.getDistancesYEnd()[index];
      }
      return 1;
    }
    return this.getDistancesYEnd()[y];
  }

  public getCentersX(): Array<number> {
    return this.getDistancesXEnd().map((end: number, idx) => (end + this.getDistancesXStart()[idx]) / 2);
  }

  public getCenterX(x: number): number {
    return this.getCentersX()[x];
  }

  public getCentersY(): Array<number> {
    return this.getDistancesYEnd().map((end: number, idx) => (end + this.getDistancesYStart()[idx]) / 2);
  }

  public getCenterY(y: number): number {
    return this.getCentersY()[y];
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

    this.getDistancesXStart()
      .forEach((distX: number, idx) => {
        if (dist > distX) {
          cellX = idx;
        }
      });

    return cellX;
  };

  public getCellFromDistY = (distY: number) => {
    let cellY = 0;
    this.getDistancesYStart()
      .forEach((value: number, idx) => {
        if (value < distY) {
          cellY = idx;
        }
      });

    return this.nY - cellY - 1;
  };
}

export default GridSize;
