import {IPropertyValueObject} from '../../../types';
import FlopyModflowPackage from './FlopyModflowPackage';

export interface IFlopyModflowMflmt {
    output_file_name: string;
    output_file_unit: number;
    output_file_header: string;
    output_file_format: string;
    extension: string;
    package_flows: string[];
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopyModflowMflmt = {
    output_file_name: 'mt3d_link.ftl',
    output_file_unit: 54,
    output_file_header: 'extended',
    output_file_format: 'unformatted',
    extension: 'lmt6',
    package_flows: [],
    unitnumber: null,
    filenames: null,
};

export default class FlopyModflowMflmt extends FlopyModflowPackage<IFlopyModflowMflmt> {

    public static create(obj = {}) {
        return this.fromObject(obj);
    }

    public static fromDefault() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopyModflowMflmt {
        const d: any = FlopyModflowPackage.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                return d[key] = obj[key];
            }
        }

        return new this(d);
    }

    get output_file_name() {
        return this._props.output_file_name;
    }

    set output_file_name(value) {
        this._props.output_file_name = value;
    }

    get output_file_unit() {
        return this._props.output_file_unit;
    }

    set output_file_unit(value) {
        this._props.output_file_unit = value;
    }

    get output_file_header() {
        return this._props.output_file_header;
    }

    set output_file_header(value) {
        this._props.output_file_header = value;
    }

    get output_file_format() {
        return this._props.output_file_format;
    }

    set output_file_format(value) {
        this._props.output_file_format = value;
    }

    get extension() {
        return this._props.extension;
    }

    set extension(value) {
        this._props.extension = value;
    }

    get package_flows() {
        return this._props.package_flows;
    }

    set package_flows(value) {
        this._props.package_flows = value;
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
