import {IPropertyValueObject} from '../../../types';
import FlopyMt3dPackage from './FlopyMt3dPackage';

export interface IFlopyMt3dMtAdv extends IPropertyValueObject {
    mixelm: number;
    percel: number;
    mxpart: number;
    nadvfd: number;
    itrack: number;
    wd: number;
    dceps: number;
    nplane: number;
    npl: number;
    nph: number;
    npmin: number;
    npmax: number;
    nlsink: number;
    npsink: number;
    dchmoc: number;
    extension: string;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopyMt3dMtAdv = {
    mixelm: 3,
    percel: 0.75,
    mxpart: 800000,
    nadvfd: 1,
    itrack: 3,
    wd: 0.5,
    dceps: 1e-5,
    nplane: 2,
    npl: 10,
    nph: 40,
    npmin: 5,
    npmax: 80,
    nlsink: 0,
    npsink: 15,
    dchmoc: 0.0001,
    extension: 'adv',
    unitnumber: null,
    filenames: null,
};

class FlopyMt3dMtadv extends FlopyMt3dPackage<IFlopyMt3dMtAdv> {

    public static create(obj = {}) {
        return this.fromObject(obj);
    }

    public static fromDefault() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopyMt3dMtadv {
        const d: any = FlopyMt3dPackage.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                d[key] = obj[key];
            }
        }

        return new this(d);
    }

    public update() {
        return this;
    }

    get mixelm() {
        return this._props.mixelm;
    }

    set mixelm(value) {
        this._props.mixelm = value;
    }

    get percel() {
        return this._props.percel;
    }

    set percel(value) {
        this._props.percel = value;
    }

    get mxpart() {
        return this._props.mxpart;
    }

    set mxpart(value) {
        this._props.mxpart = value;
    }

    get nadvfd() {
        return this._props.nadvfd;
    }

    set nadvfd(value) {
        this._props.nadvfd = value;
    }

    get itrack() {
        return this._props.itrack;
    }

    set itrack(value) {
        this._props.itrack = value;
    }

    get wd() {
        return this._props.wd;
    }

    set wd(value) {
        this._props.wd = value;
    }

    get dceps() {
        return this._props.dceps;
    }

    set dceps(value) {
        this._props.dceps = value;
    }

    get nplane() {
        return this._props.nplane;
    }

    set nplane(value) {
        this._props.nplane = value;
    }

    get npl() {
        return this._props.npl;
    }

    set npl(value) {
        this._props.npl = value;
    }

    get nph() {
        return this._props.nph;
    }

    set nph(value) {
        this._props.nph = value;
    }

    get npmin() {
        return this._props.npmin;
    }

    set npmin(value) {
        this._props.npmin = value;
    }

    get npmax() {
        return this._props.npmax;
    }

    set npmax(value) {
        this._props.npmax = value;
    }

    get nlsink() {
        return this._props.nlsink;
    }

    set nlsink(value) {
        this._props.nlsink = value;
    }

    get npsink() {
        return this._props.npsink;
    }

    set npsink(value) {
        this._props.npsink = value;
    }

    get dchmoc() {
        return this._props.dchmoc;
    }

    set dchmoc(value) {
        this._props.dchmoc = value;
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

export default FlopyMt3dMtadv;
