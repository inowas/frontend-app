import {ConstantHeadBoundary} from '../../../modflow/boundaries';
import FlopyModflowLineBoundary from './FlopyModflowLineBoundary';
import FlopyModflowBoundary from './FlopyModflowBoundary';

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
export default class FlopyModflowMfchd extends FlopyModflowLineBoundary {

    _stress_period_data = null;
    _dtype = null;
    _options = null;
    _extension = 'chd';
    _unitnumber = null;
    _filenames = null;

    static calculateSpData = (boundaries, nper) => {

        boundaries = boundaries.filter(boundary => (boundary instanceof ConstantHeadBoundary));
        if (boundaries.length === 0) {
            return null;
        }

        return FlopyModflowLineBoundary.calculateSpData(boundaries, nper);
    };

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

    get options() {
        return this._options;
    }

    set options(value) {
        this._options = value;
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

    get filenames() {
        return this._filenames;
    }

    set filenames(value) {
        this._filenames = value;
    }
}
