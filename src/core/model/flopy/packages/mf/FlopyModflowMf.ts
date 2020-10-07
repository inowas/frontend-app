import {IPropertyValueObject} from '../../../types';
import FlopyModflowPackage from './FlopyModflowPackage';

export interface IFlopyModflowMf extends IPropertyValueObject {
    modelname: string;
    namefile_ext: string;
    version: string;
    exe_name: string;
    structured: boolean;
    listunit: number;
    model_ws: string;
    external_path: string | null;
    verbose: boolean;
}

export const defaults: IFlopyModflowMf = {
    modelname: 'modflowtest',
    namefile_ext: 'nam',
    version: 'mf2005',
    exe_name: 'mf2005',
    structured: true,
    listunit: 2,
    model_ws: '.',
    external_path: null,
    verbose: false,
};

export default class FlopyModflowMf extends FlopyModflowPackage<IFlopyModflowMf> {

    public static create(obj = {}) {
        return this.fromObject(obj);
    }

    public static fromDefault() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopyModflowMf {
        const d: any = FlopyModflowPackage.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                d[key] = obj[key];
            }
        }

        return new this(d);
    }

    get modelname() {
        return this._props.modelname;
    }

    set modelname(value) {
        this._props.modelname = value;
    }

    get namefile_ext() {
        return this._props.namefile_ext;
    }

    set namefile_ext(value) {
        this._props.namefile_ext = value;
    }

    get version() {
        return this._props.version;
    }

    set version(value) {
        this._props.version = value;
    }

    get exe_name() {
        return this._props.exe_name;
    }

    set exe_name(value) {
        this._props.exe_name = value;
    }

    get structured() {
        return this._props.structured;
    }

    set structured(value) {
        this._props.structured = value;
    }

    get listunit() {
        return this._props.listunit;
    }

    set listunit(value) {
        this._props.listunit = value;
    }

    get model_ws() {
        return this._props.model_ws;
    }

    set model_ws(value) {
        this._props.model_ws = value;
    }

    get external_path() {
        return this._props.external_path;
    }

    set external_path(value) {
        this._props.external_path = value;
    }

    get verbose() {
        return this._props.verbose;
    }

    set verbose(value) {
        this._props.verbose = value;
    }
}
