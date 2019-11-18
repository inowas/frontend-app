import {Array2D} from '../../../geometry/Array2D.type';
import {RechargeBoundary} from '../../../modflow/boundaries';
import BoundaryCollection from '../../../modflow/boundaries/BoundaryCollection';
import {IPropertyValueObject} from '../../../types';
import {calculateRechargeSpData} from '../../helpers';
import {IStressPeriodData} from './FlopyModflow.type';
import FlopyModflowBoundary from './FlopyModflowBoundary';
import {FlopyModflow, FlopyModflowPackage} from './index';

/*
https://modflowpy.github.io/flopydoc/mfrch.html

stress_period_data = {
    0: 0.001,
    1: 0.002,
    4: 0.004
}

nrchop:int (default is 3)
is the recharge option code.
    1: Recharge to top grid layer only
    2: Recharge to layer defined in irch
    3: Recharge to highest active cell

irch:int or array of ints (nrow, ncol) (default is 0)
is the layer to which recharge is applied in each vertical column (only used when nrchop=2).
*/

export interface IFlopyModflowMfrch {
    ipakcb: number | null;
    nrchop: number;
    rech: number | IStressPeriodData<number> | IStressPeriodData<Array2D<number>>;
    irch: number | Array2D<number>;
    dtype: null;
    extension: string;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopyModflowMfrch = {
    ipakcb: null,
    nrchop: 3,
    rech: 0.001,
    irch: 0,
    dtype: null,
    extension: 'rch',
    unitnumber: null,
    filenames: null
};

export default class FlopyModflowMfrch extends FlopyModflowBoundary<IFlopyModflowMfrch> {

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

    public static calculateSpData = (boundaries: BoundaryCollection, nper: number, nrow: number, ncol: number) => {
        const bd = boundaries.all.filter((b) => (b instanceof RechargeBoundary)) as RechargeBoundary[];
        if (boundaries.length === 0) {
            return null;
        }
        return calculateRechargeSpData(bd, nper, nrow, ncol);
    };

    public recalculateSpData = (boundaries: BoundaryCollection, nper: number, nrow: number, ncol: number) => {
        const spData = FlopyModflowMfrch.calculateSpData(boundaries, nper, nrow, ncol);
        if (!spData) {
            return null;
        }

        this.rech = spData.spData;
        this.irch = spData.irch;
        return this;
    };

    get nrchop() {
        return this._props.nrchop;
    }

    set nrchop(value) {
        this._props.nrchop = value;
    }

    get ipakcb() {
        return this._props.ipakcb;
    }

    set ipakcb(value) {
        this._props.ipakcb = value;
    }

    get stress_period_data() {
        return this._props.rech;
    }

    set stress_period_data(value) {
        this._props.rech = value;
    }

    get rech() {
        return this._props.rech;
    }

    set rech(value) {
        this._props.rech = value;
    }

    get irch() {
        return this._props.irch;
    }

    set irch(value) {
        this._props.irch = value;
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
