import {BoundaryCollection, ConstantHeadBoundary} from '../../../modflow/boundaries';
import Stressperiods from '../../../modflow/Stressperiods';
import {IPropertyValueObject} from '../../../types';
import {calculateLineBoundarySpData} from '../../helpers';
import {IStressPeriodData} from './FlopyModflow.type';
import FlopyModflowLineBoundary from './FlopyModflowLineBoundary';
import FlopyModflowPackage from './FlopyModflowPackage';

/*
https://modflowpy.github.io/flopydoc/mfchd.html

stress_period_data =
{0: [
    [lay, row, col, shead, ehead],
    [lay, row, col, shead, ehead],
    [lay, row, col, shead, ehead]
    ],
1:  [
    [lay, row, col, shead, ehead],
    [lay, row, col, shead, ehead],
    [lay, row, col, shead, ehead]
    ], ...
kper:
    [
    [lay, row, col, shead, ehead],
    [lay, row, col, shead, ehead],
    [lay, row, col, shead, ehead]
    ]
}
*/

export interface IFlopyModflowMfchd {
    stress_period_data: IStressPeriodData<[[number, number, number, number, number]]> | null;
    options: null;
    extension: string;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopyModflowMfchd = {
    stress_period_data: null,
    options: null,
    extension: 'chd',
    unitnumber: null,
    filenames: null
};

export default class FlopyModflowMfchd extends FlopyModflowLineBoundary<IFlopyModflowMfchd> {

    public static create(boundaries: BoundaryCollection, stressperiods: Stressperiods) {
        return this.fromDefault().update(boundaries, stressperiods.count);
    }

    public static fromDefault() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopyModflowMfchd {
        const d: any = FlopyModflowPackage.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                d[key] = obj[key];
            }
        }

        return new this(d);
    }

    public update = (boundaries: BoundaryCollection, nper: number) => {
        const bd = boundaries.all.filter((b) => (b instanceof ConstantHeadBoundary)) as ConstantHeadBoundary[];
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

    get stress_period_data() {
        return this._props.stress_period_data;
    }

    set stress_period_data(value) {
        this._props.stress_period_data = value;
    }

    get options() {
        return this._props.options;
    }

    set options(value) {
        this._props.options = value;
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
