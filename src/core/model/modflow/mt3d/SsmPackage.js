import AbstractMt3dPackage from './AbstractMt3dPackage';
import SsmSubstance from './SsmSubstance';

class SsmPackage extends AbstractMt3dPackage {

    // SET stress_period_data
    // ssm_data[0] = [
    //      [#lay, #row, #col, #value1, #itype, #value1, #value2)]
    //      [4, 4, 4, 1.0, itype['GHB'], 1.0, 100.0)]
    // ]
    _crch = null;
    _cevt = null;
    _mxss = null;
    _stressPeriodData = null;
    _dtype = null;
    _extension = 'ssm';
    _unitnumber = null;
    _filenames = null;

    static fromDefault() {
        return new SsmPackage();
    }

    static fromObject(obj) {
        const ssm = new SsmPackage();
        ssm.metaDataFromObject(obj);
        ssm.crch = obj.crch;
        ssm.cevt = obj.cevt;
        ssm.mxss = obj.mxss;
        ssm.stressPeriodData = obj.stress_period_data;
        ssm.dtype = obj.dtype;
        ssm.extension = obj.extension;
        ssm.unitnumber = obj.unitnumber;
        ssm.filenames = obj.filenames;
        return ssm;
    }

    static get itype() {
        return {
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
    }

    constructor() {
        super('ssm');
        this.substances = [];
    }

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

    get stressPeriodData() {
        return this._stressPeriodData;
    }

    set stressPeriodData(value) {
        this._stressPeriodData = value;
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

    set substances(substances) {
        if (Array.isArray(substances)) {
            this.setMetaDataItem('substances', substances.map(s => s.toObject()));
        }
    }

    get substances() {
        return this.getMetaDataItem('substances').map(s => SsmSubstance.fromObject(s));
    }

    addSubstance(substance) {
        if (!(substance instanceof SsmSubstance)) {
            throw new Error('Substance has too be instance of SsmSubstance');
        }

        const substances = this.substances;
        substances.push(substance);

        this.substances = substances;
        this.updateStressPeriodData();
    }

    updateSubstance(substance) {
        if (!(substance instanceof SsmSubstance)) {
            throw new Error('Substance has too be instance of SsmSubstance');
        }

        this.substances = this.substances.map(s => {
            if (s.id === substance.id) {
                return substance;
            }

            return s;
        });
        this.updateStressPeriodData();
    }

    removeSubstance(id) {
        this.substances = this.substances.filter(s => s.id !== id);
        this.updateStressPeriodData();
    }

    updateStressPeriodData() {
        const substances = this.substances;

        let spData = [];
        substances.forEach((s, substanceIdx) => {
            if (substanceIdx === 0) {
                spData = s.toSsmPackageValues();
            }

            if (substanceIdx === 1) {
                // copy first substance concentration to the end of sp-value
                // add concentration of 0 for the new substance
                spData.map(sp => (
                    sp.map(data => (data.push(data[3])))
                ));
            }

            if (substanceIdx > 0) {
                s.toSsmPackageValues().forEach((sp, idx) => {
                    sp.forEach(value => {
                        let push = true;
                        spData[idx] = spData[idx].map((data) => {
                            if (data[0] === value[0] &&
                                data[1] === value[1] &&
                                data[2] === value[2] &&
                                data[4] === value[4]) {
                                data.push(value[3]);
                                push = false;
                            } else {
                                data.push(0);
                            }

                            return data;
                        });

                        if (push) {
                            spData[idx].push([
                                value[0],
                                value[1],
                                value[2],
                                0,
                                value[4],
                                ...(new Array(substanceIdx).fill(0)),
                                value[3]
                            ]);
                        }
                    });
                });
            }
        });

        this._stressPeriodData = spData;
    }

    toObject() {
        const obj = {
            crch: this.crch,
            cevt: this.cevt,
            mxss: this.mxss,
            stress_period_data: this.stressPeriodData,
            dtype: this.dtype,
            extension: this.extension,
            unitnumber: this.unitnumber,
            filenames: this.filenames
        };

        return {
            ...super.toObject(),
            ...obj
        };
    }
}

export default SsmPackage;
