import {IPropertyValueObject} from '../../../types';
import FlopyModflowPackage from '../mf/FlopyModflowPackage';
import FlopySeawatPackage from './FlopySeawatPackage';

export interface IFlopySeawatSwtvdf extends IPropertyValueObject {
    mtdnconc: number;
    mfnadvfd: number;
    nswtcpl: number;
    iwtable: number;
    densemin: number;
    densemax: number;
    dnscrit: number;
    denseref: number;
    denseslp: number;
    drhodc: number;
    crhoref: number;
    firstdt: number;
    indense: number;
    dense: number;
    nsrhoeos: number;
    drhodprhd: number;
    prhdref: number;
    extension: string;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopySeawatSwtvdf = {
    mtdnconc: 1,
    mfnadvfd: 1,
    nswtcpl: 1,
    iwtable: 1,
    densemin: 1.0,
    densemax: 1.025,
    dnscrit: 0.01,
    denseref: 1.0,
    denseslp: 0.025,
    drhodc: 0,
    crhoref: 0,
    firstdt: 0.001,
    indense: 1,
    dense: 1.0,
    nsrhoeos: 1,
    drhodprhd: 0.00446,
    prhdref: 0.0,
    extension: 'vdf',
    unitnumber: null,
    filenames: null
};

class FlopySeawatSwtvdf extends FlopySeawatPackage<IFlopySeawatSwtvdf> {

    public static create() {
        return this.fromDefaults();
    }

    public static fromDefaults() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopySeawatSwtvdf {
        const d: any = FlopyModflowPackage.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                d[key] = obj[key];
            }
        }

        return new this(d);
    }

    get mtdnconc() {
        return this._props.mtdnconc;
    }

    set mtdnconc(value) {
        this._props.mtdnconc = value;
    }

    get mfnadvfd() {
        return this._props.mfnadvfd;
    }

    set mfnadvfd(value) {
        this._props.mfnadvfd = value;
    }

    get nswtcpl() {
        return this._props.nswtcpl;
    }

    set nswtcpl(value) {
        this._props.nswtcpl = value;
    }

    get iwtable() {
        return this._props.iwtable;
    }

    set iwtable(value) {
        this._props.iwtable = value;
    }

    get densemin() {
        return this._props.densemin;
    }

    set densemin(value) {
        this._props.densemin = value;
    }

    get densemax() {
        return this._props.densemax;
    }

    set densemax(value) {
        this._props.densemax = value;
    }

    get dnscrit() {
        return this._props.dnscrit;
    }

    set dnscrit(value) {
        this._props.dnscrit = value;
    }

    get denseref() {
        return this._props.denseref;
    }

    set denseref(value) {
        this._props.denseref = value;
    }

    get denseslp() {
        return this._props.denseslp;
    }

    set denseslp(value) {
        this._props.denseslp = value;
    }

    get drhodc() {
        return this._props.drhodc;
    }

    set drhodc(value) {
        this._props.drhodc = value;
    }

    get crhoref() {
        return this._props.crhoref;
    }

    set crhoref(value) {
        this._props.crhoref = value;
    }

    get firstdt() {
        return this._props.firstdt;
    }

    set firstdt(value) {
        this._props.firstdt = value;
    }

    get indense() {
        return this._props.indense;
    }

    set indense(value) {
        this._props.indense = value;
    }

    get dense() {
        return this._props.dense;
    }

    set dense(value) {
        this._props.dense = value;
    }

    get nsrhoeos() {
        return this._props.nsrhoeos;
    }

    set nsrhoeos(value) {
        this._props.nsrhoeos = value;
    }

    get drhodprhd() {
        return this._props.drhodprhd;
    }

    set drhodprhd(value) {
        this._props.drhodprhd = value;
    }

    get prhdref() {
        return this._props.prhdref;
    }

    set prhdref(value) {
        this._props.prhdref = value;
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

export default FlopySeawatSwtvdf;
