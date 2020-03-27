import {IPropertyValueObject} from '../../../types';
import FlopyMt3dPackage from './FlopyMt3dPackage';

export interface IFlopyMt3dMtdsp {
    al: number;
    trpt: number;
    trpv: number;
    dmcoef: number;
    extension: string;
    multiDiff: boolean;
    unitnumber: number | null;
    filenames: string | null;
}

export const defaults: IFlopyMt3dMtdsp = {
    al: 0.01,
    trpt: 0.1,
    trpv: 0.01,
    dmcoef: 1e-9,
    extension: 'dsp',
    multiDiff: false,
    unitnumber: null,
    filenames: null
};

class FlopyMt3dMtdsp extends FlopyMt3dPackage<IFlopyMt3dMtdsp> {

    public static create(obj = {}) {
        return this.fromObject(obj);
    }

    public static fromDefault() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopyMt3dMtdsp {
        const d: any = FlopyMt3dPackage.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                d[key] = obj[key];
            }
        }

        return new this(d);
    }

    get al() {
        return this._props.al;
    }

    set al(value) {
        this._props.al = value;
    }

    get trpt() {
        return this._props.trpt;
    }

    set trpt(value) {
        this._props.trpt = value;
    }

    get trpv() {
        return this._props.trpv;
    }

    set trpv(value) {
        this._props.trpv = value;
    }

    get dmcoef() {
        return this._props.dmcoef;
    }

    set dmcoef(value) {
        this._props.dmcoef = value;
    }

    get extension() {
        return this._props.extension;
    }

    set extension(value) {
        this._props.extension = value;
    }

    get multiDiff() {
        return this._props.multiDiff;
    }

    set multiDiff(value) {
        this._props.multiDiff = value;
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

export default FlopyMt3dMtdsp;
