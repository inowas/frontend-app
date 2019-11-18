import {IPropertyValueObject} from '../../../types';
import {FlopyModflow, FlopyModflowPackage} from './index';

export interface IFlopyModflowMflpf {
    laytyp: number;
    layavg: number;
    chani: number;
    layvka: number;
    laywet: number;
    ipakcb: number;
    hdry: number;
    iwdflg: number;
    wetfct: number;
    iwetit: number;
    ihdwet: number;
    hk: number;
    hani: number;
    vka: number;
    ss: number;
    sy: number;
    vkcb: number;
    wetdry: number;
    storagecoefficient: boolean;
    constantcv: boolean;
    thickstrt: boolean;
    nocvcorrection: boolean;
    novfc: boolean;
    extension: string;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopyModflowMflpf = {
    laytyp: 0,
    layavg: 0,
    chani: 1.0,
    layvka: 0,
    laywet: 0,
    ipakcb: 0,
    hdry: -1e+30,
    iwdflg: 0,
    wetfct: 0.1,
    iwetit: 1,
    ihdwet: 0,
    hk: 1.0,
    hani: 1.0,
    vka: 1.0,
    ss: 1e-05,
    sy: 0.15,
    vkcb: 0.0,
    wetdry: -0.01,
    storagecoefficient: false,
    constantcv: false,
    thickstrt: false,
    nocvcorrection: false,
    novfc: false,
    extension: 'lpf',
    unitnumber: null,
    filenames: null,
};

export default class FlopyModflowMflpf extends FlopyModflowPackage<IFlopyModflowMflpf> {

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

    get laytyp() {
        return this._props.laytyp;
    }

    set laytyp(value) {
        this._props.laytyp = value;
    }

    get layavg() {
        return this._props.layavg;
    }

    set layavg(value) {
        this._props.layavg = value;
    }

    get chani() {
        return this._props.chani;
    }

    set chani(value) {
        this._props.chani = value;
    }

    get layvka() {
        return this._props.layvka;
    }

    set layvka(value) {
        this._props.layvka = value;
    }

    get laywet() {
        return this._props.laywet;
    }

    set laywet(value) {
        this._props.laywet = value;
    }

    get ipakcb() {
        return this._props.ipakcb;
    }

    set ipakcb(value) {
        this._props.ipakcb = value;
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

    get hk() {
        return this._props.hk;
    }

    set hk(value) {
        this._props.hk = value;
    }

    get hani() {
        return this._props.hani;
    }

    set hani(value) {
        this._props.hani = value;
    }

    get vka() {
        return this._props.vka;
    }

    set vka(value) {
        this._props.vka = value;
    }

    get ss() {
        return this._props.ss;
    }

    set ss(value) {
        this._props.ss = value;
    }

    get sy() {
        return this._props.sy;
    }

    set sy(value) {
        this._props.sy = value;
    }

    get vkcb() {
        return this._props.vkcb;
    }

    set vkcb(value) {
        this._props.vkcb = value;
    }

    get wetdry() {
        return this._props.wetdry;
    }

    set wetdry(value) {
        this._props.wetdry = value;
    }

    get storagecoefficient() {
        return this._props.storagecoefficient;
    }

    set storagecoefficient(value) {
        this._props.storagecoefficient = value;
    }

    get constantcv() {
        return this._props.constantcv;
    }

    set constantcv(value) {
        this._props.constantcv = value;
    }

    get thickstrt() {
        return this._props.thickstrt;
    }

    set thickstrt(value) {
        this._props.thickstrt = value;
    }

    get nocvcorrection() {
        return this._props.nocvcorrection;
    }

    set nocvcorrection(value) {
        this._props.nocvcorrection = value;
    }

    get novfc() {
        return this._props.novfc;
    }

    set novfc(value) {
        this._props.novfc = value;
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
        {name: 'MODFLOW-2005', executable: 'mf2005', version: 'mf2005', default: true}
    ];
}
