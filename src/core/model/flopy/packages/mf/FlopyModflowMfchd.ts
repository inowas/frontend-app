import {cloneDeep} from 'lodash';
import {Boundary, ConstantHeadBoundary} from '../../../modflow/boundaries';
import {arrayToObject} from '../helpers';
import FlopyModflowLineBoundary from './FlopyModflowLineBoundary';
import {IFlopyModflowMfchd} from './FlopyModflowMfchd.type';

export default class FlopyModflowMfchd {

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

    public static create() {
        return new FlopyModflowMfchd({
            stress_period_data: null,
            dtype: null,
            options: null,
            extension: 'chd',
            unitnumber: null,
            filenames: null
        });
    }

    public static fromObject(obj: IFlopyModflowMfchd) {
        return new FlopyModflowMfchd(obj);
    }

    public static calculateSpData = (boundaries: Boundary[], nper: number) => {

        boundaries = boundaries.filter((boundary) => (boundary instanceof ConstantHeadBoundary));
        if (boundaries.length === 0) {
            return null;
        }

        return FlopyModflowLineBoundary.calculateSpData(boundaries, nper);
    };

    private readonly _props: IFlopyModflowMfchd;

    constructor(props: IFlopyModflowMfchd) {
        this._props = props;
    }

    public toObject = () => (cloneDeep(this._props));

    public supportedModflowVersions = () => [
        {name: 'MODFLOW-2005', executable: 'mf2005', version: 'mf2005', default: true},
    ];
}
