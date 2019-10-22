import FlopyModflowLineBoundary from "./FlopyModflowLineBoundary";
import DrainageBoundary from "../../../modflow/boundaries/DrainageBoundary";
import FlopyModflowBoundary from "./FlopyModflowBoundary";

export default class FlopyModflowMfdrn extends FlopyModflowLineBoundary {

    _ipakcb = null;
    _stress_period_data = null;
    _dtype = null;
    _extension = 'drn';
    _unitnumber = null;
    _options = null;
    _filenames = null;

    static calculateSpData = (boundaries, nper) => {

        boundaries = boundaries.filter(boundary => (boundary instanceof DrainageBoundary));
        if (boundaries.length === 0) {
            return null;
        }

        return FlopyModflowLineBoundary.calculateSpData(boundaries, nper);
    };

    get ipakcb() {
        return this._ipakcb;
    }

    set ipakcb(value) {
        this._ipakcb = value;
    }

    get stress_period_data() {
        return this._stress_period_data;
    }

    set stress_period_data(value) {
        if (Array.isArray(value)) {
            value = FlopyModflowBoundary.arrayToObject(value);
        }
        this._stress_period_data = value;
    }

    get dtype() {
        return this._dtype;
    }

    set dtype(value) {
        this._dtype = value;
    }

    get extension() {
        return this._extension;
    }

    set extension(value) {
        this._extension = value;
    }

    get unitnumber() {
        return this._unitnumber;
    }

    set unitnumber(value) {
        this._unitnumber = value;
    }

    get options() {
        return this._options;
    }

    set options(value) {
        this._options = value;
    }

    get filenames() {
        return this._filenames;
    }

    set filenames(value) {
        this._filenames = value;
    }
}
