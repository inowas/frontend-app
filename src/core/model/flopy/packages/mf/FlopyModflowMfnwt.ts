import {IPropertyValueObject} from '../../../types';
import FlopyModflowPackage from './FlopyModflowPackage';
import FlopyModflowSolverPackage from './FlopyModflowSolverPackage';

export interface IFlopyModflowMfnwt {
    headtol: number;
    fluxtol: number;
    maxiterout: number;
    thickfact: number;
    linmeth: number;
    iprnwt: number;
    ibotav: number;
    options: string;
    Continue: boolean;
    dbdtheta: number;
    dbdkappa: number;
    dbdgamma: number;
    momfact: number;
    backflag: number;
    maxbackiter: number;
    backtol: number;
    backreduce: number;
    maxitinner: number;
    ilumethod: number;
    levfill: number;
    stoptol: number;
    msdr: number;
    iacl: number;
    norder: number;
    level: number;
    north: number;
    iredsys: number;
    rrctols: number;
    idroptol: number;
    epsrn: number;
    hclosexmd: number;
    mxiterxmd: number;
    extension: string;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopyModflowMfnwt = {
    headtol: 0.01,
    fluxtol: 500,
    maxiterout: 100,
    thickfact: 1e-05,
    linmeth: 1,
    iprnwt: 0,
    ibotav: 0,
    options: 'COMPLEX',
    Continue: false,
    dbdtheta: 0.4,
    dbdkappa: 1e-05,
    dbdgamma: 0.0,
    momfact: 0.1,
    backflag: 1,
    maxbackiter: 50,
    backtol: 1.1,
    backreduce: 0.7,
    maxitinner: 50,
    ilumethod: 2,
    levfill: 5,
    stoptol: 1e-10,
    msdr: 15,
    iacl: 2,
    norder: 1,
    level: 5,
    north: 7,
    iredsys: 0,
    rrctols: 0.0,
    idroptol: 1,
    epsrn: 0.0001,
    hclosexmd: 0.0001,
    mxiterxmd: 50,
    extension: 'nwt',
    unitnumber: null,
    filenames: null
};

export default class FlopyModflowMfnwt extends FlopyModflowSolverPackage<IFlopyModflowMfnwt> {

    public static create() {
        return this.fromDefault();
    }

    public static fromDefault() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopyModflowMfnwt {
        const d: any = FlopyModflowPackage.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                return d[key] = obj[key];
            }
        }

        return new this(d);
    }

    protected _props = {...defaults};

    get headtol() {
        return this._props.headtol;
    }

    set headtol(value) {
        this._props.headtol = value;
    }

    get fluxtol() {
        return this._props.fluxtol;
    }

    set fluxtol(value) {
        this._props.fluxtol = value;
    }

    get maxiterout() {
        return this._props.maxiterout;
    }

    set maxiterout(value) {
        this._props.maxiterout = value;
    }

    get thickfact() {
        return this._props.thickfact;
    }

    set thickfact(value) {
        this._props.thickfact = value;
    }

    get linmeth() {
        return this._props.linmeth;
    }

    set linmeth(value) {
        this._props.linmeth = value;
    }

    get iprnwt() {
        return this._props.iprnwt;
    }

    set iprnwt(value) {
        this._props.iprnwt = value;
    }

    get ibotav() {
        return this._props.ibotav;
    }

    set ibotav(value) {
        this._props.ibotav = value;
    }

    get options() {
        return this._props.options;
    }

    set options(value) {
        this._props.options = value;
    }

    get Continue() {
        return this._props.Continue;
    }

    set Continue(value) {
        this._props.Continue = value;
    }

    get dbdtheta() {
        return this._props.dbdtheta;
    }

    set dbdtheta(value) {
        this._props.dbdtheta = value;
    }

    get dbdkappa() {
        return this._props.dbdkappa;
    }

    set dbdkappa(value) {
        this._props.dbdkappa = value;
    }

    get dbdgamma() {
        return this._props.dbdgamma;
    }

    set dbdgamma(value) {
        this._props.dbdgamma = value;
    }

    get momfact() {
        return this._props.momfact;
    }

    set momfact(value) {
        this._props.momfact = value;
    }

    get backflag() {
        return this._props.backflag;
    }

    set backflag(value) {
        this._props.backflag = value;
    }

    get maxbackiter() {
        return this._props.maxbackiter;
    }

    set maxbackiter(value) {
        this._props.maxbackiter = value;
    }

    get backtol() {
        return this._props.backtol;
    }

    set backtol(value) {
        this._props.backtol = value;
    }

    get backreduce() {
        return this._props.backreduce;
    }

    set backreduce(value) {
        this._props.backreduce = value;
    }

    get maxitinner() {
        return this._props.maxitinner;
    }

    set maxitinner(value) {
        this._props.maxitinner = value;
    }

    get ilumethod() {
        return this._props.ilumethod;
    }

    set ilumethod(value) {
        this._props.ilumethod = value;
    }

    get levfill() {
        return this._props.levfill;
    }

    set levfill(value) {
        this._props.levfill = value;
    }

    get stoptol() {
        return this._props.stoptol;
    }

    set stoptol(value) {
        this._props.stoptol = value;
    }

    get msdr() {
        return this._props.msdr;
    }

    set msdr(value) {
        this._props.msdr = value;
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

    get rrctols() {
        return this._props.rrctols;
    }

    set rrctols(value) {
        this._props.rrctols = value;
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

    get hclosexmd() {
        return this._props.hclosexmd;
    }

    set hclosexmd(value) {
        this._props.hclosexmd = value;
    }

    get mxiterxmd() {
        return this._props.mxiterxmd;
    }

    set mxiterxmd(value) {
        this._props.mxiterxmd = value;
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
