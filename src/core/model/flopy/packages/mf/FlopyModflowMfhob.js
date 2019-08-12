import FlopyModflowBoundary from './FlopyModflowBoundary';
import HeadObservationWell from '../../../modflow/boundaries/HeadObservationWell';
import {Stressperiods} from '../../../modflow';
import {BoundaryCollection} from '../../../modflow/boundaries';

export default class FlopyModflowMfhob extends FlopyModflowBoundary {

    _iuhobsv = 1051;
    _hobdry = 0;
    _tomulth = 1;
    _obs_data = null;

    static calculateObsData = (boundaries, stressperiods) => {

        if (!(stressperiods instanceof Stressperiods)) {
            throw new Error('Expecting instance of Stressperiods')
        }

        if (!(boundaries instanceof BoundaryCollection)) {
            throw new Error('Expecting instance of BoundaryCollection')
        }

        const totims = stressperiods.totims;

        const hobs = boundaries.all.filter(well => (well instanceof HeadObservationWell));
        if (hobs.length === 0) {
            return null;
        }

        return hobs.map(well => {
            const layer = well.layers[0];
            const cell = well.cells[0];
            const time_series_data = well.spValues.map((spValue, idx) => ([
                totims[idx], spValue[0]
            ]));

            return {
                layer,
                row: cell[1],
                column: cell[0],
                time_series_data
            };
        });
    };

    get iuhobsv() {
        return this._iuhobsv;
    }

    set iuhobsv(value) {
        value = parseInt(value);
        this._iuhobsv = value;
    }

    get hobdry() {
        return this._hobdry;
    }

    set hobdry(value) {
        value = parseInt(value);
        this._hobdry = value;
    }

    get tomulth() {
        return this._tomulth;
    }

    set tomulth(value) {
        value = parseFloat(value);
        this._tomulth = value;
    }

    get obs_data() {
        return this._obs_data;
    }

    set obs_data(value) {
        this._obs_data = value;
    }
}
