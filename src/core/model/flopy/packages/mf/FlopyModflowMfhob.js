import FlopyModflowBoundary from "./FlopyModflowBoundary";
import HeadObservationWell from "../../../modflow/boundaries/HeadObservationWell";

export default class FlopyModflowMfhob extends FlopyModflowBoundary {

    _iuhobsv = null;
    _hobdry = 0;
    _tomulth = 1;
    _obs_data = null;

    static calculateObsData = (boundaries, nper) => {
        const wells = boundaries.filter(well => (well instanceof HeadObservationWell));
        if (wells.length === 0) {
            return null;
        }

        let obs_data = [];
        for (let per = 0; per < nper; per++) {
            obs_data[per] = [];
        }

        obs_data.forEach((sp, idx) => {
            wells.forEach(well => {
                const layer = well.layers[0];
                const cell = well.cells[0];
                const data = [layer, cell[1], cell[0]].concat(well.spValues[idx]);

                let push = true;
                obs_data[idx] = obs_data[idx].map(spd => {
                    if (spd[0] === data[0] && spd[1] === data[1] && spd[2] === data[2]) {
                        push = false;
                        spd[3] = spd[3] + data[3];
                    }
                    return spd;
                });

                if (push) {
                    obs_data[idx].push(data);
                }
            })
        });

        return obs_data;
    };

    get iuhobsv() {
        return this._iuhobsv;
    }

    set iuhobsv(value) {
        this._iuhobsv = value;
    }

    get hobdry() {
        return this._hobdry;
    }

    set hobdry(value) {
        this._hobdry = value;
    }

    get tomulth() {
        return this._tomulth;
    }

    set tomulth(value) {
        this._tomulth = value;
    }

    get obs_data() {
        return this._obs_data;
    }

    set obs_data(value) {
        this._obs_data = value;
    }
}
