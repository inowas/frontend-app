import {Array2D} from '../../../geometry/Array2D.type';
import Soilmodel from '../../../modflow/soilmodel/Soilmodel';
import {IPropertyValueObject} from '../../../types';
import FlopyModflowFlowPackage from './FlopyModflowFlowPackage';
import FlopyModflowPackage from './FlopyModflowPackage';

export interface IFlopyModflowMfupw {
    laytyp: number | number[];
    layavg: number | number[];
    chani: number | number[];
    layvka: number | number[];
    laywet: number | number[];
    ipakcb: number | null;
    hdry: number;
    iphdry: number;
    hk: number | Array<number | Array2D<number>>;
    hani: number | Array<number | Array2D<number>>;
    vka: number | Array<number | Array2D<number>>;
    ss: number | Array<number | Array2D<number>>;
    sy: number | Array<number | Array2D<number>>;
    vkcb: number | Array<number | Array2D<number>>;
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

    public static create(soilmodel: Soilmodel) {
        return this.fromDefault().update(soilmodel);
    }

    public static fromDefault() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopyModflowMfupw {
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
