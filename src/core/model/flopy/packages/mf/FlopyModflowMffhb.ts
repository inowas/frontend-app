/*
MODFLOW Flow and Head Boundary Package Class.
https://modflowpy.github.io/flopydoc/mffhb.html

ds5 =
[
    [lay, row, col, iaux, flwrat1, flwra2, ..., flwrat(nbdtime)],
    [lay, row, col, iaux, flwrat1, flwra2, ..., flwrat(nbdtime)],
    [lay, row, col, iaux, flwrat1, flwra2, ..., flwrat(nbdtime)],
    [lay, row, col, iaux, flwrat1, flwra2, ..., flwrat(nbdtime)]
]

ds7 =
[
    [lay, row, col, iaux, sbhed1, sbhed2, ..., sbhed(nbdtime)],
    [lay, row, col, iaux, sbhed1, sbhed2, ..., sbhed(nbdtime)],
    [lay, row, col, iaux, sbhed1, sbhed2, ..., sbhed(nbdtime)],
    [lay, row, col, iaux, sbhed1, sbhed2, ..., sbhed(nbdtime)]
]
*/

import {FlowAndHeadBoundary} from '../../../modflow/boundaries';
import BoundaryCollection from '../../../modflow/boundaries/BoundaryCollection';
import Stressperiods from '../../../modflow/Stressperiods';
import {IPropertyValueObject} from '../../../types';
import {calculateFlowAndHeadBoundarySpData} from '../../helpers';
import FlopyModflowBoundary from './FlopyModflowBoundary';
import FlopyModflowPackage from './FlopyModflowPackage';

export interface IFlopyModflowMffhb {
    nbdtim: number;
    nflw: number;
    nhed: number;
    ifhbss: number;
    ipakcb: number | null;
    nfhbx1: number;
    nfhbx2: number;
    ifhbpt: number;
    bdtimecnstm: number;
    bdtime: number | number[];
    cnstm5: number;
    ds5: number[][] | null;
    cnstm7: number;
    ds7: number[][] | null;
    extension: string;
    unitnumber: number | null;
    filenames: null | string | string[];
}

export const defaults: IFlopyModflowMffhb = {
    nbdtim: 1,
    nflw: 0,
    nhed: 0,
    ifhbss: 0,
    ipakcb: null,
    nfhbx1: 0,
    nfhbx2: 0,
    ifhbpt: 0,
    bdtimecnstm: 1.0,
    bdtime: [0.0],
    cnstm5: 1.0,
    ds5: null,
    cnstm7: 1.0,
    ds7: null,
    extension: 'fhb',
    unitnumber: null,
    filenames: null
};

export default class FlopyModflowMffhb extends FlopyModflowBoundary<IFlopyModflowMffhb> {

    public static create(boundaries: BoundaryCollection, stressperiods: Stressperiods) {
        return this.fromDefault().update(boundaries, stressperiods);
    }

    public static fromDefault() {
        return this.fromObject({});
    }

    public static fromObject(obj: IPropertyValueObject): FlopyModflowMffhb {
        const d: any = FlopyModflowPackage.cloneDeep(defaults);
        for (const key in d) {
            if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
                d[key] = obj[key];
            }
        }

        return new this(d);
    }

    public update = (boundaries: BoundaryCollection, stressperiods: Stressperiods) => {
        const bd = boundaries.all.filter((b) => (b instanceof FlowAndHeadBoundary)) as FlowAndHeadBoundary[];

        const spData = calculateFlowAndHeadBoundarySpData(bd, stressperiods);
        if (!spData) {
            return null;
        }

        this.nbdtim = spData.nbdtim;
        this.nflw = spData.nflw;
        this.nhed = spData.nhed;
        this.bdtime = spData.bdtime;
        this.ds5 = spData.ds5.length === 0 ? null : spData.ds5;
        this.ds7 = spData.ds7.length === 0 ? null : spData.ds7;
        return this;
    };

    get nbdtim() {
        return this._props.nbdtim;
    }

    set nbdtim(value) {
        this._props.nbdtim = value;
    }

    get nflw() {
        return this._props.nflw;
    }

    set nflw(value) {
        this._props.nflw = value;
    }

    get nhed() {
        return this._props.nhed;
    }

    set nhed(value) {
        this._props.nhed = value;
    }

    get ifhbss() {
        return this._props.ifhbss;
    }

    set ifhbss(value) {
        this._props.ifhbss = value;
    }

    get ipakcb() {
        return this._props.ipakcb;
    }

    set ipakcb(value) {
        this._props.ipakcb = value;
    }

    get nfhbx1() {
        return this._props.nfhbx1;
    }

    set nfhbx1(value) {
        this._props.nfhbx1 = value;
    }

    get nfhbx2() {
        return this._props.nfhbx2;
    }

    set nfhbx2(value) {
        this._props.nfhbx2 = value;
    }

    get ifhbpt() {
        return this._props.ifhbpt;
    }

    set ifhbpt(value) {
        this._props.ifhbpt = value;
    }

    get bdtimecnstm() {
        return this._props.bdtimecnstm;
    }

    set bdtimecnstm(value) {
        this._props.bdtimecnstm = value;
    }

    get bdtime() {
        return this._props.bdtime;
    }

    set bdtime(value) {
        this._props.bdtime = value;
    }

    get cnstm5() {
        return this._props.cnstm5;
    }

    set cnstm5(value) {
        this._props.cnstm5 = value;
    }

    get ds5() {
        return this._props.ds5;
    }

    set ds5(value) {
        this._props.ds5 = value;
    }

    get cnstm7() {
        return this._props.cnstm7;
    }

    set cnstm7(value) {
        this._props.cnstm7 = value;
    }

    get ds7() {
        return this._props.ds7;
    }

    set ds7(value) {
        this._props.ds7 = value;
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
}
