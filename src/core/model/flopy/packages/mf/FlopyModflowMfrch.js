import FlopyModflowBoundary from './FlopyModflowBoundary';
import {RechargeBoundary} from '../../../modflow/boundaries';

/*
https://modflowpy.github.io/flopydoc/mfrch.html

stress_period_data = {
    0: 0.001,
    1: 0.002,
    4: 0.004
}
 */
export default class FlopyModflowMfrch extends FlopyModflowBoundary {

    _nrchop = 3;
    _ipakcb = 0;
    _rech = 0.001;
    _irch = 0;
    _extension = 'rch';
    _unitnumber = null;
    _filenames = null;

    static calculateSpData = (boundaries, nper, nrow, ncol) => {

        const rechargeBoundaries = boundaries.filter(rch => (rch instanceof RechargeBoundary));
        if (rechargeBoundaries.length === 0) {
            return null;
        }

        let spData = [];
        for (let per = 0; per < nper; per++) {
            spData[per] = [];
            for (let row = 0; row < nrow; row++) {
                spData[per][row] = [];
                for (let col = 0; col < ncol; col++) {
                    spData[per][row][col] = 0;
                }
            }
        }

        rechargeBoundaries.forEach(rch => {
            const cells = rch.cells;
            const spValues = rch.spValues;

            spData.forEach((sp, per) => {
                cells.forEach(cell => {
                    const row = cell[1];
                    const col = cell[0];
                    spData[per][row][col] += spValues[per][0];
                });
            });
        });

        return FlopyModflowMfrch.arrayToObject(spData);
    };

    get nrchop() {
        return this._nrchop;
    }

    set nrchop(value) {
        this._nrchop = value;
    }

    get ipakcb() {
        return this._ipakcb;
    }

    set ipakcb(value) {
        this._ipakcb = value;
    }

    get stress_period_data() {
        return this._rech;
    }

    set stress_period_data(value) {
        if (Array.isArray(value)) {
            value = FlopyModflowBoundary.arrayToObject(value);
        }
        this._rech = value;
    }

    get rech() {
        return this._rech;
    }

    set rech(value) {
        this._rech = value;
    }

    get irch() {
        return this._irch;
    }

    set irch(value) {
        this._irch = value;
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
