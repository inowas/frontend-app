import { cloneDeep } from 'lodash';
import {IFlopyModflowMfde4} from './FlopyModflowMfde4.type';

export default class FlopyModflowMfde4 {

    get itmx() {
        return this._props.itmx;
    }

    set itmx(value) {
        this._props.itmx = value;
    }

    get mxup() {
        return this._props.mxup;
    }

    set mxup(value) {
        this._props.mxup = value;
    }

    get mxlow() {
        return this._props.mxlow;
    }

    set mxlow(value) {
        this._props.mxlow = value;
    }

    get mxbw() {
        return this._props.mxbw;
    }

    set mxbw(value) {
        this._props.mxbw = value;
    }

    get ifreq() {
        return this._props.ifreq;
    }

    set ifreq(value) {
        this._props.ifreq = value;
    }

    get mutd4() {
        return this._props.mutd4;
    }

    set mutd4(value) {
        this._props.mutd4 = value;
    }

    get accl() {
        return this._props.accl;
    }

    set accl(value) {
        this._props.accl = value;
    }

    get hclose() {
        return this._props.hclose;
    }

    set hclose(value) {
        this._props.hclose = value;
    }

    get iprd4() {
        return this._props.iprd4;
    }

    set iprd4(value) {
        this._props.iprd4 = value;
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
        return new FlopyModflowMfde4({
            itmx: 50,
            mxup: 0,
            mxlow: 0,
            mxbw: 0,
            ifreq: 3,
            mutd4: 0,
            accl: 1.0,
            hclose: 1e-05,
            iprd4: 1,
            extension: 'de4',
            unitnumber: null,
            filenames: null
        });
    }

    public static fromObject(obj: IFlopyModflowMfde4) {
        return new FlopyModflowMfde4(obj);
    }

    private readonly _props: IFlopyModflowMfde4;

    constructor(props: IFlopyModflowMfde4) {
        this._props = props;
    }

    public toObject = () => (cloneDeep(this._props));
}
