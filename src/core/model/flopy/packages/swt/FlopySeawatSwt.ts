import {IPropertyValueObject} from '../../../types';
import FlopyModflowPackage from '../mf/FlopyModflowPackage';
import FlopySeawatPackage from './FlopySeawatPackage';

export interface IFlopySeawatSwt extends IPropertyValueObject {
    modelname: string;
    namefile_ext: string;
    modflowmodel: null | string;
    mt3dmodel: null | string;
    version: string;
    exe_name: string;
    structured: boolean;
    listunit: number;
    model_ws: string;
    external_path: null | string;
    verbose: boolean;
    load: boolean;
    silent: number;
}

export const defaults: IFlopySeawatSwt = {
    modelname: 'seawat-model',
    namefile_ext: 'nam',
    modflowmodel: null,
    mt3dmodel: null,
    version: 'seawat',
    exe_name: 'swtv4',
    structured: true,
    listunit: 2,
    model_ws: '.',
    external_path: null,
    verbose: false,
    load: true,
    silent: 0
};

class FlopySeawatSwt extends FlopySeawatPackage<IFlopySeawatSwt> {
    public static create() {
        return this.fromDefaults();
    }

    public static fromDefaults() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopySeawatSwt {
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

    get modflowmodel() {
        return this._props.modflowmodel;
    }

    set modflowmodel(value) {
        this._props.modflowmodel = value;
    }

    get mt3dmodel() {
        return this._props.mt3dmodel;
    }

    set mt3dmodel(value) {
        this._props.mt3dmodel = value;
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

    get load() {
        return this._props.load;
    }

    set load(value) {
        this._props.load = value;
    }

    get silent() {
        return this._props.silent;
    }

    set silent(value) {
        this._props.silent = value;
    }
}

export default FlopySeawatSwt;
