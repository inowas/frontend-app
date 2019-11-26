import {GenericObject} from '../../../genericObject/GenericObject';
import {ModflowModel} from '../../../modflow';
import BoundaryCollection from '../../../modflow/boundaries/BoundaryCollection';
import Soilmodel from '../../../modflow/soilmodel/Soilmodel';
import {IPropertyValueObject} from '../../../types';
import {IFlopyModflow} from './FlopyModflow.type';
import FlopyModflowFlowPackage from './FlopyModflowFlowPackage';
import FlopyModflowMf from './FlopyModflowMf';
import FlopyModflowMfbas from './FlopyModflowMfbas';
import FlopyModflowMfbcf from './FlopyModflowMfbcf';
import FlopyModflowMfchd from './FlopyModflowMfchd';
import FlopyModflowMfde4 from './FlopyModflowMfde4';
import FlopyModflowMfdis from './FlopyModflowMfdis';
import FlopyModflowMfdrn from './FlopyModflowMfdrn';
import FlopyModflowMfevt from './FlopyModflowMfevt';
import FlopyModflowMffhb from './FlopyModflowMffhb';
import FlopyModflowMfghb from './FlopyModflowMfghb';
import FlopyModflowMfgmg from './FlopyModflowMfgmg';
import FlopyModflowMfhfb from './FlopyModflowMfhfb';
import FlopyModflowMfhob from './FlopyModflowMfhob';
import FlopyModflowMflak from './FlopyModflowMflak';
import FlopyModflowMflmt from './FlopyModflowMflmt';
import FlopyModflowMflpf from './FlopyModflowMflpf';
import FlopyModflowMfnwt from './FlopyModflowMfnwt';
import FlopyModflowMfoc from './FlopyModflowMfoc';
import FlopyModflowMfpcg from './FlopyModflowMfpcg';
import FlopyModflowMfpcgn from './FlopyModflowMfpcgn';
import FlopyModflowMfrch from './FlopyModflowMfrch';
import FlopyModflowMfriv from './FlopyModflowMfriv';
import FlopyModflowMfsip from './FlopyModflowMfsip';
import FlopyModflowMfsms from './FlopyModflowMfsms';
import FlopyModflowMfsor from './FlopyModflowMfsor';
import FlopyModflowMfstr from './FlopyModflowMfstr';
import FlopyModflowMfswi2 from './FlopyModflowMfswi2';
import FlopyModflowMfupw from './FlopyModflowMfupw';
import FlopyModflowMfwel from './FlopyModflowMfwel';
import FlopyModflowPackage from './FlopyModflowPackage';
import FlopyModflowSolverPackage from './FlopyModflowSolverPackage';

export const packagesMap: IPropertyValueObject = {
    mf: FlopyModflowMf,
    bas: FlopyModflowMfbas,
    dis: FlopyModflowMfdis,

    // Boundaries
    chd: FlopyModflowMfchd,
    ghb: FlopyModflowMfghb,
    drn: FlopyModflowMfdrn,
    evt: FlopyModflowMfevt,
    fhb: FlopyModflowMffhb,
    hfb: FlopyModflowMfhfb,
    hob: FlopyModflowMfhob,
    lak: FlopyModflowMflak,
    rch: FlopyModflowMfrch,
    riv: FlopyModflowMfriv,
    str: FlopyModflowMfstr,
    wel: FlopyModflowMfwel,

    // Flow
    bcf: FlopyModflowMfbcf,
    lpf: FlopyModflowMflpf,
    swi2: FlopyModflowMfswi2,
    upw: FlopyModflowMfupw,

    // Solver
    de4: FlopyModflowMfde4,
    gmg: FlopyModflowMfgmg,
    nwt: FlopyModflowMfnwt,
    pcg: FlopyModflowMfpcg,
    pcgn: FlopyModflowMfpcgn,
    sip: FlopyModflowMfsip,
    sms: FlopyModflowMfsms,
    sor: FlopyModflowMfsor,

    // Mt3dLink
    lmt: FlopyModflowMflmt,

    // Output-Control
    oc: FlopyModflowMfoc,
};

export const flowPackages = ['bcf', 'lpf', 'swi2', 'upw'];
export const solverPackages = ['bcf', 'lpf', 'swi2', 'upw'];

export default class FlopyModflow extends GenericObject<IFlopyModflow> {

