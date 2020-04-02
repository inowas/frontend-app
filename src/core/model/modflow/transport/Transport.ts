import {GenericObject} from '../../genericObject/GenericObject';
import Substance from './Substance';
import SubstanceCollection from './SubstanceCollection';
import {ITransport} from './Transport.type';

class Transport extends GenericObject<ITransport> {

    get enabled() {
        return this._props.enabled;
    }

    set enabled(value) {
        this._props.enabled = value;
    }

    get substances() {
        return SubstanceCollection.fromObject(this._props.substances);
    }

    set substances(value) {
        this._props.substances = value.toObject();
    }

    public static fromQuery(query: ITransport) {
        if (Array.isArray(query) && query.length === 0) {
            return Transport.fromDefault();
        }
        return new Transport(query);
    }

    public static fromObject(obj: ITransport) {
        return new Transport(obj);
    }

    public static fromDefault() {
        return Transport.fromObject({
            enabled: false,
            substances: []
        });
    }

    public addSubstance = (substance: Substance) => {
        this._props.substances.push(substance.toObject());
    };

    public removeSubstanceById = (substanceId: string) => {
        this._props.substances.filter((s) => s.id !== substanceId);
    };

    public updateSubstance = (substance: Substance) => {
        this._props.substances = this._props.substances.map((s) => {
            if (s.id === substance.id) {
                return substance.toObject();
            }
            return s;
        });
    };
}

export default Transport;
