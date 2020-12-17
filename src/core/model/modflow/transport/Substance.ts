import {IBoundaryConcentration, ISubstance} from './Substance.type';
import Uuid from 'uuid';

class Substance {

    get id() {
        return this._props.id;
    }

    set id(value: string) {
        this._props.id = value;
    }

    get name() {
        return this._props.name;
    }

    set name(value: string) {
        this._props.name = value;
    }

    get boundaryConcentrations() {
        return this._props.boundaryConcentrations;
    }

    set boundaryConcentrations(values: IBoundaryConcentration[]) {
        this._props.boundaryConcentrations = values;
    }

    public static create(name: string) {
        return new Substance({
            id: Uuid.v4(),
            name,
            boundaryConcentrations: []
        });
    }

    public static fromObject(obj: ISubstance) {
        return new Substance(obj);
    }

    public _props: ISubstance;

    constructor(props: ISubstance) {
        this._props = props;
    }

    public addBoundaryId = (id: string) => {
        const pushable = this._props.boundaryConcentrations;
        pushable.push({
            id,
            concentrations: []
        });
        this._props.boundaryConcentrations = pushable;
    };

    public removeBoundaryId = (id: string) => {
        this._props.boundaryConcentrations = this._props.boundaryConcentrations.filter((bc) => bc.id !== id);
    };

    public updateConcentrations = (boundaryId: string, concentrations: number[]) => {
        const cConcentrations = this._props.boundaryConcentrations;
        this._props.boundaryConcentrations = cConcentrations.map((bc) => {
            if (bc.id === boundaryId) {
                bc.concentrations = concentrations;
            }
            return bc;
        });
    };

    public toObject(): ISubstance {
        return {
            id: this._props.id,
            name: this._props.name,
            boundaryConcentrations: this._props.boundaryConcentrations,
        };
    }
}

export default Substance;
