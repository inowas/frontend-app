import { BoundaryCollection } from '../../../modflow/boundaries';
import { IPropertyValueObject } from '../../../types';
import { IStressPeriodData } from './FlopyModflow.type';
import FlopyModflowLineBoundary from './FlopyModflowLineBoundary';
import FlopyModflowPackage from './FlopyModflowPackage';
import Stressperiods from '../../../modflow/Stressperiods';

export interface IFlopyModflowMfstr {
  mxacts: number;
  nss: number;
  ntrib: number;
  ndiv: number;
  icalc: number;
  const: number;
  ipakcb: number | null;
  istcb2: number | null;
  stress_period_data:
    IStressPeriodData<[[number, number, number, number, number, number, number, number, number, number]]> | null;
  segment_data: IStressPeriodData<number[][]> | null;
  extension: string;
  unitnumber: number | null;
  filenames: null | string | string[];
  options: null;
}

export const defaults: IFlopyModflowMfstr = {
  mxacts: 0,
  nss: 0,
  ntrib: 0,
  ndiv: 0,
  icalc: 0,
  const: 86400.0,
  ipakcb: null,
  istcb2: null,
  stress_period_data: null,
  segment_data: null,
  extension: 'str',
  unitnumber: null,
  filenames: null,
  options: null,
};

export default class FlopyModflowMfstr extends FlopyModflowLineBoundary<IFlopyModflowMfstr> {

  public static create(boundaries: BoundaryCollection, stressperiods: Stressperiods) {
    return this.fromDefault().update(boundaries, stressperiods);
  }

  public static fromDefault() {
    return this.fromObject({});
  }

  public static fromObject(obj: IPropertyValueObject): FlopyModflowMfstr {
    const d: any = FlopyModflowPackage.cloneDeep(defaults);
    for (const key in d) {
      if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
        d[key] = obj[key];
      }
    }

    return new this(d);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update = (boundaries: BoundaryCollection, stressperiods: Stressperiods) => {
    const bd = boundaries.all.filter((b) => b.type === 'str');
    if (bd.length === 0) {
      return null;
    }

    return this;
  };

  get mxacts() {
    return this._props.mxacts;
  }

  set mxacts(value) {
    this._props.mxacts = value;
  }

  get nss() {
    return this._props.nss;
  }

  set nss(value) {
    this._props.nss = value;
  }

  get ntrib() {
    return this._props.ntrib;
  }

  set ntrib(value) {
    this._props.ntrib = value;
  }

  get ndiv() {
    return this._props.ndiv;
  }

  set ndiv(value) {
    this._props.ndiv = value;
  }

  get icalc() {
    return this._props.icalc;
  }

  set icalc(value) {
    this._props.icalc = value;
  }

  get const() {
    return this._props.const;
  }

  set const(value) {
    this._props.const = value;
  }

  get ipakcb() {
    return this._props.ipakcb;
  }

  set ipakcb(value) {
    this._props.ipakcb = value;
  }

  get istcb2() {
    return this._props.istcb2;
  }

  set istcb2(value) {
    this._props.istcb2 = value;
  }

  get stress_period_data() {
    return this._props.stress_period_data;
  }

  set stress_period_data(value) {
    this._props.stress_period_data = value;
  }

  get segment_data() {
    return this._props.segment_data;
  }

  set segment_data(value) {
    this._props.segment_data = value;
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

  get options() {
    return this._props.options;
  }

  set options(value) {
    this._props.options = value;
  }
}
