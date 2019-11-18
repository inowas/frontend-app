import {BoundaryCollection, RiverBoundary} from '../../../modflow/boundaries';
import {IPropertyValueObject} from '../../../types';
import {calculateLineBoundarySpData} from '../../helpers';
import {IStressPeriodData} from './FlopyModflow.type';
import {FlopyModflow, FlopyModflowLineBoundary, FlopyModflowPackage} from './index';

/*
https://modflowpy.github.io/flopydoc/mfriv.html

stress_period_data =
{0: [
    [lay, row, col, stage, cond, rbot],
    [lay, row, col, stage, cond, rbot],
    [lay, row, col, stage, cond, rbot]
    ],
1:  [
    [lay, row, col, stage, cond, rbot],
    [lay, row, col, stage, cond, rbot],
    [lay, row, col, stage, cond, rbot]
    ], ...
kper:
    [
    [lay, row, col, stage, cond, rbot],
    [lay, row, col, stage, cond, rbot],
    [lay, row, col, stage, cond, rbot]
    ]
}
 */

export interface IFlopyModflowMfriv {
    ipakcb: number;
    stress_period_data: IStressPeriodData<[[number, number, number, number, number, number]]> | null;
    dtype: null;
    options: null;
    extension: string;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopyModflowMfriv = {
    ipakcb: 0,
    stress_period_data: null,
    dtype: null,
    extension: 'riv',
    options: null,
    unitnumber: null,
    filenames: null
};

export default class FlopyModflowMfriv extends FlopyModflowLineBoundary<IFlopyModflowMfriv> {

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

    public static calculateSpData = (boundaries: BoundaryCollection, nper: number) => {
        const bd = boundaries.all.filter((b) => (b instanceof RiverBoundary)) as RiverBoundary[];
        if (boundaries.length === 0) {
            return null;
        }

        return calculateLineBoundarySpData(bd, nper);
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
