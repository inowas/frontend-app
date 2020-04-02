import {GenericObject} from '../../../genericObject/GenericObject';
import {VariableDensity} from '../../../modflow';
import {IPropertyValueObject} from '../../../types';
import {IFlopySeawatSwt} from './FlopySeawatSwt';
import {IFlopySeawatSwtvdf} from './FlopySeawatSwtvdf';
import {IFlopySeawatSwtvsc} from './FlopySeawatSwtvsc';
import {FlopySeawatSwt, FlopySeawatSwtvdf, FlopySeawatSwtvsc} from './index';

export interface IFlopySeawat extends IPropertyValueObject {
    enabled: boolean;
    swt: IFlopySeawatSwt;
    vdf?: IFlopySeawatSwtvdf;
    vsc?: IFlopySeawatSwtvsc;
}

const packagesMap: IPropertyValueObject = {
    swt: FlopySeawatSwt,
    vdf: FlopySeawatSwtvdf,
    vsc: FlopySeawatSwtvsc,
};

export default class FlopySeawat extends GenericObject<IFlopySeawat> {

    public static createFromVariableDensity(variableDensity: VariableDensity) {
        return new this({
            enabled: variableDensity.enabled,
            swt: FlopySeawatSwt.fromDefaults().toObject(),
            vdf: variableDensity.vdfEnabled ? FlopySeawatSwtvdf.fromDefaults().toObject() : undefined,
            vsc: variableDensity.vscEnabled ? FlopySeawatSwtvsc.fromDefaults().toObject() : undefined
        });
    }

    get vdf() {
        return this._props.vdf;
    }

    get vsc() {
        return this._props.vsc;
    }

    get packages(): IPropertyValueObject {
        return {
            swt: this._props.swt,
            vdf: this._props.vdf,
            vsc: this._props.vsc
        };
    }

    public static fromObject(obj: IFlopySeawat) {
        const self = new this(obj);
        for (const prop in obj) {
            if (prop !== '_meta' && prop !== 'enabled') {
                if (obj.hasOwnProperty(prop)) {
                    self.setPackage(packagesMap[prop].fromObject(obj[prop]));
                }
            }
        }
        return self;
    }

    public recalculate = (variableDensity: VariableDensity) => {
        this.enabled = variableDensity.enabled;

        if (variableDensity.vdfEnabled) {
            const swtVdf = this.hasPackage('vdf') ? this.getPackage('vdf') : FlopySeawatSwtvdf.create();
            this.setPackage(swtVdf);
        }
        if (variableDensity.vscEnabled) {
            const swtVsc = this.hasPackage('vsc') ? this.getPackage('vsc') : FlopySeawatSwtvsc.create();
            this.setPackage(swtVsc);
        }
    };

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

    public setPackage(p: IPropertyValueObject) {
        for (const name in packagesMap) {
            if (packagesMap.hasOwnProperty(name) && p instanceof packagesMap[name]) {
                this._props[name] = p;
                return;
            }
        }

        throw new Error('Package ' + p.constructor.name + ' not found in PackageMap.');
    }

    public hasPackage(name: string) {
        return !!this._props[name];
    }

    public getPackage(name: string) {
        if (!this._props[name]) {
            throw new Error('Package not found');
        }

        return this._props[name];
    }

    public toFlopyCalculation = () => {
        if (!this.enabled) {
            return null;
        }

        const obj: IPropertyValueObject = {
            packages: Object.keys(this.packages)
        };

        for (const prop in this.packages) {
            if (this.packages.hasOwnProperty(prop)) {
                obj[prop] = this.packages[prop].toObject();
            }
        }

        return obj;
    };
}
