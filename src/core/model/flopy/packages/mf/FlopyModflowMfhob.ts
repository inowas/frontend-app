import {BoundaryCollection, HeadObservationWell} from '../../../modflow/boundaries';
import Stressperiods from '../../../modflow/Stressperiods';
import {IPropertyValueObject} from '../../../types';
import {calculateHeadObservationData} from '../../helpers';
import FlopyModflowBoundary from './FlopyModflowBoundary';
import FlopyModflowFlowPackage from './FlopyModflowFlowPackage';
import {FlopyModflow} from './index';

export interface IFlopyModflowMfhob {
    iuhobsv: number;
    hobdry: number;
    tomulth: number;
    obs_data: IObsData[] | null;
}

export interface IObsData {
    layer: number;
    row: number;
    column: number;
    time_series_data: Array<[number, number]>;
}

export const defaults: IFlopyModflowMfhob = {
    iuhobsv: 1051,
    hobdry: 0,
    tomulth: 1.0,
    obs_data: null
};

export default class FlopyModflowMfhob extends FlopyModflowBoundary<IFlopyModflowMfhob> {

    public static create(model: FlopyModflow, obj = {}) {
        const self = this.fromObject(obj);
        model.setPackage(self);
        return self;
    }

    public static fromObject(obj: IPropertyValueObject) {
        const d: any = FlopyModflowFlowPackage.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                return d[key] = obj[key];
            }
        }

        return new this(d);
    }

    public static calculateSpData = (boundaries: BoundaryCollection, stressperiods: Stressperiods) => {
        const bd = boundaries.all.filter((b) => (b instanceof HeadObservationWell)) as HeadObservationWell[];
        if (boundaries.length === 0) {
            return null;
        }

        return calculateHeadObservationData(bd, stressperiods);
    };

    get iuhobsv() {
        return this._props.iuhobsv;
    }

    set iuhobsv(value) {
        this._props.iuhobsv = value;
    }

    get hobdry() {
        return this._props.hobdry;
    }

    set hobdry(value) {
        this._props.hobdry = value;
    }

    get tomulth() {
        return this._props.tomulth;
    }

    set tomulth(value) {
        this._props.tomulth = value;
    }

    get obs_data() {
        return this._props.obs_data;
    }

    set obs_data(value) {
        this._props.obs_data = value;
    }
}
