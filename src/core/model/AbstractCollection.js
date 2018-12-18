import {orderBy as _orderBy} from 'lodash';

class AbstractCollection {

    _items = [];

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

    findBy(property, value, first = false) {
        const items = this.all.filter(item => item[property] === value);
        if (first) {
            return items[0] || null;
        }

        return items || [];
    }

    findById(value) {
        return this.findBy('id', value, true);
    }

    orderBy(property, order = 'asc') {
        this._items = _orderBy(this._items, [property], [order]);
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

    toArray() {
        return this.all.map(item => item.toObject());
    }

    update(updatedItem, createIfNotExisting = true) {
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
