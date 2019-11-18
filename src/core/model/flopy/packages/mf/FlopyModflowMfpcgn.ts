import {IPropertyValueObject} from '../../../types';
import {FlopyModflow, FlopyModflowPackage, FlopyModflowSolverPackage} from './index';

export interface IFlopyModflowMfpcgn {
    iter_mo: number;
    iter_mi: number;
    close_r: number;
    close_h: number;
    relax: number;
    ifill: number;
    unit_pc: number;
    unit_ts: number;
    adamp: number;
    damp: number;
    damp_lb: number;
    rate_d: number;
    chglimit: number;
    acnvg: number;
    cnvg_lb: number;
    mcnvg: number;
    rate_c: number;
    ipunit: number;
    extension: string;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopyModflowMfpcgn = {
    iter_mo: 50,
    iter_mi: 30,
    close_r: 1e-05,
    close_h: 1e-05,
    relax: 1.0,
    ifill: 0,
    unit_pc: 0,
    unit_ts: 0,
    adamp: 0,
    damp: 1.0,
    damp_lb: 0.001,
    rate_d: 0.1,
    chglimit: 0.0,
    acnvg: 0,
    cnvg_lb: 0.001,
    mcnvg: 2,
    rate_c: -1.0,
    ipunit: 0,
    extension: 'pcgn',
    unitnumber: null,
    filenames: null
};

export default class FlopyModflowMfpcgn extends FlopyModflowSolverPackage<IFlopyModflowMfpcgn> {

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

    get iter_mo() {
        return this._props.iter_mo;
    }

    set iter_mo(value) {
        this._props.iter_mo = value;
    }

    get iter_mi() {
        return this._props.iter_mi;
    }

    set iter_mi(value) {
        this._props.iter_mi = value;
    }

    get close_r() {
        return this._props.close_r;
    }

    set close_r(value) {
        this._props.close_r = value;
    }

    get close_h() {
        return this._props.close_h;
    }

    set close_h(value) {
        this._props.close_h = value;
    }

    get relax() {
        return this._props.relax;
    }

    set relax(value) {
        this._props.relax = value;
    }

    get ifill() {
        return this._props.ifill;
    }

    set ifill(value) {
        this._props.ifill = value;
    }

    get unit_pc() {
        return this._props.unit_pc;
    }

    set unit_pc(value) {
        this._props.unit_pc = value;
    }

    get unit_ts() {
        return this._props.unit_ts;
    }

    set unit_ts(value) {
        this._props.unit_ts = value;
    }

    get adamp() {
        return this._props.adamp;
    }

    set adamp(value) {
        this._props.adamp = value;
    }

    get damp() {
        return this._props.damp;
    }

    set damp(value) {
        this._props.damp = value;
    }

    get damp_lb() {
        return this._props.damp_lb;
    }

    set damp_lb(value) {
        this._props.damp_lb = value;
    }

    get rate_d() {
        return this._props.rate_d;
    }

    set rate_d(value) {
        this._props.rate_d = value;
    }

    get chglimit() {
        return this._props.chglimit;
    }

    set chglimit(value) {
        this._props.chglimit = value;
    }

    get acnvg() {
        return this._props.acnvg;
    }

    set acnvg(value) {
        this._props.acnvg = value;
    }

    get cnvg_lb() {
        return this._props.cnvg_lb;
    }

    set cnvg_lb(value) {
        this._props.cnvg_lb = value;
    }

    get mcnvg() {
        return this._props.mcnvg;
    }

    set mcnvg(value) {
        this._props.mcnvg = value;
    }

    get rate_c() {
        return this._props.rate_c;
    }

    set rate_c(value) {
        this._props.rate_c = value;
    }

    get ipunit() {
        return this._props.ipunit;
    }

    set ipunit(value) {
        this._props.ipunit = value;
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
