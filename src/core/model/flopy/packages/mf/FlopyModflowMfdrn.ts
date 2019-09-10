import {cloneDeep} from 'lodash';
import {Boundary, ConstantHeadBoundary} from '../../../modflow/boundaries';
import {arrayToObject} from '../helpers';
import FlopyModflowLineBoundary from './FlopyModflowLineBoundary';
import {IFlopyModflowMfdrn} from './FlopyModflowMfdrn.type';

export default class FlopyModflowMfdrn {

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
        if (Array.isArray(value)) {
            value = arrayToObject(value);
        }
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

    public static create() {
        return new FlopyModflowMfdrn({
            ipakcb: null,
            stress_period_data: null,
            dtype: null,
            extension: 'drn',
            unitnumber: null,
            options: null,
            filenames: null
        });
    }

    public static fromObject(obj: IFlopyModflowMfdrn) {
        return new FlopyModflowMfdrn(obj);
    }

    public static calculateSpData = (boundaries: Boundary[], nper: number) => {

        boundaries = boundaries.filter((boundary) => (boundary instanceof ConstantHeadBoundary));
        if (boundaries.length === 0) {
            return null;
        }

        return FlopyModflowLineBoundary.calculateSpData(boundaries, nper);
    };

    private readonly _props: IFlopyModflowMfdrn;

    constructor(props: IFlopyModflowMfdrn) {
        this._props = props;
    }

    public toObject = () => (cloneDeep(this._props));
}
