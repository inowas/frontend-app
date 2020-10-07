import {BoundaryCollection, DrainageBoundary} from '../../../modflow/boundaries';
import Stressperiods from '../../../modflow/Stressperiods';
import {IPropertyValueObject} from '../../../types';
import {calculateLineBoundarySpData} from '../../helpers';
import {IStressPeriodData} from './FlopyModflow.type';
import FlopyModflowFlowPackage from './FlopyModflowFlowPackage';
import FlopyModflowLineBoundary from './FlopyModflowLineBoundary';

/*
https://modflowpy.github.io/flopydoc/mfdrn.html

stress_period_data =
{0: [
    [lay, row, col, stage, cond],
    [lay, row, col, stage, cond],
    [lay, row, col, stage, cond],
    ],
1:  [
    [lay, row, col, stage, cond],
    [lay, row, col, stage, cond],
    [lay, row, col, stage, cond],
    ], ...
kper:
    [
    [lay, row, col, stage, cond],
    [lay, row, col, stage, cond],
    [lay, row, col, stage, cond],
    ]
}
*/

export interface IFlopyModflowMfdrn {
    ipakcb: number | null;
    stress_period_data: IStressPeriodData<[[number, number, number, number, number]]> | null;
    options: null;
    extension: string;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopyModflowMfdrn = {
    ipakcb: null,
    stress_period_data: null,
    options: null,
    extension: 'drn',
    unitnumber: null,
    filenames: null
};

export default class FlopyModflowMfdrn extends FlopyModflowLineBoundary<IFlopyModflowMfdrn> {

    public static create(boundaries: BoundaryCollection, stressperiods: Stressperiods) {
        return this.fromDefault().update(boundaries, stressperiods);
    }

    public static fromDefault() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopyModflowMfdrn {
        const d: any = FlopyModflowFlowPackage.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                d[key] = obj[key];
            }
        }

        return new this(d);
    }

    public update = (boundaries: BoundaryCollection, stressperiods: Stressperiods) => {
        const bd = boundaries.all.filter((b) => (b instanceof DrainageBoundary)) as DrainageBoundary[];
        if (boundaries.length === 0) {
            return null;
        }

        const spData = calculateLineBoundarySpData(bd, stressperiods);
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

    get unitnumber() {
        return this._props.unitnumber;
    }

    set unitnumber(value) {
        this._props.unitnumber = value;
    }

    get options() {
        return this._props.options;
    }

    set options(value) {
        this._props.options = value;
    }

    get filenames() {
        return this._props.filenames;
    }

    set filenames(value) {
        this._props.filenames = value;
    }
}
