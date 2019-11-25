import {IPropertyValueObject} from '../../../types';
import FlopyModflow from './FlopyModflow';
import FlopyModflowPackage from './FlopyModflowPackage';
import FlopyModflowSolverPackage from './FlopyModflowSolverPackage';

export interface IFlopyModflowMfsip {
    mxiter: number;
    nparm: number;
    accl: number;
    hclose: number;
    ipcalc: number;
    wseed: number;
    iprsip: number;
    extension: string;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopyModflowMfsip = {
    mxiter: 200,
    nparm: 5,
    accl: 1,
    hclose: 1e-05,
    ipcalc: 1,
    wseed: 0,
    iprsip: 0,
    extension: 'sip',
    unitnumber: null,
    filenames: null
};

export default class FlopyModflowMfsip extends FlopyModflowSolverPackage<IFlopyModflowMfsip> {

    public static create(model: FlopyModflow, obj = {}) {
        const self = this.fromObject(obj);
        model.setPackage(self);
        return self;
    }

    public static fromDefault() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopyModflowMfsip {
        const d: any = FlopyModflowPackage.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                return d[key] = obj[key];
            }
        }

        return new this(d);
    }

    get mxiter() {
        return this._props.mxiter;
    }

    set mxiter(value) {
        this._props.mxiter = value;
    }

    get nparm() {
        return this._props.nparm;
    }

    set nparm(value) {
        this._props.nparm = value;
    }

    get accl() {
        return this._props.accl;
    }

    set accl(value) {
        this._props.accl = value;
    }

    get hclose() {
        return this._props.hclose;
    }

    set hclose(value) {
        this._props.hclose = value;
    }

    get ipcalc() {
        return this._props.ipcalc;
    }

    set ipcalc(value) {
        this._props.ipcalc = value;
    }

    get wseed() {
        return this._props.wseed;
    }

    set wseed(value) {
        this._props.wseed = value;
    }

    get iprsip() {
        return this._props.iprsip;
    }

    set iprsip(value) {
        this._props.iprsip = value;
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
