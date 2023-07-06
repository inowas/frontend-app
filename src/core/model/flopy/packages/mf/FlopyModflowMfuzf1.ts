import { IPropertyValueObject } from '../../../types';
import BoundaryCollection from '../../../modflow/boundaries/BoundaryCollection';
import FlopyModflowBoundary from './FlopyModflowBoundary';
import FlopyModflowPackage from './FlopyModflowPackage';
import Stressperiods from '../../../modflow/Stressperiods';

export interface IFlopyModflowMfuzf1 {
  nuztop: number;
  iuzfopt: number;
  irunflg: number;
  ietflg: number;
  ipakcb: number | null;
  iuzfcb2: number | null;
  ntrail2: number;
  nsets: number;
  surfdep: number;
  iuzfbnd: number;
  irunbnd: number;
  vks: number;
  eps: number;
  thts: number;
  thtr: number;
  thti: number;
  specifythtr: number;
  specifythti: number;
  nosurfleak: number;
  finf: number;
  pet: number;
  extdp: number;
  extwc: number;
  nwt_11_fmt: boolean;
  specifysurfk: boolean;
  rejectsurfk: boolean;
  seepsurfk: boolean;
  etsquare: number | null;
  netflux: null;
  nuzgag: null;
  uzgag: null;
  extension: string;
  unitnumber: number | null;
  filenames: null | string | string[];
}

export const defaults: IFlopyModflowMfuzf1 = {
  nuztop: 1,
  iuzfopt: 0,
  irunflg: 0,
  ietflg: 0,
  ipakcb: null,
  iuzfcb2: null,
  ntrail2: 10,
  nsets: 20,
  surfdep: 1.0,
  iuzfbnd: 1,
  irunbnd: 0,
  vks: 1e-06,
  eps: 3.5,
  thts: 0.35,
  thtr: 0.15,
  thti: 0.2,
  specifythtr: 0,
  specifythti: 0,
  nosurfleak: 0,
  finf: 1e-08,
  pet: 5e-08,
  extdp: 15.0,
  extwc: 0.1,
  nwt_11_fmt: false,
  specifysurfk: false,
  rejectsurfk: false,
  seepsurfk: false,
  etsquare: null,
  netflux: null,
  nuzgag: null,
  uzgag: null,
  extension: 'uzf',
  unitnumber: null,
  filenames: null,
};

export default class FlopyModflowMfuzf1 extends FlopyModflowBoundary<IFlopyModflowMfuzf1> {

  public static create(boundaries: BoundaryCollection, stressperiods: Stressperiods) {
    return this.fromDefault().update(boundaries, stressperiods);
  }

  public static fromDefault() {
    return this.fromObject({});
  }

  public static fromObject(obj: IPropertyValueObject): FlopyModflowMfuzf1 {
    const d: any = FlopyModflowPackage.cloneDeep(defaults);
    for (const key in d) {
      if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
        d[key] = obj[key];
      }
    }

    return new this(d);
  }

  // TODO
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update = (boundaries: BoundaryCollection, stressperiods: Stressperiods) => {
    return this;
  };

  get nuztop() {
    return this._props.nuztop;
  }

  set nuztop(value) {
    this._props.nuztop = value;
  }

  get iuzfopt() {
    return this._props.iuzfopt;
  }

  set iuzfopt(value) {
    this._props.iuzfopt = value;
  }

  get irunflg() {
    return this._props.irunflg;
  }

  set irunflg(value) {
    this._props.irunflg = value;
  }

  get ietflg() {
    return this._props.ietflg;
  }

  set ietflg(value) {
    this._props.ietflg = value;
  }

  get ipakcb() {
    return this._props.ipakcb;
  }

  set ipakcb(value) {
    this._props.ipakcb = value;
  }

  get iuzfcb2() {
    return this._props.iuzfcb2;
  }

  set iuzfcb2(value) {
    this._props.iuzfcb2 = value;
  }

  get ntrail2() {
    return this._props.ntrail2;
  }

  set ntrail2(value) {
    this._props.ntrail2 = value;
  }

  get nsets() {
    return this._props.nsets;
  }

  set nsets(value) {
    this._props.nsets = value;
  }

  get surfdep() {
    return this._props.surfdep;
  }

  set surfdep(value) {
    this._props.surfdep = value;
  }

  get iuzfbnd() {
    return this._props.iuzfbnd;
  }

  set iuzfbnd(value) {
    this._props.iuzfbnd = value;
  }

  get irunbnd() {
    return this._props.irunbnd;
  }

  set irunbnd(value) {
    this._props.irunbnd = value;
  }

  get vks() {
    return this._props.vks;
  }

  set vks(value) {
    this._props.vks = value;
  }

  get eps() {
    return this._props.eps;
  }

  set eps(value) {
    this._props.eps = value;
  }

  get thts() {
    return this._props.thts;
  }

  set thts(value) {
    this._props.thts = value;
  }

  get thtr() {
    return this._props.thtr;
  }

  set thtr(value) {
    this._props.thtr = value;
  }

  get thti() {
    return this._props.thti;
  }

  set thti(value) {
    this._props.thti = value;
  }

  get specifythtr() {
    return this._props.specifythtr;
  }

  set specifythtr(value) {
    this._props.specifythtr = value;
  }

  get specifythti() {
    return this._props.specifythti;
  }

  set specifythti(value) {
    this._props.specifythti = value;
  }

  get nosurfleak() {
    return this._props.nosurfleak;
  }

  set nosurfleak(value) {
    this._props.nosurfleak = value;
  }

  get finf() {
    return this._props.finf;
  }

  set finf(value) {
    this._props.finf = value;
  }

  get pet() {
    return this._props.pet;
  }

  set pet(value) {
    this._props.pet = value;
  }

  get extdp() {
    return this._props.extdp;
  }

  set extdp(value) {
    this._props.extdp = value;
  }

  get extwc() {
    return this._props.extwc;
  }

  set extwc(value) {
    this._props.extwc = value;
  }

  get nwt_11_fmt() {
    return this._props.nwt_11_fmt;
  }

  set nwt_11_fmt(value) {
    this._props.nwt_11_fmt = value;
  }

  get specifysurfk() {
    return this._props.specifysurfk;
  }

  set specifysurfk(value) {
    this._props.specifysurfk = value;
  }

  get rejectsurfk() {
    return this._props.rejectsurfk;
  }

  set rejectsurfk(value) {
    this._props.rejectsurfk = value;
  }

  get seepsurfk() {
    return this._props.seepsurfk;
  }

  set seepsurfk(value) {
    this._props.seepsurfk = value;
  }

  get etsquare() {
    return this._props.etsquare;
  }

  set etsquare(value) {
    this._props.etsquare = value;
  }

  get netflux() {
    return this._props.netflux;
  }

  set netflux(value) {
    this._props.netflux = value;
  }

  get nuzgag() {
    return this._props.nuzgag;
  }

  set nuzgag(value) {
    this._props.nuzgag = value;
  }

  get uzgag() {
    return this._props.uzgag;
  }

  set uzgag(value) {
    this._props.uzgag = value;
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

  public supportedModflowVersions = () => [
    { name: 'MODFLOW-2005', executable: 'mf2005', version: 'mf2005', default: true },
    { name: 'MODFLOW-NWT', executable: 'mfnwt', version: 'mfnwt' },
  ];
}
