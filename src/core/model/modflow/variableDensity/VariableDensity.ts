import {IVariableDensity} from './VariableDensity.type';

class VariableDensity {
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

    public static fromObject(obj: IVariableDensity) {
        const variableDensity = new VariableDensity();
        variableDensity.vdfEnabled = obj.vdfEnabled;
        variableDensity.vscEnabled = obj.vscEnabled;
        return variableDensity;
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

export default Transport;
