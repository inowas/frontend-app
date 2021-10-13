import { FlopySeawatPackage, FlopySeawatSwt, FlopySeawatSwtvdf, FlopySeawatSwtvsc } from './index';
import { GenericObject } from '../../../genericObject/GenericObject';
import { IFlopySeawatSwt } from './FlopySeawatSwt';
import { IFlopySeawatSwtvdf } from './FlopySeawatSwtvdf';
import { IFlopySeawatSwtvsc } from './FlopySeawatSwtvsc';
import { IPropertyValueObject } from '../../../types';
import { VariableDensity } from '../../../modflow';

export interface IFlopySeawat extends IPropertyValueObject {
  enabled: boolean;
  swt: IFlopySeawatSwt;
  vdf?: IFlopySeawatSwtvdf;
  vsc?: IFlopySeawatSwtvsc;
}

export const packagesMap: IPropertyValueObject = {
  swt: FlopySeawatSwt,
  vdf: FlopySeawatSwtvdf,
  vsc: FlopySeawatSwtvsc,
};

export default class FlopySeawat extends GenericObject<IFlopySeawat> {

  public static create(variableDensity: VariableDensity) {
    return new this({
      enabled: variableDensity.enabled,
      swt: FlopySeawatSwt.fromDefaults().toObject(),
      vdf: variableDensity.vdfEnabled ? FlopySeawatSwtvdf.fromDefaults().toObject() : undefined,
      vsc: variableDensity.vscEnabled ? FlopySeawatSwtvsc.fromDefaults().toObject() : undefined
    });
  }

  public static fromObject(obj: IFlopySeawat) {
    return new this(obj);
  }

  public recalculate = (variableDensity: VariableDensity) => {
    this.enabled = variableDensity.enabled;
    this._props.vdf = this._props.vdf ? FlopySeawatSwtvdf.fromObject(this._props.vdf).update().toObject() :
      variableDensity.vdfEnabled ? FlopySeawatSwtvdf.fromDefaults().toObject() : undefined;
    this._props.vsc = this._props.vsc ? FlopySeawatSwtvsc.fromObject(this._props.vsc).update().toObject() :
      variableDensity.vscEnabled ? FlopySeawatSwtvsc.fromDefaults().toObject() : undefined;

    return this;
  };

  public toggleEnabled() {
    this._props.enabled = !this._props.enabled;
  }

  public setPackage = (pck: any) => {
    const type = this.getTypeFromPackage(pck);
    this._props[type] = pck.toObject();
    return this;
  };

  public getTypeFromPackage = (pck: FlopySeawatPackage<any>) => {
    let type: string | null = null;
    for (const t in packagesMap) {
      if (t in packagesMap) {
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

  public getPackage = (type: string): FlopySeawatPackage<any> | undefined => {
    if (!(type in packagesMap)) {
      return undefined;
    }

    if (this._props[type] === undefined) {
      return undefined;
    }

    const className = packagesMap[type];
    return className.fromObject(this._props[type]);
  };

  get packages(): IPropertyValueObject {
    return {
      swt: this._props.swt,
      vdf: this._props.vdf,
      vsc: this._props.vsc
    };
  }

  public update = (variableDensity: VariableDensity) => {
    this.recalculate(variableDensity);
    return this;
  };

  get enabled() {
    return this._props.enabled;
  }

  set enabled(value) {
    this._props.enabled = value;
  }

  public toFlopyCalculation = () => {
    if (!this.enabled) {
      return null;
    }

    const obj = { ...this._props };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete obj.enabled;

    return {
      ...obj, packages: Object.keys(obj)
    };
  };
}
