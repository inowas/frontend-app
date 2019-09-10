import {cloneDeep} from 'lodash';
import {Boundary} from '../../../modflow/boundaries';
import EvapotranspirationBoundary from '../../../modflow/boundaries/EvapotranspirationBoundary';
import {arrayToObject} from '../helpers';
import {IFlopyModflowMfevt} from './FlopyModflowMfevt.type';

export default class FlopyModflowMfevt {

    get nevtop() {
        return this._props.nevtop;
    }

    set nevtop(value) {
        this._props.nevtop = value;
    }

    get ipakcb() {
        return this._props.ipakcb;
    }

    set ipakcb(value) {
        this._props.ipakcb = value;
    }

    get stress_period_data() {
        return this._props.evtr;
    }

    set stress_period_data(value) {
        if (Array.isArray(value)) {
            value = arrayToObject(value);
        }
        this._props.evtr = value;
    }

    get ievt() {
        return this._props.ievt;
    }

    set ievt(value) {
        this._props.ievt = value;
    }

    get evtr() {
        return this._props.evtr;
    }

    set evtr(value) {
        this._props.evtr = value;
    }

    get exdp() {
        return this._props.exdp;
    }

    set exdp(value) {
        this._props.exdp = value;
    }

    get surf() {
        return this._props.surf;
    }

    set surf(value) {
        this._props.surf = value;
    }

    get extension() {
        return this._props.extension;
    }

    set extension(value) {
        this._props.extension = value;
    }

    get unitnumber() {
        return this._props.unitnumber;
    }

    set unitnumber(value) {
        this._props.unitnumber = value;
    }

    get filenames() {
        return this._props.filenames;
    }

    set filenames(value) {
        this._props.filenames = value;
    }

    public static fromDefaults() {
        return new FlopyModflowMfevt({
            nevtop: 3,
            ipakcb: 0,
            surf: 0.0,
            evtr: 0.001,
            exdp: 1.0,
            ievt: 1,
            extension: 'evt',
            unitnumber: null,
            filenames: null,
        });
    }

    public static fromObject(obj: IFlopyModflowMfevt) {
        return new FlopyModflowMfevt(obj);
    }

    public static calculateSpData = (boundaries: Boundary[], nper: number, nrow: number, ncol: number) => {

        const evapotranspirationBoundaries = boundaries.filter((evt) => (evt instanceof EvapotranspirationBoundary));
        if (evapotranspirationBoundaries.length === 0) {
            return null;
        }

        const layers = Array.from(new Set(
            evapotranspirationBoundaries.map((obj) => obj.layers[0])
        ));

        const evtrData: number[][][] = [];
        for (let per = 0; per < nper; per++) {
            evtrData[per] = [];
            for (let row = 0; row < nrow; row++) {
                evtrData[per][row] = [];
                for (let col = 0; col < ncol; col++) {
                    evtrData[per][row][col] = 0;
                }
            }
        }

        const surfData: number[][][] = [];
        for (let per = 0; per < nper; per++) {
            surfData[per] = [];
            for (let row = 0; row < nrow; row++) {
                surfData[per][row] = [];
                for (let col = 0; col < ncol; col++) {
                    surfData[per][row][col] = 0;
                }
            }
        }

        const exdpData: number[][][] = [];
        for (let per = 0; per < nper; per++) {
            exdpData[per] = [];
            for (let row = 0; row < nrow; row++) {
                exdpData[per][row] = [];
                for (let col = 0; col < ncol; col++) {
                    exdpData[per][row][col] = 0;
                }
            }
        }
        evapotranspirationBoundaries.forEach((evtBoundary) => {
            const cells = evtBoundary.cells.toObject();
            const spValues = evtBoundary.getSpValues();

            if (spValues) {
                for (let per = 0; per < nper; per++) {
                    const [evtr, surf, exdp] = spValues[per];
                    cells.forEach((cell) => {
                        const row = cell[1];
                        const col = cell[0];
                        evtrData[per][row][col] += evtr;
                        surfData[per][row][col] += surf;
                        exdpData[per][row][col] += exdp;
                    });
                }
            }
        });

        return {
            ievt: layers.length > 1 ? layers : layers[0],
            evtr: arrayToObject(evtrData),
            surf: arrayToObject(surfData),
            exdp: arrayToObject(exdpData)
        };
    };

    private readonly _props: IFlopyModflowMfevt;

    constructor(props: IFlopyModflowMfevt) {
        this._props = props;
    }

    public toObject = () => (cloneDeep(this._props));
}
