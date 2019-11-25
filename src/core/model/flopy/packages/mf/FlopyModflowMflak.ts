import {Array3D} from '../../../geometry/Array2D.type';
import BoundaryCollection from '../../../modflow/boundaries/BoundaryCollection';
import Stressperiods from '../../../modflow/Stressperiods';
import {IPropertyValueObject} from '../../../types';
import {IStressPeriodData} from './FlopyModflow.type';
import FlopyModflowBoundary from './FlopyModflowBoundary';
import FlopyModflowPackage from './FlopyModflowPackage';

export interface IFlopyModflowMflak {
    nlakes: number;
    ipakcb: number | null;
    theta: number;
    nssitr: number;
    sscncr: number;
    surfdep: number;
    stages: number | number[];
    stage_range: Array<[number, number]> | null;
    lakarr: Array3D<number> | null;
    bdlknc: Array3D<number> | null;
    sill_data: IStressPeriodData<Array<[[number, number], number]>> | null;
    flux_data: IStressPeriodData<[[number, number, number, number, number, number]]> | null;
    extension: string;
    unitnumber: number | null;
    filenames: null | string | string[];
    options: string[] | null;
}

export const defaults: IFlopyModflowMflak = {
    nlakes: 1,
    ipakcb: null,
    theta: -1.0,
    nssitr: 0,
    sscncr: 0.0,
    surfdep: 0.0,
    stages: 1.0,
    stage_range: null,
    lakarr: null,
    bdlknc: null,
    sill_data: null,
    flux_data: null,
    extension: 'lak',
    unitnumber: null,
    filenames: null,
    options: null
};

export default class FlopyModflowMflak extends FlopyModflowBoundary<IFlopyModflowMflak> {

    public static create(boundaries: BoundaryCollection, stressPeriods: Stressperiods) {
        return this.fromDefault().update(boundaries, stressPeriods);
    }

    public static fromDefault() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopyModflowMflak {
        const d: any = FlopyModflowPackage.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                return d[key] = obj[key];
            }
        }

        return new this(d);
    }

    // TODO
    public update = (boundaries: BoundaryCollection, stressPeriods: Stressperiods) => {
        return this;
    };

    get nlakes() {
        return this._props.nlakes;
    }

    set nlakes(value) {
        this._props.nlakes = value;
    }

    get ipakcb() {
        return this._props.ipakcb;
    }

    set ipakcb(value) {
        this._props.ipakcb = value;
    }

    get theta() {
        return this._props.theta;
    }

    set theta(value) {
        this._props.theta = value;
    }

    get nssitr() {
        return this._props.nssitr;
    }

    set nssitr(value) {
        this._props.nssitr = value;
    }

    get sscncr() {
        return this._props.sscncr;
    }

    set sscncr(value) {
        this._props.sscncr = value;
    }

    get surfdep() {
        return this._props.surfdep;
    }

    set surfdep(value) {
        this._props.surfdep = value;
    }

    get stages() {
        return this._props.stages;
    }

    set stages(value) {
        this._props.stages = value;
    }

    get stage_range() {
        return this._props.stage_range;
    }

    set stage_range(value) {
        this._props.stage_range = value;
    }

    get lakarr() {
        return this._props.lakarr;
    }

    set lakarr(value) {
        this._props.lakarr = value;
    }

    get bdlknc() {
        return this._props.bdlknc;
    }

    set bdlknc(value) {
        this._props.bdlknc = value;
    }

    get sill_data() {
        return this._props.sill_data;
    }

    set sill_data(value) {
        this._props.sill_data = value;
    }

    get flux_data() {
        return this._props.flux_data;
    }

    set flux_data(value) {
        this._props.flux_data = value;
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

    get options() {
        return this._props.options;
    }

    set options(value) {
        this._props.options = value;
    }
}
