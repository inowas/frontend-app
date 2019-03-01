export default class FlopyModflowSerializable {

    static fromObject(obj) {
        const self = new this();
        for (const key in obj) {
            // noinspection JSUnfilteredForInLoop
            self['_' + key] = obj[key]
        }
        return self;
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
}
