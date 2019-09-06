import {cloneDeep} from 'lodash';
import {IFlopyModflowMfbcf} from './FlopyModflowMfbcf.type';

export default class FlopyModflowMfbcf {

    get ipakcb() {
        return this._props.ipakcb;
    }

    set ipakcb(value) {
        this._props.ipakcb = value;
    }

    get intercellt() {
        return this._props.intercellt;
    }

    set intercellt(value) {
        this._props.intercellt = value;
    }

    get laycon() {
        return this._props.laycon;
    }

    set laycon(value) {
        this._props.laycon = value;
    }

    get trpy() {
        return this._props.trpy;
    }

    set trpy(value) {
        this._props.trpy = value;
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

    get tran() {
        return this._props.tran;
    }

    set tran(value) {
        this._props.tran = value;
    }

    get hy() {
        return this._props.hy;
    }

    set hy(value) {
        this._props.hy = value;
    }

    get vcont() {
        return this._props.vcont;
    }

    set vcont(value) {
        this._props.vcont = value;
    }

    get sf1() {
        return this._props.sf1;
    }

    set sf1(value) {
        this._props.sf1 = value;
    }

    get sf2() {
        return this._props.sf2;
    }

    set sf2(value) {
        this._props.sf2 = value;
    }

    get wetdry() {
        return this._props.wetdry;
    }

    set wetdry(value) {
        this._props.wetdry = value;
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

    public static create() {
        return new FlopyModflowMfbcf({
            ipakcb: 0,
            intercellt: 0,
            laycon: 3,
            trpy: 1.0,
            hdry: -1e+30,
            iwdflg: 0,
            wetfct: 0.1,
            iwetit: 1,
            ihdwet: 0,
            tran: 1.0,
            hy: 1.0,
            vcont: 1.0,
            sf1: 1e-05,
            sf2: 0.15,
            wetdry: -0.01,
            extension: 'bcf',
            unitnumber: null,
            filenames: null
        });
    }

    public static fromObject(obj: IFlopyModflowMfbcf) {
        return new FlopyModflowMfbcf(obj);
    }

    private readonly _props: IFlopyModflowMfbcf;

    constructor(props: IFlopyModflowMfbcf) {
        this._props = props;
    }

    public supportedModflowVersions = () => [
        {name: 'MODFLOW-2005', executable: 'mf2005', version: 'mf2005', default: true},
    ];

    public toObject = () => (cloneDeep(this._props));
}
