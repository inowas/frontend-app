import {Transport} from '../../../modflow';
import {Boundary, BoundaryCollection} from '../../../modflow/boundaries';
import SubstanceCollection from '../../../modflow/transport/SubstanceCollection';
import {IPropertyValueObject} from '../../../types';
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

export interface IFlopyMt3dMtssm {
    crch: null | any;
    cevt: null | any;
    mxss: null | any;
    stress_period_data: null | any;
    extension: string;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopyMt3dMtssm = {
    crch: null,
    cevt: null,
    mxss: null,

    // SET stress_period_data
    // ssm_data[0] = [
    //      [#lay, #row, #col, #value1, #itype, #value1, #value2)]
    //      [4, 4, 4, 1.0, itype['GHB'], 1.0, 100.0)]
    // ]
    stress_period_data: null,
    extension: 'ssm',
    unitnumber: null,
    filenames: null,
};

class FlopyMt3dMtssm extends FlopyMt3dPackage<IFlopyMt3dMtssm> {

    get crch() {
        return this._props.crch;
    }

    set crch(value) {
        this._props.crch = value;
    }

    get cevt() {
        return this._props.cevt;
    }

    set cevt(value) {
        this._props.cevt = value;
    }

    get mxss() {
        return this._props.mxss;
    }

    set mxss(value) {
        this._props.mxss = value;
    }

    get stress_period_data() {
        return this._props.stress_period_data;
    }

    set stress_period_data(value) {
        this._props.stress_period_data = value;
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

    public static create(transport: Transport, boundaries: BoundaryCollection) {
        return this.fromDefault().update(transport, boundaries);
    }

    public static fromDefault() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopyMt3dMtssm {
        const d: any = FlopyMt3dPackage.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                d[key] = obj[key];
            }
        }

        return new this(d);
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

    public update(transport: Transport, boundaries: BoundaryCollection) {
        this.stress_period_data = FlopyMt3dMtssm.calculateSpData(transport.substances, boundaries);
        return this;
    }
}

export default FlopyMt3dMtssm;
