import {WellBoundary} from '../../../modflow/boundaries';
import FlopyModflowBoundary from './FlopyModflowBoundary';

/*
https://modflowpy.github.io/flopydoc/mfwel.html

stress_period_data = {
0: [
    [lay, row, col, flux],
    [lay, row, col, flux],
    [lay, row, col, flux]
    ],
1: [
    [lay, row, col, flux],
    [lay, row, col, flux],
    [lay, row, col, flux]
    ]
}
 */

export default class FlopyModflowMfwel extends FlopyModflowBoundary {

    _ipakcb = null;
    _stress_period_data = null;
    _dtype = null;
    _extension = 'wel';
    _options = null;
    _binary = false;
    _unitnumber = null;
    _filenames = null;

    static calculateSpData = (boundaries, nper) => {

        const wells = boundaries.filter(well => (well instanceof WellBoundary));
        if (wells.length === 0) {
            return null;
        }

        let spData = new Array(nper).fill([]);

        spData.forEach((sp, idx) => {
            wells.forEach(well => {
                const layer = well.layers[0];
                const cell = well.cells[0];
                const data = [layer, cell[1], cell[0]].concat(well.spValues[idx]);

                let push = true;
                spData[idx] = spData[idx].map(spd => {
                    if (spd[0] === data[0] && spd[1] === data[1] && spd[2] === data[2]) {
                        push = false;
                        spd[3] = spd[3] + data[3];
                    }
                    return spd;
                });

                if (push) {
                    spData[idx].push(data);
                }
            })
        });

        return FlopyModflowMfwel.arrayToObject(spData);
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

    get options() {
        return this._options;
    }

    set options(value) {
        this._options = value;
    }

    get binary() {
        return this._binary;
    }

    set binary(value) {
        this._binary = value;
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
