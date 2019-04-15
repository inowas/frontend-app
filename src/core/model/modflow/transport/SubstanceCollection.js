import {sortBy} from 'lodash';
import AbstractCollection from '../../collection/AbstractCollection';
import Substance from './Substance';

class SubstanceCollection extends AbstractCollection {

    static fromArray(arr) {
        const substances = new SubstanceCollection();
        arr.map(item => substances.addSubstance(Substance.fromObject(item)));
        return substances;
    }

    addSubstance(substance) {
        if (!(substance instanceof Substance)) {
            throw new Error('Substance expected to be instance of Substance.');
        }
        return this.add(substance);
    }

    removeSubstanceById(substanceId) {
        return this.remove(substanceId);
    }

    countByType(type) {
        return this.boundaries.filter(b => b.type === type).length;
    }

    get substances() {
        return sortBy(this._items, [(b) => b.name.toUpperCase()]);
    }

    toObject = () => {
        return this.substances.map(b => b.toObject())
    };
}

export default SubstanceCollection;
