import md5 from 'md5';

export default class FlopyModflowSerializable {

    static fromObject(obj) {
        const self = new this();
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                self['_' + key] = obj[key]
            }
        }
        return self;
    }

    get packages() {
        throw new Error('The getter for packages has to be implemented.');
    }

    toObject() {
        const obj = {};
        for (let prop in this) {
            if (this.hasOwnProperty(prop) && prop.startsWith('_')) {
                prop = prop.substr(1);
                obj[prop] = this[prop];
            }
        }

        return obj;
    }

    sort = (object) => {
        const sortedObj = {};
        const keys = Object.keys(object);

        keys.sort((key1, key2) => {
            key1 = key1.toLowerCase();
            key2 = key2.toLowerCase();

            if (key1 < key2) return -1;
            if (key1 > key2) return 1;
            return 0;
        });

        for (let index in keys) {
            const key = keys[index];
            if (typeof object[key] == 'object' && !(object[key] instanceof Array) && !(object[key] === null)) {
                sortedObj[key] = this.sort(object[key]);
            } else {
                sortedObj[key] = object[key];
            }
        }

        return sortedObj;
    };

    hash = (data) => {
        const sorted = this.sort(data);
        return md5(JSON.stringify(sorted));
    }
}
