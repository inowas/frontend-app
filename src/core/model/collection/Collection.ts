import * as _ from 'lodash';

interface IItem {
    id: string;

    [key: string]: any;
}

export abstract class Collection<T extends IItem> {

    private _items: T[] = [];

    public constructor(array: T[] = []) {
        this.items = array;
    }

    set items(value: T[]) {
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
    }

    public add(item: T) {
        this._items.push(item);
        return this;
    }

    public filterBy(property: string, value: any) {
        return this._items.filter((item) => (item[property].toLowerCase()).indexOf(value.toLowerCase()) > -1);
    }

    public findBy(property: string, value: any, equal: boolean = true) {
        const items = this.all.filter((item) => {
            if (equal) {
                return item[property] === value;
            }
            return item[property] !== value;
        });
        return items || [];
    }

    public findFirstBy(property: string, value: any, equal: boolean = true) {
        const items = this.findBy(property, value, equal);
        return items.length > 0 ? items[0] : null;
    }

    public findById(value: string) {
        return this.findFirstBy('id', value, true);
    }

    public orderBy(properties: string | string[], orders: 'asc' | 'desc' = 'asc') {
        this._items = _.orderBy(
            this._items,
            Array.isArray(properties) ? properties : [properties],
            Array.isArray(orders) ? orders : [orders]
        );
        return this;
    }

    public removeById(id: string) {
        this.removeBy('id', id);
        return this;
    }

    public removeBy(property: string, value: any) {
        this.items = this._items.filter((item) => item[property] !== value);
        return this;
    }

    public sumBy(property: string) {
        return this._items.reduce((sum, item) => {
            return sum + item[property];
        }, 0);
    }

    public update(updatedItem: T, createIfNotExisting: boolean = true) {
        let isNew = true;

        this._items = this._items.map((item) => {
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
}
