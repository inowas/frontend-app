import {Array2D, Array3D} from '../../../geometry/Array2D.type';
import {IPropertyValueObject} from '../../../types';
import {FlopyModflow, FlopyModflowPackage} from './index';

export interface IFlopyModflowMfbcf {
    ipakcb: number;
    intercellt: number;
    laycon: number;
    trpy: number | number[];
    hdry: number;
    iwdflg: number;
    wetfct: number;
    iwetit: number;
    ihdwet: number;
    tran: number | Array3D<number>;
    hy: number | Array3D<number>;
    vcont: number | Array3D<number>;
    sf1: number | Array3D<number>;
    sf2: number | Array2D<number>;
    wetdry: number;
    extension: string;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopyModflowMfbcf = {
    ipakcb: 0,
    intercellt: 0,
    laycon: 3,
    trpy: 1.0,
    hdry: -1e+30,
    iwdflg: 0,
    wetfct: 0.1,
    iwetit: 1,
    ihdwet: 0,
    tran: 1.0,
    hy: 1.0,
    vcont: 1.0,
    sf1: 1e-05,
    sf2: 0.15,
    wetdry: -0.01,
    extension: 'bcf',
    unitnumber: null,
    filenames: null
};

export default class FlopyModflowMfbcf extends FlopyModflowPackage<IFlopyModflowMfbcf> {

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

    protected _props = {...defaults};

    get ipakcb() {
        return this._props.ipakcb;
    }

    set ipakcb(value) {
        this._props.ipakcb = value;
    }

    get intercellt() {
        return this._props.intercellt;
    }

    set intercellt(value) {
        this._props.intercellt = value;
    }

    get laycon() {
        return this._props.laycon;
    }

    set laycon(value) {
        this._props.laycon = value;
    }

    get trpy() {
        return this._props.trpy;
    }

    set trpy(value) {
        this._props.trpy = value;
    }

    get hdry() {
        return this._props.hdry;
    }

    set hdry(value) {
        this._props.hdry = value;
    }

    get iwdflg() {
        return this._props.iwdflg;
    }

    set iwdflg(value) {
        this._props.iwdflg = value;
    }

    get wetfct() {
        return this._props.wetfct;
    }

    set wetfct(value) {
        this._props.wetfct = value;
    }

    get iwetit() {
        return this._props.iwetit;
    }

    set iwetit(value) {
        this._props.iwetit = value;
    }

    get ihdwet() {
        return this._props.ihdwet;
    }

    set ihdwet(value) {
        this._props.ihdwet = value;
    }

    get tran() {
        return this._props.tran;
    }

    set tran(value) {
        this._props.tran = value;
    }

    get hy() {
        return this._props.hy;
    }

    set hy(value) {
        this._props.hy = value;
    }

    get vcont() {
        return this._props.vcont;
    }

    set vcont(value) {
        this._props.vcont = value;
    }

    get sf1() {
        return this._props.sf1;
    }

    set sf1(value) {
        this._props.sf1 = value;
    }

    get sf2() {
        return this._props.sf2;
    }

    set sf2(value) {
        this._props.sf2 = value;
    }

    get wetdry() {
        return this._props.wetdry;
    }

    set wetdry(value) {
        this._props.wetdry = value;
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
        {name: 'MODFLOW-2005', executable: 'mf2005', version: 'mf2005', default: true},
    ];
}
