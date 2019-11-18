import {Array2D} from '../../../geometry/Array2D.type';
import {IPropertyValueObject} from '../../../types';
import {FlopyModflow, FlopyModflowPackage} from './index';

export interface IFlopyModflowMfbas {
    ibound: number | Array2D<number>;
    strt: number | Array2D<number>;
    ifrefm: boolean;
    ixsec: boolean;
    ichflg: boolean;
    stoper: number | null;
    hnoflo: number;
    extension: string;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopyModflowMfbas = {
    ibound: 1,
    strt: 1,
    ifrefm: true,
    ixsec: false,
    ichflg: false,
    stoper: null,
    hnoflo: -999.99,
    extension: 'bas',
    unitnumber: null,
    filenames: null
};

export default class FlopyModflowMfbas extends FlopyModflowPackage<IFlopyModflowMfbas> {

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

    protected _props = {...defaults};

    get ibound() {
        return this._props.ibound;
    }

    set ibound(value) {
        this._props.ibound = value;
    }

    get strt() {
        return this._props.strt;
    }

    set strt(value) {
        this._props.strt = value;
    }

    get ifrefm() {
        return this._props.ifrefm;
    }

    set ifrefm(value) {
        this._props.ifrefm = value;
    }

    get ixsec() {
        return this._props.ixsec;
    }

    set ixsec(value) {
        this._props.ixsec = value;
    }

    get ichflg() {
        return this._props.ichflg;
    }

    set ichflg(value) {
        this._props.ichflg = value;
    }

    get stoper() {
        return this._props.stoper;
    }

    set stoper(value) {
        this._props.stoper = value;
    }

    get hnoflo() {
        return this._props.hnoflo;
    }

    set hnoflo(value) {
        this._props.hnoflo = value;
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
