import {cloneDeep} from 'lodash';
import {IFlopyModflowMfdis} from './FlopyModflowMfdis.type';

export default class FlopyModflowMfdis {

    public static create() {
        return new FlopyModflowMfdis({
            nlay: 1,
            nrow: 2,
            ncol: 2,
            nper: 1,
            delr: 1.0,
            delc: 1.0,
            laycbd: 0,
            top: 1,
            botm: 0,
            perlen: 1,
            nstp: 1,
            tsmult: 1,
            steady: true,
            itmuni: 4,
            lenuni: 2,
            extension: 'dis',
            unitnumber: null,
            filenames: null,
            xul: null,
            yul: null,
            rotation: 0.0,
            proj4_str: null,
            start_datetime: null
        });
    }

    public static fromObject(obj: IFlopyModflowMfdis) {
        return new FlopyModflowMfdis(obj);
    }

    private readonly _props: IFlopyModflowMfdis;

    constructor(props: IFlopyModflowMfdis) {
        this._props = props;
    }

    public toObject = () => (cloneDeep(this._props));

    get nlay() {
        return this._props.nlay;
    }

    set nlay(value) {
        this._props.nlay = value;
    }

    get nrow() {
        return this._props.nrow;
    }

    set nrow(value) {
        this._props.nrow = value;
    }

    get ncol() {
        return this._props.ncol;
    }

    set ncol(value) {
        this._props.ncol = value;
    }

    get nper() {
        return this._props.nper;
    }

    set nper(value) {
        this._props.nper = value;
    }

    get delr() {
        return this._props.delr;
    }

    set delr(value) {
        this._props.delr = value;
    }

    get delc() {
        return this._props.delc;
    }

    set delc(value) {
        this._props.delc = value;
    }

    get laycbd() {
        return this._props.laycbd;
    }

    set laycbd(value) {
        this._props.laycbd = value;
    }

    get top() {
        return this._props.top;
    }

    set top(value) {
        this._props.top = value;
    }

    get botm() {
        return this._props.botm;
    }

    set botm(value) {
        this._props.botm = value;
    }

    get perlen() {
        return this._props.perlen;
    }

    set perlen(value) {
        this._props.perlen = value;
    }

    get nstp() {
        return this._props.nstp;
    }

    set nstp(value) {
        this._props.nstp = value;
    }

    get tsmult() {
        return this._props.tsmult;
    }

    set tsmult(value) {
        this._props.tsmult = value;
    }

    get steady() {
        return this._props.steady;
    }

    set steady(value) {
        this._props.steady = value;
    }

    get itmuni() {
        return this._props.itmuni;
    }

    set itmuni(value) {
        this._props.itmuni = value;
    }

    get lenuni() {
        return this._props.lenuni;
    }

    set lenuni(value) {
        this._props.lenuni = value;
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

    get xul() {
        return this._props.xul;
    }

    set xul(value) {
        this._props.xul = value;
    }

    get yul() {
        return this._props.yul;
    }

    set yul(value) {
        this._props.yul = value;
    }

    get rotation() {
        return this._props.rotation;
    }

    set rotation(value) {
        this._props.rotation = value;
    }

    get proj4_str() {
        return this._props.proj4_str;
    }

    set proj4_str(value) {
        this._props.proj4_str = value;
    }

    get start_datetime() {
        return this._props.start_datetime;
    }

    set start_datetime(value) {
        this._props.start_datetime = value;
    }
}
