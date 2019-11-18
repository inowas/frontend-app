import {IPropertyValueObject} from '../../../types';
import FlopyModflowPackage from './FlopyModflowPackage';
import {FlopyModflow, FlopyModflowSolverPackage} from './index';

export interface IFlopyModflowMfsms {
    hclose: number;
    hiclose: number;
    mxiter: number;
    iter1: number;
    iprsms: number;
    nonlinmeth: number;
    linmeth: number;
    theta: number;
    akappa: number;
    gamma: number;
    amomentum: number;
    numtrack: number;
    btol: number;
    breduc: number;
    reslim: number;
    iacl: number;
    norder: number;
    level: number;
    north: number;
    iredsys: number;
    rrctol: number;
    idroptol: number;
    epsrn: number;
    clin: string;
    ipc: number;
    iscl: number;
    iord: number;
    rclosepcgu: number;
    relaxpcgu: number;

    extension: string;
    options: null;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopyModflowMfsms = {
    hclose: 0.0001,
    hiclose: 0.0001,
    mxiter: 100,
    iter1: 20,
    iprsms: 2,
    nonlinmeth: 0,
    linmeth: 2,
    theta: 0.7,
    akappa: 0.1,
    gamma: 0.2,
    amomentum: 0.001,
    numtrack: 20,
    btol: 10000.0,
    breduc: 0.2,
    reslim: 100.0,
    iacl: 2,
    norder: 0,
    level: 7,
    north: 2,
    iredsys: 0,
    rrctol: 0.0,
    idroptol: 0,
    epsrn: 0.001,
    clin: 'bcgs',
    ipc: 3,
    iscl: 0,
    iord: 0,
    rclosepcgu: 0.1,
    relaxpcgu: 1.0,
    extension: 'sms',
    options: null,
    unitnumber: null,
    filenames: null
};

export default class FlopyModflowMfsms extends FlopyModflowSolverPackage<IFlopyModflowMfsms> {

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

    get hclose() {
        return this._props.hclose;
    }

    set hclose(value) {
        this._props.hclose = value;
    }

    get hiclose() {
        return this._props.hiclose;
    }

    set hiclose(value) {
        this._props.hiclose = value;
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

    get iprsms() {
        return this._props.iprsms;
    }

    set iprsms(value) {
        this._props.iprsms = value;
    }

    get nonlinmeth() {
        return this._props.nonlinmeth;
    }

    set nonlinmeth(value) {
        this._props.nonlinmeth = value;
    }

    get linmeth() {
        return this._props.linmeth;
    }

    set linmeth(value) {
        this._props.linmeth = value;
    }

    get theta() {
        return this._props.theta;
    }

    set theta(value) {
        this._props.theta = value;
    }

    get akappa() {
        return this._props.akappa;
    }

    set akappa(value) {
        this._props.akappa = value;
    }

    get gamma() {
        return this._props.gamma;
    }

    set gamma(value) {
        this._props.gamma = value;
    }

    get amomentum() {
        return this._props.amomentum;
    }

    set amomentum(value) {
        this._props.amomentum = value;
    }

    get numtrack() {
        return this._props.numtrack;
    }

    set numtrack(value) {
        this._props.numtrack = value;
    }

    get btol() {
        return this._props.btol;
    }

    set btol(value) {
        this._props.btol = value;
    }

    get breduc() {
        return this._props.breduc;
    }

    set breduc(value) {
        this._props.breduc = value;
    }

    get reslim() {
        return this._props.reslim;
    }

    set reslim(value) {
        this._props.reslim = value;
    }

    get iacl() {
        return this._props.iacl;
    }

    set iacl(value) {
        this._props.iacl = value;
    }

    get norder() {
        return this._props.norder;
    }

    set norder(value) {
        this._props.norder = value;
    }

    get level() {
        return this._props.level;
    }

    set level(value) {
        this._props.level = value;
    }

    get north() {
        return this._props.north;
    }

    set north(value) {
        this._props.north = value;
    }

    get iredsys() {
        return this._props.iredsys;
    }

    set iredsys(value) {
        this._props.iredsys = value;
    }

    get rrctol() {
        return this._props.rrctol;
    }

    set rrctol(value) {
        this._props.rrctol = value;
    }

    get idroptol() {
        return this._props.idroptol;
    }

    set idroptol(value) {
        this._props.idroptol = value;
    }

    get epsrn() {
        return this._props.epsrn;
    }

    set epsrn(value) {
        this._props.epsrn = value;
    }

    get clin() {
        return this._props.clin;
    }

    set clin(value) {
        this._props.clin = value;
    }

    get ipc() {
        return this._props.ipc;
    }

    set ipc(value) {
        this._props.ipc = value;
    }

    get iscl() {
        return this._props.iscl;
    }

    set iscl(value) {
        this._props.iscl = value;
    }

    get iord() {
        return this._props.iord;
    }

    set iord(value) {
        this._props.iord = value;
    }

    get rclosepcgu() {
        return this._props.rclosepcgu;
    }

    set rclosepcgu(value) {
        this._props.rclosepcgu = value;
    }

    get relaxpcgu() {
        return this._props.relaxpcgu;
    }

    set relaxpcgu(value) {
        this._props.relaxpcgu = value;
    }

    get extension() {
        return this._props.extension;
    }

    set extension(value) {
        this._props.extension = value;
    }

    get options() {
        return this._props.options;
    }

    set options(value) {
        this._props.options = value;
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
