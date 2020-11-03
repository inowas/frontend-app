import {IPropertyValueObject} from '../../../types';
import {ModflowModel} from '../../../modflow';
import FlopyModflowPackage from './FlopyModflowPackage';

export interface IFlopyModflowMfoc extends IPropertyValueObject {
    ihedfm: number;
    iddnfm: number;
    chedfm: string | null;
    cddnfm: string | null;
    cboufm: string | null;
    compact: boolean;
    stress_period_data: Array<[[number, number], string[]]>;
    extension: string | string[];
    unitnumber: number | null;
    filenames: null | string | string[];
    label: string;
}

export const defaults: IFlopyModflowMfoc = {
    ihedfm: 0,
    iddnfm: 0,
    chedfm: null,
    cddnfm: null,
    cboufm: null,
    compact: true,
    stress_period_data: [[[0, 0], ['save head']]],
    extension: ['oc', 'hds', 'ddn', 'cbc', 'ibo'],
    unitnumber: null,
    filenames: null,
    label: 'LABEL',
};

export default class FlopyModflowMfoc extends FlopyModflowPackage<IFlopyModflowMfoc> {

    public static create(model: ModflowModel) {
        return this.fromDefault().update(model);
    }

    public static fromDefault() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopyModflowMfoc {
        const d: any = FlopyModflowPackage.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                d[key] = obj[key];
            }
        }

        return new this(d);
    }

    public update(model: ModflowModel, data?: Array<[[number, number], string[]]>) {
        const spData: IFlopyModflowMfoc['stress_period_data'] = [];
        const nper = model.stressperiods.stressperiods.length;

        for (let per = 0; per < nper; per++) {
            const nstp = model.stressperiods.stressperiods[per].nstp;
            for (let tp = 0; tp < nstp; tp++) {
                const d = data ? data.filter((r) => r[0][0] === per && r[0][1] === tp) : null;
                if (d && d.length > 0) {
                    spData.push(d[0]);
                } else {
                    spData.push([[per, tp], ['save head', 'save drawdown', 'save budget']]);
                }
            }
        }

        this.stress_period_data = spData;
        return this;
    }

    get ihedfm() {
        return this._props.ihedfm;
    }

    set ihedfm(value) {
        this._props.ihedfm = value;
    }

    get iddnfm() {
        return this._props.iddnfm;
    }

    set iddnfm(value) {
        this._props.iddnfm = value;
    }

    get chedfm() {
        return this._props.chedfm;
    }

    set chedfm(value) {
        this._props.chedfm = value;
    }

    get cddnfm() {
        return this._props.cddnfm;
    }

    set cddnfm(value) {
        this._props.cddnfm = value;
    }

    get cboufm() {
        return this._props.cboufm;
    }

    set cboufm(value) {
        this._props.cboufm = value;
    }

    get compact() {
        return this._props.compact;
    }

    set compact(value) {
        this._props.compact = value;
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

    get label() {
        return this._props.label;
    }

    set label(value) {
        this._props.label = value;
    }
}
