import {IPropertyValueObject} from '../../../types';
import FlopyMt3dPackage from './FlopyMt3dPackage';

export interface IFlopyMt3dMtgcg {
    mxiter: number;
    iter1: number;
    isolve: number;
    ncrs: number;
    accl: number;
    cclose: number;
    iprgcg: number;
    extension: string;
    unitnumber: number | null;
    filenames: string | string[] | null;
}

export const defaults: IFlopyMt3dMtgcg = {
    mxiter: 1,
    iter1: 50,
    isolve: 3,
    ncrs: 0,
    accl: 1,
    cclose: 1e-5,
    iprgcg: 0,
    extension: 'gcg',
    unitnumber: null,
    filenames: null,
};

class FlopyMt3dMtgcg extends FlopyMt3dPackage<IFlopyMt3dMtgcg> {

    public static create(obj = {}) {
        return this.fromObject(obj);
    }

    public static fromDefault() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopyMt3dMtgcg {
        const d: any = FlopyMt3dPackage.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                d[key] = obj[key];
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

    get iter1() {
        return this._props.iter1;
    }

    set iter1(value) {
        this._props.iter1 = value;
    }

    get isolve() {
        return this._props.isolve;
    }

    set isolve(value) {
        this._props.isolve = value;
    }

    get ncrs() {
        return this._props.ncrs;
    }

    set ncrs(value) {
        this._props.ncrs = value;
    }

    get accl() {
        return this._props.accl;
    }

    set accl(value) {
        this._props.accl = value;
    }

    get cclose() {
        return this._props.cclose;
    }

    set cclose(value) {
        this._props.cclose = value;
    }

    get iprgcg() {
        return this._props.iprgcg;
    }

    set iprgcg(value) {
        this._props.iprgcg = value;
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

export default FlopyMt3dMtgcg;
