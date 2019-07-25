import EvapotranspirationBoundary from "../../../modflow/boundaries/EvapotranspirationBoundary";
import FlopyModflowBoundary from "./FlopyModflowBoundary";

export default class FlopyModflowMfevt extends FlopyModflowBoundary {

    _nevtop = 3;
    _ipakcb = null;
    _surf = 0.0;
    _evtr = 0.001;
    _exdp = 1.0;
    _ievt = 1;
    _extension = 'evt';
    _unitnumber = null;
    _filenames = null;

    static calculateSpData = (boundaries, nper, nrow, ncol) => {

        const evapotranspirationBoundaries = boundaries.filter(evt => (evt instanceof EvapotranspirationBoundary));
        if (evapotranspirationBoundaries.length === 0) {
            return null;
        }

        let layers = [...new Set( evapotranspirationBoundaries.map(obj => obj.layers[0]))];

        let evtrData = [];
        for (let per = 0; per < nper; per++) {
            evtrData[per] = [];
            for (let row = 0; row < nrow; row++) {
                evtrData[per][row] = [];
                for (let col = 0; col < ncol; col++) {
                    evtrData[per][row][col] = 0;
                }
            }
        }

        let surfData = [];
        for (let per = 0; per < nper; per++) {
            surfData[per] = [];
            for (let row = 0; row < nrow; row++) {
                surfData[per][row] = [];
                for (let col = 0; col < ncol; col++) {
                    surfData[per][row][col] = 0;
                }
            }
        }

        let exdpData = [];
        for (let per = 0; per < nper; per++) {
            exdpData[per] = [];
            for (let row = 0; row < nrow; row++) {
                exdpData[per][row] = [];
                for (let col = 0; col < ncol; col++) {
                    exdpData[per][row][col] = 0;
                }
            }
        }
        evapotranspirationBoundaries.forEach(evtBoundary => {
            const cells = evtBoundary.cells;
            const spValues = evtBoundary.spValues;

            for (let per = 0; per < nper; per++) {
                const [evtr, surf, exdp] = spValues[per];
                cells.forEach(cell => {
                    const row = cell[1];
                    const col = cell[0];
                    evtrData[per][row][col] += evtr;
                    surfData[per][row][col] += surf;
                    exdpData[per][row][col] += exdp;
                });
            }
        });

        return {
            ievt: layers.length > 1 ? layers : layers[0],
            evtr: FlopyModflowMfevt.arrayToObject(evtrData),
            surf: FlopyModflowMfevt.arrayToObject(surfData),
            exdp: FlopyModflowMfevt.arrayToObject(exdpData)
        };
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
        return this._evtr;
    }

    set stress_period_data(value) {
        if (Array.isArray(value)) {
            value = FlopyModflowBoundary.arrayToObject(value);
        }
        this._evtr = value;
    }

    get ievt() {
        return this._ievt;
    }

    set ievt(value) {
        this._ievt = value;
    }

    get evtr() {
        return this._evtr;
    }

    set evtr(value) {
        this._evtr = value;
    }

    get exdp() {
        return this._exdp;
    }

    set exdp(value) {
        this._exdp = value;
    }

    get surf() {
        return this._surf;
    }

    set surf(value) {
        this._surf = value;
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
