class Collection {
    _items = [];

    get all() {
        return this._items;
    }

    get items() {
        return this._items;
    }

    set items(value) {
        this._items = value;
    }

    checkInput(item) {
        if (!item) {
            throw new Error('No item provided to collection.');
        }
    }

    findBy(property, value, first = false) {
        const result = this._items.filter(item => item[property] === value);
        return first ? result[0] : result;
    }

    add(item) {
        this.checkInput(item);
        this._items.push(item);
    }

    remove(item) {
        this.checkInput(item);
        this.items = this.all.filter(o => o.id !== item.id);
    }

    update(item, createIfNotExisting = true) {
        this.checkInput(item);
        let isNew = true;

        this.items = this.all.map(i => {
            if (i.id === item.id) {
                isNew = false;
                return item;
            }
            return i;
        });

        if (!isNew && createIfNotExisting) {
            this.add(item);
        }
    }

}

export default Collection;