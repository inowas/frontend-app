import {GenericObject} from '../../../genericObject/GenericObject';
import {IPropertyValueObject} from '../../../types';
import FlopyMt3dMt, {IFlopyMt3dMt} from './FlopyMt3dMt';

import FlopyMt3dMtadv, {IFlopyMt3dMtAdv} from './FlopyMt3dMtadv';
import FlopyMt3dMtbtn, {IFlopyMt3dMtBtn} from './FlopyMt3dMtbtn';
import FlopyMt3dMtdsp, {IFlopyMt3dMtdsp} from './FlopyMt3dMtdsp';
import FlopyMt3dMtgcg, {IFlopyMt3dMtgcg} from './FlopyMt3dMtgcg';
import FlopyMt3dMtrct, {IFlopyMt3dMtrct} from './FlopyMt3dMtrct';
import FlopyMt3dMtssm, {IFlopyMt3dMtssm} from './FlopyMt3dMtssm';

import {BoundaryCollection} from '../../../modflow/boundaries';
import {Transport} from '../../../modflow';
import FlopyMt3dPackage from './FlopyMt3dPackage';

export interface IFlopyMt3d extends IPropertyValueObject {
    enabled: boolean;
    mt: IFlopyMt3dMt;
    adv: IFlopyMt3dMtAdv;
    btn: IFlopyMt3dMtBtn;
    dsp: IFlopyMt3dMtdsp;
    gcg: IFlopyMt3dMtgcg;
    rct: IFlopyMt3dMtrct;
    ssm: IFlopyMt3dMtssm;
}

export const packagesMap: IPropertyValueObject = {
    mt: FlopyMt3dMt,
    adv: FlopyMt3dMtadv,
    btn: FlopyMt3dMtbtn,
    dsp: FlopyMt3dMtdsp,
    gcg: FlopyMt3dMtgcg,
    rct: FlopyMt3dMtrct,
    ssm: FlopyMt3dMtssm
};

class FlopyMt3d extends GenericObject<IFlopyMt3d> {

    get enabled() {
        return this._props.enabled;
    }

    set enabled(value) {
        this._props.enabled = value;
    }

    public static create(transport: Transport, boundaries: BoundaryCollection) {

        const obj: IFlopyMt3d = {
            enabled: transport.enabled,
            mt: FlopyMt3dMt.create().toObject(),
            btn: FlopyMt3dMtbtn.create().update(transport).toObject(),
            adv: FlopyMt3dMtadv.create().toObject(),
            dsp: FlopyMt3dMtdsp.create().toObject(),
            gcg: FlopyMt3dMtgcg.create().toObject(),
            rct: FlopyMt3dMtrct.create().toObject(),
            ssm: FlopyMt3dMtssm.create(transport, boundaries).toObject()
        };

        return new this(obj);
    }

    public static fromObject(obj: IFlopyMt3d) {
        return new this(obj);
    }

    public recalculate = (transport: Transport, boundaries: BoundaryCollection) => {

        this.enabled = transport.enabled;
        this._props.adv = FlopyMt3dMtadv.fromObject(this._props.adv).update().toObject();
        this._props.btn = FlopyMt3dMtbtn.fromObject(this._props.btn).update(transport).toObject();
        this._props.dsp = FlopyMt3dMtdsp.fromObject(this._props.dsp).update().toObject();
        this._props.gcg = FlopyMt3dMtgcg.fromObject(this._props.gcg).update().toObject();
        this._props.rct = FlopyMt3dMtrct.fromObject(this._props.rct).update().toObject();
        this._props.ssm = FlopyMt3dMtssm.fromObject(this._props.ssm).update(transport, boundaries).toObject();

        return this;
    };

    public toggleEnabled() {
        this._props.enabled = !this._props.enabled;
    }

    public setPackage = (pck: FlopyMt3dPackage<any>) => {
        const type = this.getTypeFromPackage(pck);
        this._props[type] = pck.toObject();
        return this;
    };

    public getTypeFromPackage = (pck: FlopyMt3dPackage<any>) => {
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

    public getPackage = (type: string): FlopyMt3dPackage<any> | undefined => {
        if (!packagesMap.hasOwnProperty(type)) {
            return undefined;
        }

        if (this._props[type] === undefined) {
            return undefined;
        }

        const className = packagesMap[type];
        return className.fromObject(this._props[type]);
    };

    public toFlopyCalculation = () => {
        if (!this.enabled) {
            return null;
        }

        const obj = {...this._props};
        delete obj.enabled;

        return {
            ...obj, packages: Object.keys(obj)
        };
    };
}

export default FlopyMt3d;
