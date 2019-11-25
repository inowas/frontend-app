import {IPropertyValueObject} from '../../../types';
import FlopyModflow from './FlopyModflow';
import FlopyModflowPackage from './FlopyModflowPackage';
import FlopyModflowSolverPackage from './FlopyModflowSolverPackage';

export interface IFlopyModflowMfsor {
    mxiter: number;
    accl: number;
    hclose: number;
    iprsor: number;
    extension: string;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopyModflowMfsor = {
    mxiter: 200,
    accl: 1,
    hclose: 1e-05,
    iprsor: 0,
    extension: 'sor',
    unitnumber: null,
    filenames: null
};

export default class FlopyModflowMfsor extends FlopyModflowSolverPackage<IFlopyModflowMfsor> {

    public static create(model: FlopyModflow, obj = {}) {
        const self = this.fromObject(obj);
        model.setPackage(self);
        return self;
    }

    public static fromDefault() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopyModflowMfsor {
        const d: any = FlopyModflowPackage.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                return d[key] = obj[key];
            }
        }

        return new this(d);
    }

    get mxiter() {
        return this._props.mxiter;
    }

    set mxiter(value) {
        this._props.mxiter = value;
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

    get iprsor() {
        return this._props.iprsor;
    }

    set iprsor(value) {
        this._props.iprsor = value;
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
