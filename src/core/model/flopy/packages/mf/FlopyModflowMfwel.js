import FlopyModflowPackage from './FlopyModflowPackage';
import {WellBoundary} from '../../../modflow/boundaries';
import Stressperiods from '../../../modflow/Stressperiods';

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

export default class FlopyModflowMfwel extends FlopyModflowPackage {

    _ipakcb = null;
    _stress_period_data = null;
    _dtype = null;
    _extension = 'wel';
    _options = null;
    _binary = false;
    _unitnumber = null;
    _filenames = null;

    _wells = [];

    static createWithWellsAndStressperiods = (model, wells, stressperiods) => {
        const self = FlopyModflowMfwel.create(model);
        wells.forEach(well => {
            if (well instanceof WellBoundary) {
                self._wells.push(well)
            }
        });

        self.calculateSpData(stressperiods);
        return self;
    };

    calculateSpData = (stressperiods) => {
        if (!(stressperiods instanceof Stressperiods)) {
            throw new Error('Stressperiods has to be instance of Stressperiods');
        }

        let spData = [];
        stressperiods.stressperiods.forEach(() => {
            spData.push([]);
        });

        stressperiods.stressperiods.forEach((sp, idx) => {
            this._wells.forEach(well => {
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

        this._stress_period_data = this.arrayToObject(spData);
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
