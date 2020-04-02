import Substance from './Substance';
import SubstanceCollection from './SubstanceCollection';
import {ITransport} from './Transport.type';

class Transport {

    get enabled() {
        return this._enabled;
    }

    set enabled(value) {
        this._enabled = value;
    }

    get substances() {
        return this._substances;
    }

    set substances(value) {
        this._substances = value;
    }

    public static fromQuery(query: ITransport) {
        return Transport.fromObject(query);
    }

    public static fromObject(obj: ITransport) {
        const transport = new Transport();
        transport.enabled = obj.enabled || false;
        transport.substances = SubstanceCollection.fromArray(obj.substances || []);
        return transport;
    }

    public static fromDefault() {
        return Transport.fromObject({
            enabled: false,
            substances: []
        });
    }

    public _enabled: boolean = false;
    public _substances: SubstanceCollection = new SubstanceCollection();

    public addSubstance = (substance: Substance) => {
        this.substances.addSubstance(substance);
    };

    public removeSubstanceById = (substanceId: string) => {
        this.substances.removeSubstanceById(substanceId);
    };

    public updateSubstance = (substance: Substance) => {
        this.substances.update(substance, false);
    };

    public toObject = () => {
        return {
            enabled: this.enabled,
            substances: this.substances.toArray(),
        };
    };
}

export default Transport;
