import {IPropertyValueObject} from '../../../types';
import FlopyModflowFlowPackage from './FlopyModflowFlowPackage';
import {FlopyModflow, FlopyModflowPackage} from './index';

export interface IFlopyModflowMfupw {
    laytyp: number;
    layavg: number;
    chani: number;
    layvka: number;
    laywet: number;
    ipakcb: number | null;
    hdry: number;
    iphdry: number;
    hk: number;
    hani: number;
    vka: number;
    ss: number;
    sy: number;
    vkcb: number;
    noparcheck: boolean;
    extension: string;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopyModflowMfupw = {
    laytyp: 0,
    layavg: 0,
    chani: 1.0,
    layvka: 0,
    laywet: 0,
    ipakcb: null,
    hdry: -1e+30,
    iphdry: 0,
    hk: 1.0,
    hani: 1.0,
    vka: 1.0,
    ss: 1e-05,
    sy: 0.15,
    vkcb: 0.0,
    noparcheck: false,
    extension: 'upw',
    unitnumber: null,
    filenames: null,
};

export default class FlopyModflowMfupw extends FlopyModflowFlowPackage<IFlopyModflowMfupw> {

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

    get iphdry() {
        return this._props.iphdry;
    }

    set iphdry(value) {
        this._props.iphdry = value;
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

    get noparcheck() {
        return this._props.noparcheck;
    }

    set noparcheck(value) {
        this._props.noparcheck = value;
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
        {name: 'MODFLOW-NWT', executable: 'mfnwt', version: 'mfnwt', default: true}
    ];
}
