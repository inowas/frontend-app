import {Boundary, BoundaryCollection} from '../../../modflow/boundaries';
import SubstanceCollection from '../../../modflow/transport/SubstanceCollection';
import FlopyMt3dPackage from './FlopyMt3dPackage';

const itypes = {
    CHD: 1,
    BAS6: 1,
    PBC: 1,
    WEL: 2,
    DRN: 3,
    RIV: 4,
    GHB: 5,
    MAS: 15,
    CC: -1
};

class FlopyMt3dMtssm extends FlopyMt3dPackage {

    get crch() {
        return this._crch;
    }

    set crch(value) {
        this._crch = value;
    }

    get cevt() {
        return this._cevt;
    }

    set cevt(value) {
        this._cevt = value;
    }

    get mxss() {
        return this._mxss;
    }

    set mxss(value) {
        this._mxss = value;
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

    public static calculateSpData(substances: SubstanceCollection, boundaries: BoundaryCollection) {

        if (substances.length === 0) {
            return null;
        }

        let spData: any[] = [];
        substances.all.forEach((substance, sIdx) => {

            if (sIdx === 1) {
                spData = spData.map((spTs) =>
                    spTs.map((sp: any) => {
                        sp[5] = sp[3];
                        return sp;
                    })
                );
            }

            if (sIdx > 0) {
                spData = spData.map((spTs) =>
                    spTs.map((sp: any) => {
                        sp.push(0);
                        return sp;
                    })
                );
            }

            substance.boundaryConcentrations.forEach((bc) => {
                const boundaryId = bc.id;
                let concentration = bc.concentrations;
                if (!Array.isArray(concentration)) {
                    concentration = [concentration];
                }

                const boundary = boundaries.findById(boundaryId);
                if (!(boundary instanceof Boundary)) {
                    return;
                }

                const layers = boundary.layers;
                const cells = boundary.cells;
                // @ts-ignore
                const iType = itypes[boundary.type.toUpperCase()];

                if (null === iType) {
                    return;
                }

                concentration.forEach((conc, cIdx) => {
                    if (!(Array.isArray(spData[cIdx]))) {
                        spData[cIdx] = [];
                    }
                    layers.forEach((l) => {
                        cells.toObject().forEach((c) => {
                            if (sIdx === 0) {
                                spData[cIdx].push([l, c[1], c[0], conc, iType]);
                            }

                            if (sIdx > 0) {
                                const data = [l, c[1], c[0], 0, iType, 0];
                                for (let i = 1; i < sIdx; i++) {
                                    data.push(0);
                                }
                                data.push(conc);
                                spData[cIdx].push(data);
                            }
                        });
                    });
                });
            });
        });

        return FlopyMt3dMtssm.arrayToObject(spData);
    }

    public static arrayToObject = (array: any[]) => {
        const obj: any = {};
        array.forEach((item, idx) => {
            obj[idx] = item;
        });
        return obj;
    };
    // SET stress_period_data
    // ssm_data[0] = [
    //      [#lay, #row, #col, #value1, #itype, #value1, #value2)]
    //      [4, 4, 4, 1.0, itype['GHB'], 1.0, 100.0)]
    // ]
    public _crch = null;
    public _cevt = null;
    public _mxss = null;
    // tslint:disable-next-line:variable-name
    public _stress_period_data = null;
    public _dtype = null;
    public _extension = 'ssm';
    public _unitnumber = null;
    public _filenames = null;
}

export default FlopyMt3dMtssm;
