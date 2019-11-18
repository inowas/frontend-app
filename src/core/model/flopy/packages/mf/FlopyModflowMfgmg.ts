import {IPropertyValueObject} from '../../../types';
import {FlopyModflow, FlopyModflowPackage, FlopyModflowSolverPackage} from './index';

export interface IFlopyModflowMfgmg {
    mxiter: number;
    iiter: number;
    iadamp: number;
    hclose: number;
    rclose: number;
    relax: number;
    ioutgmg: number;
    iunitmhc: number | null;
    ism: number;
    isc: number;
    damp: number;
    dup: number;
    dlow: number;
    chglimit: number;
    extension: string;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopyModflowMfgmg = {
    mxiter: 50,
    iiter: 30,
    iadamp: 0,
    hclose: 1e-05,
    rclose: 1e-05,
    relax: 1.0,
    ioutgmg: 0,
    iunitmhc: null,
    ism: 0,
    isc: 0,
    damp: 1.0,
    dup: 0.75,
    dlow: 0.01,
    chglimit: 1.0,
    extension: 'gmg',
    unitnumber: null,
    filenames: null
};

export default class FlopyModflowMfgmg extends FlopyModflowSolverPackage<IFlopyModflowMfgmg> {

    public static create(model: FlopyModflow, obj = {}) {
        const self = this.fromObject(obj);
        model.setPackage(self);
        return self;
    }

    public static fromObject(obj: IPropertyValueObject) {
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

    get iiter() {
        return this._props.iiter;
    }

    set iiter(value) {
        this._props.iiter = value;
    }

    get iadamp() {
        return this._props.iadamp;
    }

    set iadamp(value) {
        this._props.iadamp = value;
    }

    get hclose() {
        return this._props.hclose;
    }

    set hclose(value) {
        this._props.hclose = value;
    }

    get rclose() {
        return this._props.rclose;
    }

    set rclose(value) {
        this._props.rclose = value;
    }

    get relax() {
        return this._props.relax;
    }

    set relax(value) {
        this._props.relax = value;
    }

    get ioutgmg() {
        return this._props.ioutgmg;
    }

    set ioutgmg(value) {
        this._props.ioutgmg = value;
    }

    get iunitmhc() {
        return this._props.iunitmhc;
    }

    set iunitmhc(value) {
        this._props.iunitmhc = value;
    }

    get ism() {
        return this._props.ism;
    }

    set ism(value) {
        this._props.ism = value;
    }

    get isc() {
        return this._props.isc;
    }

    set isc(value) {
        this._props.isc = value;
    }

    get damp() {
        return this._props.damp;
    }

    set damp(value) {
        this._props.damp = value;
    }

    get dup() {
        return this._props.dup;
    }

    set dup(value) {
        this._props.dup = value;
    }

    get dlow() {
        return this._props.dlow;
    }

    set dlow(value) {
        this._props.dlow = value;
    }

    get chglimit() {
        return this._props.chglimit;
    }

    set chglimit(value) {
        this._props.chglimit = value;
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
