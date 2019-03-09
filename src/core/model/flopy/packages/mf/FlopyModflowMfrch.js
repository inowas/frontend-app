import FlopyModflowBoundary from './FlopyModflowBoundary';
import Stressperiods from '../../../modflow/Stressperiods';
import {RechargeBoundary} from '../../../modflow/boundaries';

/*
https://modflowpy.github.io/flopydoc/mfrch.html

rech = {
    0: 0.001,
    1: 0.002,
    4: 0.004
}
 */
export default class FlopyModflowMfrch extends FlopyModflowBoundary {

    _nrchop = 3;
    _ipakcb = null;
    _rech = 0.001;
    _irch = 0;
    _extension = 'rch';
    _unitnumber = null;
    _filenames = null;

    calculateSpData = (boundaries, stressperiods) => {
        if (!(stressperiods instanceof Stressperiods)) {
            throw new Error('Stressperiods has to be instance of Stressperiods');
        }

        const recharges = boundaries.filter(well => (well instanceof RechargeBoundary));
        if (recharges.length === 0) {
            return this._stress_period_data = null;
        }

        let spData = [];
        stressperiods.stressperiods.forEach(() => {
            spData.push([]);
        });

        stressperiods.stressperiods.forEach((sp, idx) => {
            recharges.forEach(well => {
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
