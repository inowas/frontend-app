import {IPropertyValueObject} from '../../../types';
import {FlopyModflow, FlopyModflowPackage, FlopyModflowSolverPackage} from './index';

export interface IFlopyModflowMfpcg {
    mxiter: number;
    iter1: number;
    npcond: number;
    hclose: number;
    rclose: number;
    relax: number;
    nbpol: number;
    iprpcg: number;
    mutpcg: number;
    damp: number;
    dampt: number;
    ihcofadd: number;
    extension: string;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopyModflowMfpcg = {
    mxiter: 50,
    iter1: 30,
    npcond: 1,
    hclose: 1e-05,
    rclose: 1e-05,
    relax: 1.0,
    nbpol: 0,
    iprpcg: 0,
    mutpcg: 3,
    damp: 1.0,
    dampt: 1.0,
    ihcofadd: 0,
    extension: 'pcg',
    unitnumber: null,
    filenames: null
};

export default class FlopyModflowMfpcg extends FlopyModflowSolverPackage<IFlopyModflowMfpcg> {

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

    get iter1() {
        return this._props.iter1;
    }

    set iter1(value) {
        this._props.iter1 = value;
    }

    get npcond() {
        return this._props.npcond;
    }

    set npcond(value) {
        this._props.npcond = value;
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

    get nbpol() {
        return this._props.nbpol;
    }

    set nbpol(value) {
        this._props.nbpol = value;
    }

    get iprpcg() {
        return this._props.iprpcg;
    }

    set iprpcg(value) {
        this._props.iprpcg = value;
    }

    get mutpcg() {
        return this._props.mutpcg;
    }

    set mutpcg(value) {
        this._props.mutpcg = value;
    }

    get damp() {
        return this._props.damp;
    }

    set damp(value) {
        this._props.damp = value;
    }

    get dampt() {
        return this._props.dampt;
    }

    set dampt(value) {
        this._props.dampt = value;
    }

    get ihcofadd() {
        return this._props.ihcofadd;
    }

    set ihcofadd(value) {
        this._props.ihcofadd = value;
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
