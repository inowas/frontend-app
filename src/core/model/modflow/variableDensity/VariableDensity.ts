import {GenericObject} from '../../genericObject/GenericObject';
import {IVariableDensity} from './VariableDensity.type';

class VariableDensity extends GenericObject<IVariableDensity> {

    get enabled() {
        return this._props.vdfEnabled;
    }

    get vdfEnabled() {
        return this._props.vdfEnabled;
    }

    set vdfEnabled(value) {
        if (!value) {
            this._props.vdfEnabled = false;
        }

        this._props.vdfEnabled = value;
    }

    get vscEnabled() {
        return this._props.vscEnabled;
    }

    set vscEnabled(value) {
        this._props.vscEnabled = value;
    }

    public static fromDefault() {
        return new VariableDensity({
            vdfEnabled: false,
            vscEnabled: false
        });
    }

    public static fromObject(obj: IVariableDensity) {
      if (Array.isArray(obj) && obj.length === 0) {
        return this.fromDefault();
      }
        return new VariableDensity(obj);
    }

    public static fromQuery(obj: IVariableDensity) {
        if (Array.isArray(obj) && obj.length === 0) {
            return VariableDensity.fromDefault();
        }

        return VariableDensity.fromObject(obj);
    }
}

export default VariableDensity;
