import {IPropertyValueObject} from '../../../types';
import FlopyModflowPackage from '../mf/FlopyModflowPackage';
import FlopySeawatPackage from './FlopySeawatPackage';

export interface IFlopySeawatSwtvsc extends IPropertyValueObject {
    mt3dmuflg: number;
    viscmin: number;
    viscmax: number;
    viscref: number;
    nsmueos: number;
    mutempopt: number;
    mtmuspec: number;
    dmudc: number;
    cmuref: number;
    mtmutempspec: number;
    amucoeff: null | number | number[];
    invisc: number;
    visc: number;
    extension: string;
    unitnumer: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopySeawatSwtvsc = {
    mt3dmuflg: -1,
    viscmin: 0.0,
    viscmax: 0.0,
    viscref: 0.0008904,
    nsmueos: 0,
    mutempopt: 2,
    mtmuspec: 1,
    dmudc: 1.923e-06,
    cmuref: 0.0,
    mtmutempspec: 1,
    amucoeff: null,
    invisc: -1,
    visc: -1,
    extension: 'vsc',
    unitnumer: null,
    filenames: null
};

export default class FlopySeawatSwtvsc extends FlopySeawatPackage<IFlopySeawatSwtvsc> {

    public static create() {
        return this.fromDefaults();
    }

    public static fromDefaults() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopySeawatSwtvsc {
        const d: any = FlopyModflowPackage.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                d[key] = obj[key];
            }
        }

        return new this(d);
    }

    get mt3dmuflg() {
        return this._props.mt3dmuflg;
    }

    set mt3dmuflg(value) {
        this._props.mt3dmuflg = value;
    }

    get viscmin() {
        return this._props.viscmin;
    }

    set viscmin(value) {
        this._props.viscmin = value;
    }

    get viscmax() {
        return this._props.viscmax;
    }

    set viscmax(value) {
        this._props.viscmax = value;
    }

    get viscref() {
        return this._props.viscref;
    }

    set viscref(value) {
        this._props.viscref = value;
    }

    get nsmueos() {
        return this._props.nsmueos;
    }

    set nsmueos(value) {
        this._props.nsmueos = value;
    }

    get mutempopt() {
        return this._props.mutempopt;
    }

    set mutempopt(value) {

        switch (value) {
            case 1:
                this._props.amucoeff = [0, 0, 0, 0];
                break;
            case 2:
                this._props.amucoeff = [0, 0, 0, 0, 0];
                break;
            case 3:
                this._props.amucoeff = [0, 0];
                break;
            default:
                this._props.amucoeff = null;
                break;
        }

        this._props.mutempopt = value;
    }

    get mtmuspec() {
        return this._props.mtmuspec;
    }

    set mtmuspec(value) {
        this._props.mtmuspec = value;
    }

    get dmudc() {
        return this._props.dmudc;
    }

    set dmudc(value) {
        this._props.dmudc = value;
    }

    get cmuref() {
        return this._props.cmuref;
    }

    set cmuref(value) {
        this._props.cmuref = value;
    }

    get mtmutempspec() {
        return this._props.mtmutempspec;
    }

    set mtmutempspec(value) {
        this._props.mtmutempspec = value;
    }

    get amucoeff() {
        return this._props.amucoeff;
    }

    set amucoeff(value) {
        this._props.amucoeff = value;
    }

    get invisc() {
        return this._props.invisc;
    }

    set invisc(value) {
        this._props.invisc = value;
    }

    get visc() {
        return this._props.visc;
    }

    set visc(value) {
        this._props.visc = value;
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
