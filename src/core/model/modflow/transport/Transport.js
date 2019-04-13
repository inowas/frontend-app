import {sortBy} from 'lodash';
import AbstractCollection from '../../collection/AbstractCollection';
import Substance from './Substance';

class Transport extends AbstractCollection {

    static fromQuery(query) {
        return Transport.fromObject(query)
    }

    static fromObject(query) {
        if (!Array.isArray(query)) {
            throw new Error('Transport expected to be an Array.');
        }

        const transport = new Transport();
        query.forEach(b => {
            transport.addSubstance(Substance.fromObject(b));
        });
        return transport;
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

    get boundaries() {
        return sortBy(this._items, [(b) => b.name.toUpperCase()]);
    }

    toObject = () => {
        return this.boundaries.map(b => b.toObject())
    };
}

export default Transport;
