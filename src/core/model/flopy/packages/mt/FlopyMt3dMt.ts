import {IPropertyValueObject} from '../../../types';
import FlopyMt3dPackage from './FlopyMt3dPackage';

export interface IFlopyMt3dMt extends IPropertyValueObject {
    modelname: string;
    namefile_ext: string;
    exe_name: string;
    model_ws: string;
    ftlfilename: string;
    version: string;
    verbose: boolean;
}

export const defaults: IFlopyMt3dMt = {
    modelname: 'mt3d-model',
    namefile_ext: 'nam',
    exe_name: 'mt3dms',
    model_ws: '.',
    ftlfilename: 'mt3d_link.ftl',
    version: 'mt3dms',
    verbose: false,
};

class FlopyMt3dMt extends FlopyMt3dPackage<IFlopyMt3dMt> {

    public static create(obj = {}) {
        return this.fromObject(obj);
    }

    public static fromDefault() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopyMt3dMt {
        const d: any = FlopyMt3dPackage.cloneDeep(defaults);
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

    get exe_name() {
        return this._props.exe_name;
    }

    set exe_name(value) {
        this._props.exe_name = value;
    }

    get model_ws() {
        return this._props.model_ws;
    }

    set model_ws(value) {
        this._props.model_ws = value;
    }

    get ftlfilename() {
        return this._props.ftlfilename;
    }

    set ftlfilename(value) {
        this._props.ftlfilename = value;
    }

    get version() {
        return this._props.version;
    }

    set version(value) {
        this._props.version = value;
    }

    get verbose() {
        return this._props.verbose;
    }

    set verbose(value) {
        this._props.verbose = value;
    }
}

export default FlopyMt3dMt;
