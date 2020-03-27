import {IPropertyValueObject} from '../../../types';
import FlopyMt3dPackage from './FlopyMt3dPackage';

export interface IFlopyMt3dMtrct {
    isothm: number;
    ireact: number;
    igetsc: number;
    rhob: any;
    prsity2: any;
    srconc: any;
    sp1: any;
    sp2: any;
    rc1: any;
    rc2: any;
    extension: string;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopyMt3dMtrct = {
    isothm: 0,
    ireact: 0,
    igetsc: 0,
    rhob: null,
    prsity2: null,
    srconc: null,
    sp1: null,
    sp2: null,
    rc1: null,
    rc2: null,
    extension: 'rct',
    unitnumber: null,
    filenames: null,
};

class FlopyMt3dMtrct extends FlopyMt3dPackage<IFlopyMt3dMtrct> {

    public static create(obj = {}) {
        return this.fromObject(obj);
    }

    public static fromDefault() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopyMt3dMtrct {
        const d: any = FlopyMt3dPackage.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                d[key] = obj[key];
            }
        }

        return new this(d);
    }

    get isothm() {
        return this._props.isothm;
    }

    set isothm(value) {
        this._props.isothm = value;
    }

    get ireact() {
        return this._props.ireact;
    }

    set ireact(value) {
        this._props.ireact = value;
    }

    get igetsc() {
        return this._props.igetsc;
    }

    set igetsc(value) {
        this._props.igetsc = value;
    }

    get rhob() {
        return this._props.rhob;
    }

    set rhob(value) {
        this._props.rhob = value;
    }

    get prsity2() {
        return this._props.prsity2;
    }

    set prsity2(value) {
        this._props.prsity2 = value;
    }

    get srconc() {
        return this._props.srconc;
    }

    set srconc(value) {
        this._props.srconc = value;
    }

    get sp1() {
        return this._props.sp1;
    }

    set sp1(value) {
        this._props.sp1 = value;
    }

    get sp2() {
        return this._props.sp2;
    }

    set sp2(value) {
        this._props.sp2 = value;
    }

    get rc1() {
        return this._props.rc1;
    }

    set rc1(value) {
        this._props.rc1 = value;
    }

    get rc2() {
        return this._props.rc2;
    }

    set rc2(value) {
        this._props.rc2 = value;
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

export default FlopyMt3dMtrct;
