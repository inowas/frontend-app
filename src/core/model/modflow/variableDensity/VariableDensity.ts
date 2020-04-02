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

    public static fromObject(obj: IVariableDensity) {
        return new VariableDensity(obj);
    }

    public static fromQuery(obj: IVariableDensity) {
        return VariableDensity.fromObject(obj);
    }
}

export default VariableDensity;
