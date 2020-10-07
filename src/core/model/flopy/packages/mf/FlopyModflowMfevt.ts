import {Array2D} from '../../../geometry/Array2D.type';
import GridSize from '../../../geometry/GridSize';
import {BoundaryCollection, EvapotranspirationBoundary} from '../../../modflow/boundaries';
import Stressperiods from '../../../modflow/Stressperiods';
import {IPropertyValueObject} from '../../../types';
import {calculateEvapotranspirationSpData} from '../../helpers';
import {IStressPeriodData} from './FlopyModflow.type';
import FlopyModflowBoundary from './FlopyModflowBoundary';
import FlopyModflowFlowPackage from './FlopyModflowFlowPackage';

export interface IFlopyModflowMfevt {
    nevtop: number;
    ipakcb: number | null;
    surf: number | IStressPeriodData<number> | IStressPeriodData<Array2D<number>>;
    evtr: number | IStressPeriodData<number> | IStressPeriodData<Array2D<number>>;
    exdp: number | IStressPeriodData<number> | IStressPeriodData<Array2D<number>>;
    ievt: number | IStressPeriodData<number> | IStressPeriodData<Array2D<number>>;
    extension: string;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopyModflowMfevt = {
    nevtop: 3,
    ipakcb: null,
    surf: 0.0,
    evtr: 0.001,
    exdp: 1.0,
    ievt: 1,
    extension: 'evt',
    unitnumber: null,
    filenames: null
};

export default class FlopyModflowMfevt extends FlopyModflowBoundary<IFlopyModflowMfevt> {

    public static create(boundaries: BoundaryCollection, stressperiods: Stressperiods, gridSize: GridSize) {
        return this.fromDefault().update(boundaries, stressperiods, gridSize.nY, gridSize.nX);
    }

    public static fromDefault() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopyModflowMfevt {
        const d: any = FlopyModflowFlowPackage.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                d[key] = obj[key];
            }
        }

        return new this(d);
    }

    public update = (boundaries: BoundaryCollection, stressperiods: Stressperiods, nrow: number, ncol: number) => {
        const bd = boundaries.all.filter((b) =>
            (b instanceof EvapotranspirationBoundary)) as EvapotranspirationBoundary[];
        if (boundaries.length === 0) {
            return null;
        }

        const spData = calculateEvapotranspirationSpData(bd, stressperiods, stressperiods.count, nrow, ncol);
        if (!spData) {
            return null;
        }

        this.stress_period_data = spData;
        return this;
    };

    get nevtop() {
        return this._props.nevtop;
    }

    set nevtop(value) {
        this._props.nevtop = value;
    }

    get ipakcb() {
        return this._props.ipakcb;
    }

    set ipakcb(value) {
        this._props.ipakcb = value;
    }

    get stress_period_data() {
        return this._props.evtr;
    }

    set stress_period_data(value) {
        this._props.evtr = value;
    }

    get ievt() {
        return this._props.ievt;
    }

    set ievt(value) {
        this._props.ievt = value;
    }

    get evtr() {
        return this._props.evtr;
    }

    set evtr(value) {
        this._props.evtr = value;
    }

    get exdp() {
        return this._props.exdp;
    }

    set exdp(value) {
        this._props.exdp = value;
    }

    get surf() {
        return this._props.surf;
    }

    set surf(value) {
        this._props.surf = value;
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
