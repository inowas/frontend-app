import EvapotranspirationBoundary from "../../../modflow/boundaries/EvapotranspirationBoundary";
import FlopyModflowBoundary from "./FlopyModflowBoundary";

export default class FlopyModflowMfevt extends FlopyModflowBoundary {

    _nevtop = 3;
    _ipakcb = 0;
    _stress_period_data = 0.001;
    _irch = 0;
    _extension = 'rch';
    _unitnumber = null;
    _filenames = null;

    static calculateSpData = (boundaries, nper, nrow, ncol) => {

        const evapotranspirationBoundaries = boundaries.filter(rch => (rch instanceof EvapotranspirationBoundary));
        if (evapotranspirationBoundaries.length === 0) {
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

        evapotranspirationBoundaries.forEach(rch => {
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

        return FlopyModflowMfevt.arrayToObject(spData);
    };

    get nevtop() {
        return this._nevtop;
    }

    set nevtop(value) {
        this._nevtop = value;
    }

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
