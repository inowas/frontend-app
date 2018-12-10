class AbstractCollection {

    _items = [];

    set items(value) {
        this._items = value;
    }

    get all() {
        return this._items;
    }

    get length() {
        return this._items.length;
    };

    get first() {
        return this._items[0];
    }

    add(item) {
        this.validateInput(item);
        this._items.push(item);
    }

    removeBy(property, value) {
        this.items = this._items.filter(item => item[property] !== value);
    }

    remove(value) {
        this.removeBy('id', value);
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
    }

    validateInput(item) {
        if (!item) {
            throw new Error('No item provided to collection.');
        }
    }

    findBy(property, value, first = false) {
        const items = this.all.filter(item => item[property] === value);

        if (first) {
            return items[0] || null;
        }

        return items || [];
    }
}

export default AbstractCollection;
