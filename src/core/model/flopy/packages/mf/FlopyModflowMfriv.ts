import {BoundaryCollection, RiverBoundary} from '../../../modflow/boundaries';
import Stressperiods from '../../../modflow/Stressperiods';
import {IPropertyValueObject} from '../../../types';
import {calculateLineBoundarySpData} from '../../helpers';
import {IStressPeriodData} from './FlopyModflow.type';
import FlopyModflowLineBoundary from './FlopyModflowLineBoundary';
import FlopyModflowPackage from './FlopyModflowPackage';

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
    options: null;
    extension: string;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopyModflowMfriv = {
    ipakcb: 0,
    stress_period_data: null,
    extension: 'riv',
    options: null,
    unitnumber: null,
    filenames: null
};

export default class FlopyModflowMfriv extends FlopyModflowLineBoundary<IFlopyModflowMfriv> {

    public static create(boundaries: BoundaryCollection, stressperiods: Stressperiods) {
        return this.fromDefault().update(boundaries, stressperiods.count);
    }

    public static fromDefault() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopyModflowMfriv {
        const d: any = FlopyModflowPackage.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                d[key] = obj[key];
            }
        }

        return new this(d);
    }

    public update = (boundaries: BoundaryCollection, nper: number) => {

        const bd = boundaries.all.filter((b) => (b instanceof RiverBoundary)) as RiverBoundary[];
        if (boundaries.length === 0) {
            return null;
        }

        const spData = calculateLineBoundarySpData(bd, nper);
        if (!spData) {
            return null;
        }

        this.stress_period_data = spData;
        return this;
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
