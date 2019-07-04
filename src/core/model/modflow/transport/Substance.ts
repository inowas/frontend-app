import Uuid from 'uuid';
import {IBoundaryConcentration, ISubstance} from './Substance.type';

class Substance {

    get id() {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get name() {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get boundaryConcentrations() {
        return this._boundaryConcentrations;
    }

    set boundaryConcentrations(values: IBoundaryConcentration[]) {
        this._boundaryConcentrations = values;
    }

    public static create(name: string) {
        const substance = new Substance();
        substance._id = Uuid.v4();
        substance._name = name;
        return substance;
    }

    public static fromObject(obj: ISubstance) {
        const substance = new Substance();
        substance._id = obj.id;
        substance._name = obj.name;
        substance._boundaryConcentrations = obj.boundaryConcentrations;
        return substance;
    }

    public _id: string = '';
    public _name: string = '';
    public _boundaryConcentrations: IBoundaryConcentration[] | [] = [];

    public addBoundaryId = (id: string) => {
        const pushable = this._boundaryConcentrations as IBoundaryConcentration[];
        pushable.push({
            id,
            concentrations: []
        });
        this._boundaryConcentrations = pushable;
    };

    public removeBoundaryId = (id: string) => {
        this._boundaryConcentrations = this._boundaryConcentrations.filter((bc) => bc.id !== id);
    };

    public updateConcentrations = (boundaryId: string, concentrations: number[]) => {
        const mappable = this._boundaryConcentrations as IBoundaryConcentration[];
        this._boundaryConcentrations = mappable.map((bc) => {
            if (bc.id === boundaryId) {
                bc.concentrations = concentrations;
            }
            return bc;
        });
    };

    public toObject(): ISubstance {
        return {
            id: this.id,
            name: this._name,
            boundaryConcentrations: this._boundaryConcentrations,
        };
    }
}

export default Substance;
