import Substance from './Substance';
import SubstanceCollection from './SubstanceCollection';
import {ITransport} from './Transport.type';

class Transport {

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
        return new Transport(query);
    }

    public static fromObject(obj: ITransport) {
        return new Transport(obj);
    }

    public _props: ITransport;

    constructor(props: ITransport) {
        this._props = props;
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

    public toObject = () => this._props;
}

export default Transport;
