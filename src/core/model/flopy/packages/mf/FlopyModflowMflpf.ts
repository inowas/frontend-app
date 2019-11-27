import {Array2D} from '../../../geometry/Array2D.type';
import Soilmodel from '../../../modflow/soilmodel/Soilmodel';
import {IPropertyValueObject} from '../../../types';
import FlopyModflowFlowPackage from './FlopyModflowFlowPackage';
import FlopyModflowPackage from './FlopyModflowPackage';

export interface IFlopyModflowMflpf extends IPropertyValueObject {
    laytyp: number | number[];
    layavg: number | number[];
    chani: number | number[];
    layvka: number | number[];
    laywet: number | number[];
    ipakcb: number;
    hdry: number;
    iwdflg: number | number[];
    wetfct: number;
    iwetit: number;
    ihdwet: number;
    hk: number | Array<number | Array2D<number>>;
    hani: number | Array<number | Array2D<number>>;
    vka: number | Array<number | Array2D<number>>;
    ss: number | Array<number | Array2D<number>>;
    sy: number | Array<number | Array2D<number>>;
    vkcb: number | Array<number | Array2D<number>>;
    wetdry: number | Array<number | Array2D<number>>;
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
    ipakcb: 53,
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

export default class FlopyModflowMflpf extends FlopyModflowFlowPackage<IFlopyModflowMflpf> {

    public static create(soilmodel: Soilmodel) {
        return this.fromDefault().update(soilmodel);
    }

    public static fromDefault() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopyModflowMflpf {
        const d: any = FlopyModflowPackage.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                d[key] = obj[key];
            }
        }

        return new this(d);
    }

    public update(soilmodel: Soilmodel) {
        const layers = soilmodel.layersCollection.orderBy('number').all;
        this.laytyp = layers.map((l) => l.laytyp);
        this.layavg = layers.map((l) => l.layavg);
        this.chani = layers.map(() => 0);
        this.layvka = layers.map(() => 0);
        this.laywet = layers.map((l) => l.laywet);
        this.hk = soilmodel.getParameterValue('hk');
        this.hani = soilmodel.getParameterValue('hani');
        this.vka = soilmodel.getParameterValue('vka');
        this.ss = soilmodel.getParameterValue('ss');
        this.sy = soilmodel.getParameterValue('sy');
        return this;
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
