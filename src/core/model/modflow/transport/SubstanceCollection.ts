import {sortBy} from 'lodash';
import {Collection} from '../../collection/Collection';
import Substance from './Substance';
import {ISubstance} from './Substance.type';

class SubstanceCollection extends Collection<Substance> {

    get substances() {
        return sortBy(this.all, [(b) => b.name.toUpperCase()]);
    }

    public static fromArray(arr: ISubstance[]) {
        const substances = new SubstanceCollection();
        arr.map((item) => substances.addSubstance(Substance.fromObject(item)));
        return substances;
    }

    public addSubstance(substance: Substance) {
        return this.add(substance);
    }

    public removeSubstanceById(substanceId: string) {
        return this.removeBy('id', substanceId);
    }

    public toArray = () => {
        return this.substances.map((b) => b.toObject());
    };
}

export default SubstanceCollection;
