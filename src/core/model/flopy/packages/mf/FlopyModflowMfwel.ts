import {WellBoundary} from '../../../modflow/boundaries';
import BoundaryCollection from '../../../modflow/boundaries/BoundaryCollection';
import {IPropertyValueObject} from '../../../types';
import {calculatePointBoundarySpData} from '../../helpers';
import {IStressPeriodData} from './FlopyModflow.type';
import FlopyModflowBoundary from './FlopyModflowBoundary';
import {FlopyModflow} from './index';

/*
https://modflowpy.github.io/flopydoc/mfwel.html

stress_period_data = {
0: [
    [lay, row, col, flux],
    [lay, row, col, flux],
    [lay, row, col, flux]
    ],
1: [
    [lay, row, col, flux],
    [lay, row, col, flux],
    [lay, row, col, flux]
    ]
}
 */

export interface IFlopyModflowMfwel {
    ipakcb: number | null;
    stress_period_data: IStressPeriodData<[[number, number, number, number]]> | null;
    dtype: null;
    extension: string;
    options: null;
    binary: boolean;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopyModflowMfwel = {
    ipakcb: null,
    stress_period_data: null,
    dtype: null,
    extension: 'wel',
    options: null,
    binary: false,
    unitnumber: null,
    filenames: null
};

export default class FlopyModflowMfwel extends FlopyModflowBoundary<IFlopyModflowMfwel> {

    public static create(model: FlopyModflow, obj = {}) {
        const self = this.fromObject(obj);
        model.setPackage(self);
        return self;
    }

    public static fromObject(obj: IPropertyValueObject) {
        const d: any = FlopyModflowBoundary.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                return d[key] = obj[key];
            }
        }

        return new this(d);
    }

    public static calculateSpData = (boundaries: BoundaryCollection, nper: number) => {
        const bd = boundaries.all.filter((b) => (b instanceof WellBoundary)) as WellBoundary[];
        if (boundaries.length === 0) {
            return null;
        }

        return calculatePointBoundarySpData(bd, nper, true);
    };

    get ipakcb() {
        return this._props.ipakcb;
    }

    set ipakcb(value) {
        this._props.ipakcb = value;
    }

    get stress_period_data() {
        return this._props.stress_period_data;
    }

    set stress_period_data(value) {
        this._props.stress_period_data = value;
    }

    get dtype() {
        return this._props.dtype;
    }

    set dtype(value) {
        this._props.dtype = value;
    }

    get extension() {
        return this._props.extension;
    }

    set extension(value) {
        this._props.extension = value;
    }

    get options() {
        return this._props.options;
    }

    set options(value) {
        this._props.options = value;
    }

    get binary() {
        return this._props.binary;
    }

    set binary(value) {
        this._props.binary = value;
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