    public static create(model: ModflowModel, soilmodel: Soilmodel, boundaries: BoundaryCollection) {
        const obj: IFlopyModflow = {

            // Discretization and BasePackages
            mf: FlopyModflowMf.create().toObject(),
            bas: FlopyModflowMfbas.create(model, soilmodel).toObject(),
            dis: FlopyModflowMfdis.create(model, soilmodel).toObject(),

            // Default Flow-Package
            lpf: FlopyModflowMflpf.create(soilmodel).toObject(),

            // Default Solver-Package
            pcg: FlopyModflowMfpcg.create().toObject(),

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

        const fhb = FlopyModflowMffhb.create(boundaries, model.stressperiods);
        fhb ? obj.fhb = fhb.toObject() : delete obj.fhb;

        const hfb = FlopyModflowMfhfb.create(boundaries, model.stressperiods);
        hfb ? obj.hfb = hfb.toObject() : delete obj.hfb;

        const hob = FlopyModflowMfhob.create(boundaries, model.stressperiods);
        hob ? obj.hob = hob.toObject() : delete obj.hob;

        const lak = FlopyModflowMflak.create(boundaries, model.stressperiods);
        lak ? obj.lak = lak.toObject() : delete obj.lak;

        const rch = FlopyModflowMfrch.create(boundaries, model.stressperiods, model.gridSize);
        rch ? obj.rch = rch.toObject() : delete obj.rch;

        const riv = FlopyModflowMfriv.create(boundaries, model.stressperiods);
        riv ? obj.riv = riv.toObject() : delete obj.riv;

        const str = FlopyModflowMfstr.create(boundaries, model.stressperiods);
        str ? obj.str = str.toObject() : delete obj.riv;

        const wel = FlopyModflowMfwel.create(boundaries, model.stressperiods);
        wel ? obj.wel = wel.toObject() : delete obj.wel;

        return new this(obj);
    }

    public static fromObject(obj: IFlopyModflow) {
        return new this(obj);
    }

    public recalculate = (model: ModflowModel, soilmodel: Soilmodel, boundaries: BoundaryCollection) => {

        // Recalculate Discretization
        this._props.bas = (FlopyModflowMfbas.fromObject(this._props.bas)).update(model, soilmodel).toObject();
        this._props.dis = FlopyModflowMfdis.fromObject(this._props.dis).update(model, soilmodel).toObject();

        // Recalculate Boundaries
        const chd = FlopyModflowMfchd.create(boundaries, model.stressperiods);
        chd ? this._props.chd = chd.toObject() : delete this._props.chd;

        const ghb = FlopyModflowMfghb.create(boundaries, model.stressperiods);
        ghb ? this._props.ghb = ghb.toObject() : delete this._props.ghb;

        const drn = FlopyModflowMfdrn.create(boundaries, model.stressperiods);
        drn ? this._props.drn = drn.toObject() : delete this._props.drn;

        const evt = FlopyModflowMfevt.create(boundaries, model.stressperiods, model.gridSize);
        evt ? this._props.evt = evt.toObject() : delete this._props.evt;

        const fhb = FlopyModflowMffhb.create(boundaries, model.stressperiods);
        fhb ? this._props.fhb = fhb.toObject() : delete this._props.fhb;

        const hfb = FlopyModflowMfhfb.create(boundaries, model.stressperiods);
        hfb ? this._props.hfb = hfb.toObject() : delete this._props.hfb;

        const hob = FlopyModflowMfhob.create(boundaries, model.stressperiods);
        hob ? this._props.hob = hob.toObject() : delete this._props.hob;

        const lak = FlopyModflowMflak.create(boundaries, model.stressperiods);
        lak ? this._props.lak = lak.toObject() : delete this._props.lak;

        const rch = FlopyModflowMfrch.create(boundaries, model.stressperiods, model.gridSize);
        rch ? this._props.rch = rch.toObject() : delete this._props.rch;

        const riv = FlopyModflowMfriv.create(boundaries, model.stressperiods);
        riv ? this._props.riv = riv.toObject() : delete this._props.riv;

        const str = FlopyModflowMfstr.create(boundaries, model.stressperiods);
        str ? this._props.str = str.toObject() : delete this._props.riv;

        const wel = FlopyModflowMfwel.create(boundaries, model.stressperiods);
        wel ? this._props.wel = wel.toObject() : delete this._props.wel;
    };

    public setTransportEnabled = (enabled: boolean) => {
        if (enabled) {
            this._props.lmt = FlopyModflowMflmt.fromDefault().toObject();
            return;
        }

        delete this._props.lmt;
    };

    public setPackage = (pck: FlopyModflowPackage<any>) => {

        const type = this.getTypeFromPackage(pck);

        if (flowPackages.indexOf(type) >= 0) {
            flowPackages.forEach((t) => delete this._props[t]);
        }

        if (solverPackages.indexOf(type) >= 0) {
            solverPackages.forEach((t) => delete this._props[t]);
        }

        return this._props[type] = pck.toObject();
    };

    public getTypeFromPackage = (pck: FlopyModflowPackage<any>) => {
        let type: string | null = null;
        for (const t in packagesMap) {
            if (packagesMap.hasOwnProperty(t)) {
                if (pck instanceof packagesMap[t]) {
                    type = t;
                }
            }
        }

        if (type === null) {
            throw Error('Type not registered in PackagesMap');
        }

        return type;
    };

    public getPackage = (type: string): FlopyModflowPackage<any> | undefined => {
        if (!packagesMap.hasOwnProperty(type)) {
            return undefined;
        }

        if (this._props[type] === undefined) {
            return undefined;
        }

        const className = packagesMap[type];
        return className.fromObject(this._props[type]);
    };

    public getFlowPackage = () => {
        let fp: any = null;
        flowPackages.forEach((t) => {
            if (this._props[t]) {
                fp = this.getPackage(t);
            }
        });

        if (fp instanceof FlopyModflowFlowPackage) {
            return fp;
        }

        return undefined;
    };

    public getSolverPackage = () => {
        let sp: any = null;
        solverPackages.forEach((t) => {
            if (this._props[t]) {
                sp = this.getPackage(t);
            }
        });

        if (sp instanceof FlopyModflowSolverPackage) {
            return sp;
        }

        return undefined;
    };

    public hasPackage = (type: string) => {
        return !!this._props[type];
    };

    public toFlopyCalculation = () => {
        return {...this._props, packages: Object.keys(this._props)};
    };
}
