import * as _ from 'lodash';

class AbstractCollection {

    _items = [];

    static fromArray(array) {
        const ac = new AbstractCollection();
        ac.items = array.map(item => ac.validateInput(item));
        return ac;
    }

    set items(value) {
        this._items = value;
    }

    get all() {
        return this._items;
    }

    get first() {
        return this._items[0];
    }

    get length() {
        return this._items.length;
    };

    add(item) {
        this._items.push(this.validateInput(item));
        return this;
    }

    filterBy(property, value) {
        return this._items.filter(item => (item[property].toLowerCase()).indexOf(value.toLowerCase()) > -1)
    }

    findBy(property, value, options) {
        options = _.defaults({}, _.clone(options), {
            first: false,               // If set to true, findBy only returns the first found element or null
            equal: true,                // If set to true, === is used for comparison, otherwise !== is used
            returnCollection: false     // If set to true, findBy returns a new AbstractCollection, otherwise an array is returned
        });
        const items = this.all.filter(item => {
            if (options.equal) {
                return item[property] === value;
            }
            return item[property] !== value;
        });

        if (options.first) {
            return items[0] || null;
        }

        if (options.returnCollection) {
            return AbstractCollection.fromArray(items);
        }

        return items || [];
    }

    findById(value) {
        return this.findBy('id', value, {first: true});
    }

    orderBy(properties, orders = 'asc') {
        this._items = _.orderBy(this._items, Array.isArray(properties) ? properties : [properties], Array.isArray(orders) ? orders : [orders]);
        return this;
    }

    remove(value) {
        this.removeBy('id', value);
        return this;
    }

    removeBy(property, value) {
        this.items = this._items.filter(item => item[property] !== value);
        return this;
    }

    sumBy(property) {
        return this._items.reduce((sum, item) => {
            return sum + item[property];
        }, 0);
    }

    toArray() {
        return _.cloneDeep(this.all.map(item => item.toObject()));
    }

    update(updatedItem, createIfNotExisting = true) {
        this.validateInput(updatedItem);
        let isNew = true;

        this._items = this._items.map(item => {
            if (item.id === updatedItem.id) {
                isNew = false;
                return updatedItem;
            }

            return item;
        });

        if (isNew && createIfNotExisting) {
            this.add(updatedItem);
        }

        return this;
    }

    validateInput(item) {
        if (!item) {
            throw new Error('No item provided to collection.');
        }
        return item;
    }
}

export default AbstractCollection;
