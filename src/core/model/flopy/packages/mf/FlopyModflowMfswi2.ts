import Soilmodel from '../../../modflow/soilmodel/Soilmodel';
import {IPropertyValueObject} from '../../../types';
import FlopyModflowFlowPackage from './FlopyModflowFlowPackage';
import FlopyModflowPackage from './FlopyModflowPackage';

export interface IFlopyModflowMfswi2 {
    nsrf: number;
    istrat: number;
    nobs: number;
    iswizt: number | null;
    ipakcb: number | null;
    iswiobs: number;
    options: number | null;
    nsolver: number;
    iprsol: number;
    mutsol: number;
    solver2params: ISolver2params;
    toeslope: number;
    tipslope: number;
    alpha: number | null;
    beta: number;
    nadptmx: number;
    nadptmn: number;
    adptfct: number;
    nu: number;
    zeta: number[];
    ssz: number;
    isource: number;
    obsnam: number | null;
    obslrc: number | null;
    npln: number | null;
    extension: string;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export interface ISolver2params {
    'damp': number;
    'dampt': number;
    'iter1': number;
    'mxiter': number;
    'nbpol': number;
    'npcond': number;
    'rclose': number;
    'relax': number;
    'zclose': number;
}

export const defaults: IFlopyModflowMfswi2 = {
    nsrf: 1,
    istrat: 1,
    nobs: 0,
    iswizt: null,
    ipakcb: null,
    iswiobs: 0,
    options: null,
    nsolver: 1,
    iprsol: 0,
    mutsol: 3,
    solver2params: {
        damp: 1.0,
        dampt: 1.0,
        iter1: 20,
        mxiter: 100,
        nbpol: 2,
        npcond: 1,
        rclose: 0.0001,
        relax: 1.0,
        zclose: 0.001
    },
    toeslope: 0.05,
    tipslope: 0.05,
    alpha: null,
    beta: 0.1,
    nadptmx: 1,
    nadptmn: 1,
    adptfct: 1.0,
    nu: 0.025,
    zeta: [0.0],
    ssz: 0.25,
    isource: 0,
    obsnam: null,
    obslrc: null,
    npln: null,
    extension: 'swi2',
    unitnumber: null,
    filenames: null,
};

export default class FlopyModflowMfswi2 extends FlopyModflowFlowPackage<IFlopyModflowMfswi2> {

    public static create(soilmodel: Soilmodel) {
        return this.fromDefault().update(soilmodel);
    }

    public static fromDefault() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopyModflowMfswi2 {
        const d: any = FlopyModflowPackage.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                d[key] = obj[key];
            }
        }

        return new this(d);
    }

    // TODO
    public update(soilmodel: Soilmodel) {
        return this;
    }

    get nsrf() {
        return this._props.nsrf;
    }

    set nsrf(value) {
        this._props.nsrf = value;
    }

    get istrat() {
        return this._props.istrat;
    }

    set istrat(value) {
        this._props.istrat = value;
    }

    get nobs() {
        return this._props.nobs;
    }

    set nobs(value) {
        this._props.nobs = value;
    }

    get iswizt() {
        return this._props.iswizt;
    }

    set iswizt(value) {
        this._props.iswizt = value;
    }

    get ipakcb() {
        return this._props.ipakcb;
    }

    set ipakcb(value) {
        this._props.ipakcb = value;
    }

    get iswiobs() {
        return this._props.iswiobs;
    }

    set iswiobs(value) {
        this._props.iswiobs = value;
    }

    get options() {
        return this._props.options;
    }

    set options(value) {
        this._props.options = value;
    }

    get nsolver() {
        return this._props.nsolver;
    }

    set nsolver(value) {
        this._props.nsolver = value;
    }

    get iprsol() {
        return this._props.iprsol;
    }

    set iprsol(value) {
        this._props.iprsol = value;
    }

    get mutsol() {
        return this._props.mutsol;
    }

    set mutsol(value) {
        this._props.mutsol = value;
    }

    get solver2params() {
        return this._props.solver2params;
    }

    set solver2params(value) {
        this._props.solver2params = value;
    }

    get toeslope() {
        return this._props.toeslope;
    }

    set toeslope(value) {
        this._props.toeslope = value;
    }

    get tipslope() {
        return this._props.tipslope;
    }

    set tipslope(value) {
        this._props.tipslope = value;
    }

    get alpha() {
        return this._props.alpha;
    }

    set alpha(value) {
        this._props.alpha = value;
    }

    get beta() {
        return this._props.beta;
    }

    set beta(value) {
        this._props.beta = value;
    }

    get nadptmx() {
        return this._props.nadptmx;
    }

    set nadptmx(value) {
        this._props.nadptmx = value;
    }

    get nadptmn() {
        return this._props.nadptmn;
    }

    set nadptmn(value) {
        this._props.nadptmn = value;
    }

    get adptfct() {
        return this._props.adptfct;
    }

    set adptfct(value) {
        this._props.adptfct = value;
    }

    get nu() {
        return this._props.nu;
    }

    set nu(value) {
        this._props.nu = value;
    }

    get zeta() {
        return this._props.zeta;
    }

    set zeta(value) {
        this._props.zeta = value;
    }

    get ssz() {
        return this._props.ssz;
    }

    set ssz(value) {
        this._props.ssz = value;
    }

    get isource() {
        return this._props.isource;
    }

    set isource(value) {
        this._props.isource = value;
    }

    get obsnam() {
        return this._props.obsnam;
    }

    set obsnam(value) {
        this._props.obsnam = value;
    }

    get obslrc() {
        return this._props.obslrc;
    }

    set obslrc(value) {
        this._props.obslrc = value;
    }

    get npln() {
        return this._props.npln;
    }

    set npln(value) {
        this._props.npln = value;
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

    public supportedModflowVersions() {
        return [];
    }
}
