import FlopyMt3dPackage from './FlopyMt3dPackage';
import SubstanceCollection from '../../../modflow/transport/SubstanceCollection';
import {Boundary, BoundaryCollection} from '../../../modflow';

const itypes = {
    'CHD': 1,
    'BAS6': 1,
    'PBC': 1,
    'WEL': 2,
    'DRN': 3,
    'RIV': 4,
    'GHB': 5,
    'MAS': 15,
    'CC': -1
};

class FlopyMt3dMtssm extends FlopyMt3dPackage {
    // SET stress_period_data
    // ssm_data[0] = [
    //      [#lay, #row, #col, #value1, #itype, #value1, #value2)]
    //      [4, 4, 4, 1.0, itype['GHB'], 1.0, 100.0)]
    // ]
    _crch = null;
    _cevt = null;
    _mxss = null;
    _stress_period_data = null;
    _dtype = null;
    _extension = 'ssm';
    _unitnumber = null;
    _filenames = null;

    static calculateSpData(substances, boundaries) {

        if (!(substances instanceof SubstanceCollection)) {
            throw new Error('Expecting instance of SubstanceCollection')
        }

        if (!(boundaries instanceof BoundaryCollection)) {
            throw new Error('Expecting instance of BoundaryCollection')
        }

        if (substances.length === 0) {
            return null;
        }

        let spData = [];
        substances.all.forEach((substance, sIdx) => {

            if (sIdx === 1) {
                spData = spData.map(spTs =>
                    spTs.map(sp => {
                        sp[5] = sp[3];
                        return sp;
                    })
                )
            }

            if (sIdx > 0) {
                spData = spData.map(spTs =>
                    spTs.map(sp => {
                        sp.push(0);
                        return sp;
                    })
                )
            }

            substance.boundaryConcentrations.forEach(bc => {
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
                const iType = itypes[boundary.type.toUpperCase()];

                if (null === iType) {
                    return;
                }

                concentration.forEach((conc, cIdx) => {
                    if (!(Array.isArray(spData[cIdx]))) {
                        spData[cIdx] = [];
                    }
                    layers.forEach(l => {
                        cells.forEach(c => {
                            if (sIdx === 0) {
                                spData[cIdx].push([l, c[1], c[0], conc, iType])
                            }

                            if (sIdx > 0) {
                                const data = [l, c[1], c[0], 0, iType, 0];
                                for (let i = 1; i < sIdx; i++) {
                                    data.push(0);
                                }
                                data.push(conc);
                                spData[cIdx].push(data)
                            }
                        });
                    })
                })
            });
        });

        return FlopyMt3dMtssm.arrayToObject(spData);
    }

    static arrayToObject = (array) => {
        const obj = {};
        array.forEach((item, idx) => {
            obj[idx] = item;
        });
        return obj;
    };

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
}

export default FlopyMt3dMtssm;
