import {IVariableDensity} from './VariableDensity.type';

class VariableDensity {

    get enabled() {
        return this._vdfEnabled;
    }

    get vdfEnabled() {
        return this._vdfEnabled;
    }

    set vdfEnabled(value) {
        if (!value) {
            this._vscEnabled = false;
        }

        this._vdfEnabled = value;
    }

    get vscEnabled() {
        return this._vscEnabled;
    }

    set vscEnabled(value) {
        this._vscEnabled = value;
    }

    public static fromDefault() {
        return VariableDensity.fromObject([]);
    }

    public static fromObject(obj: IVariableDensity | []) {
        const variableDensity = new VariableDensity();
        if (obj as IVariableDensity) {
            variableDensity.vdfEnabled = (obj as IVariableDensity).vdfEnabled || false;
            variableDensity.vscEnabled = (obj as IVariableDensity).vscEnabled || false;
        }
        return variableDensity;
    }

    public static fromQuery(obj: IVariableDensity | []) {
        return VariableDensity.fromObject(obj);
    }

    private _vdfEnabled: boolean = false;
    private _vscEnabled: boolean = false;

    public toObject = () => {
        return {
            vdfEnabled: this.vdfEnabled,
            vscEnabled: this.vscEnabled,
        };
    };
}

export default VariableDensity;
