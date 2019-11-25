import {GenericObject} from '../../../genericObject/GenericObject';
import {ModflowModel} from '../../../modflow';
import BoundaryCollection from '../../../modflow/boundaries/BoundaryCollection';
import Soilmodel from '../../../modflow/soilmodel/Soilmodel';
import {IFlopyModflow} from './FlopyModflow.type';
import FlopyModflowMf from './FlopyModflowMf';
import FlopyModflowMfbas from './FlopyModflowMfbas';
import FlopyModflowMfbcf from './FlopyModflowMfbcf';
import FlopyModflowMfchd from './FlopyModflowMfchd';
import FlopyModflowMfde4 from './FlopyModflowMfde4';
import FlopyModflowMfdis from './FlopyModflowMfdis';
import FlopyModflowMfdrn from './FlopyModflowMfdrn';
import FlopyModflowMfevt from './FlopyModflowMfevt';
import FlopyModflowMfghb from './FlopyModflowMfghb';
import FlopyModflowMfhob from './FlopyModflowMfhob';
import FlopyModflowMflak from './FlopyModflowMflak';
import FlopyModflowMflmt from './FlopyModflowMflmt';
import FlopyModflowMflpf from './FlopyModflowMflpf';
import FlopyModflowMfnwt from './FlopyModflowMfnwt';
import FlopyModflowMfoc from './FlopyModflowMfoc';
import FlopyModflowMfpcg from './FlopyModflowMfpcg';
import FlopyModflowMfrch from './FlopyModflowMfrch';
import FlopyModflowMfriv from './FlopyModflowMfriv';
import FlopyModflowMfsip from './FlopyModflowMfsip';
import FlopyModflowMfupw from './FlopyModflowMfupw';
import FlopyModflowMfwel from './FlopyModflowMfwel';

const packagesMap = {
    mf: FlopyModflowMf,
    bas: FlopyModflowMfbas,

    bcf: FlopyModflowMfbcf,
    chd: FlopyModflowMfchd,
    dis: FlopyModflowMfdis,
    drn: FlopyModflowMfdrn,
    evt: FlopyModflowMfevt,
    ghb: FlopyModflowMfghb,
    hob: FlopyModflowMfhob,
    lpf: FlopyModflowMflpf,
    lmt: FlopyModflowMflmt,
    oc: FlopyModflowMfoc,
    rch: FlopyModflowMfrch,
    riv: FlopyModflowMfriv,
    upw: FlopyModflowMfupw,
    wel: FlopyModflowMfwel,

    de4: FlopyModflowMfde4,
    nwt: FlopyModflowMfnwt,
    pcg: FlopyModflowMfpcg,
    sip: FlopyModflowMfsip,
};

export default class FlopyModflow extends GenericObject<IFlopyModflow> {

    public static create(model: ModflowModel, soilmodel: Soilmodel, boundaries: BoundaryCollection) {
        const obj: IFlopyModflow = {

            // Discretization and BasePackages
            mf: FlopyModflowMf.create().toObject(),
            bas: FlopyModflowMfbas.create(model, soilmodel).toObject(),
            dis: FlopyModflowMfdis.create(model, soilmodel).toObject(),

            // FlowPackage

            // SolverPackage

            // Output control
            oc: FlopyModflowMfoc.create(model.stressperiods.count).toObject()
        };

        // Boundaries
        const chd = FlopyModflowMfchd.create(boundaries, model.stressperiods);
        chd ? obj.chd = chd.toObject() : delete obj.chd;

        const ghb = FlopyModflowMfghb.create(boundaries, model.stressperiods);
        ghb ? obj.ghb = ghb.toObject() : delete obj.ghb;

        const drn = FlopyModflowMfdrn.create(boundaries, model.stressperiods);
        drn ? obj.drn = drn.toObject() : delete obj.drn;

        const evt = FlopyModflowMfevt.create(boundaries, model.stressperiods, model.gridSize);
        evt ? obj.evt = evt.toObject() : delete obj.evt;

        const hob = FlopyModflowMfhob.create(boundaries, model.stressperiods);
        hob ? obj.hob = hob.toObject() : delete obj.hob;

        const lak = FlopyModflowMflak.create(boundaries, model.stressperiods);
        lak ? obj.lak = lak.toObject() : delete obj.lak;

        const rch = FlopyModflowMfrch.create(boundaries, model.stressperiods, model.gridSize);
        rch ? obj.rch = rch.toObject() : delete obj.rch;

        const riv = FlopyModflowMfriv.create(boundaries, model.stressperiods);
        riv ? obj.riv = riv.toObject() : delete obj.riv;

        const wel = FlopyModflowMfwel.create(boundaries, model.stressperiods);
        wel ? obj.wel = wel.toObject() : delete obj.wel;

        return new this(obj);
    }

    public static fromObject(obj: IFlopyModflow) {
        return new this(obj);
    }

}
