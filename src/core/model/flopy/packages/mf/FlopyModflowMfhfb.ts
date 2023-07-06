import { IPropertyValueObject } from '../../../types';
import BoundaryCollection from '../../../modflow/boundaries/BoundaryCollection';
import FlopyModflowBoundary from './FlopyModflowBoundary';
import FlopyModflowPackage from './FlopyModflowPackage';
import Stressperiods from '../../../modflow/Stressperiods';

/*
https://modflowpy.github.io/flopydoc/mfhfb.html

hfb_data = [
            [lay, row1, col1, row2, col2, hydchr],
            [lay, row1, col1, row2, col2, hydchr],
            [lay, row1, col1, row2, col2, hydchr],
           ]
*/

export interface IFlopyModflowMfhfb {
  nphfb: number;
  mxfb: number;
  nhfbnp: number;
  hfb_data: Array<[number, number, number, number, number, number]> | null;
  nacthfb: number;
  no_print: boolean;
  options: string[] | null;
  extension: string;
  unitnumber: number | null;
  filenames: null | string | string[];
}

export const defaults: IFlopyModflowMfhfb = {
  nphfb: 0,
  mxfb: 0,
  nhfbnp: 0,
  hfb_data: null,
  nacthfb: 0,
  no_print: false,
  options: null,
  extension: 'hfb',
  unitnumber: null,
  filenames: null,
};

export default class FlopyModflowMfhfb extends FlopyModflowBoundary<IFlopyModflowMfhfb> {

  public static create(boundaries: BoundaryCollection, stressperiods: Stressperiods) {
    return this.fromDefault().update(boundaries, stressperiods.count);
  }

  public static fromDefault() {
    return this.fromObject({});
  }

  public static fromObject(obj: IPropertyValueObject): FlopyModflowMfhfb {
    const d: any = FlopyModflowPackage.cloneDeep(defaults);
    for (const key in d) {
      if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
        d[key] = obj[key];
      }
    }

    return new this(d);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update = (boundaries: BoundaryCollection, nper: number) => {
    const bd = boundaries.all.filter((b) => b.type === 'hfb');
    if (bd.length === 0) {
      return null;
    }

    return this;
  };

  get nphfb() {
    return this._props.nphfb;
  }

  set nphfb(value) {
    this._props.nphfb = value;
  }

  get mxfb() {
    return this._props.mxfb;
  }

  set mxfb(value) {
    this._props.mxfb = value;
  }

  get nhfbnp() {
    return this._props.nhfbnp;
  }

  set nhfbnp(value) {
    this._props.nhfbnp = value;
  }

  get hfb_data() {
    return this._props.hfb_data;
  }

  set hfb_data(value) {
    this._props.hfb_data = value;
  }

  get nacthfb() {
    return this._props.nacthfb;
  }

  set nacthfb(value) {
    this._props.nacthfb = value;
  }

  get no_print() {
    return this._props.no_print;
  }

  set no_print(value) {
    this._props.no_print = value;
  }

  get options() {
    return this._props.options;
  }

  set options(value) {
    this._props.options = value;
  }

  get extension() {
    return this._props.extension;
  }

  set extension(value) {
    this._props.extension = value;
  }

  get unitnumber() {
    return this._props.unitnumber;
  }

  set unitnumber(value) {
    this._props.unitnumber = value;
  }

  get filenames() {
    return this._props.filenames;
  }

  set filenames(value) {
    this._props.filenames = value;
  }
}
