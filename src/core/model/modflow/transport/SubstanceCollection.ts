import {Collection} from '../../collection/Collection';
import {ISubstance} from './Substance.type';
import {sortBy} from 'lodash';
import Substance from './Substance';

class SubstanceCollection extends Collection<Substance> {

    get substances() {
        return sortBy(this.all, [(b) => b.name.toUpperCase()]);
    }

    public static fromObject(arr: ISubstance[] = []) {
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

    public toObject = () => {
        return this.substances.map((b) => b.toObject());
    };
}

export default SubstanceCollection;
