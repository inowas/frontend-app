import Criterion from './Criterion';
import AbstractCollection from '../../AbstractCollection';

class CriteriaCollection extends AbstractCollection {
    static fromArray(array) {
        const cc = new CriteriaCollection();
        cc.criteria = array.map(c => Criterion.fromObject(c));
        return cc;
    }

    get criteria() {
        return this._items;
    }

    set criteria(value) {
        this._items = value || [];
    }

    toArray() {
        return this.all.map(c => c.toObject());
    }
}

export default CriteriaCollection;