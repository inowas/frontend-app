export default class FlopyModflowPackage {

    _model;
    _enabled;

    static fromObject(obj) {
        const self = new this();
        for (const key in obj) {
            // noinspection JSUnfilteredForInLoop
            self['_' + key] = obj[key]
        }
        return self;
    }

    constructor(model = null, obj = {}) {
        this._model = model;
        for (const key in obj) {
            // noinspection JSUnfilteredForInLoop
            this[key] = obj[key]
        }
    }

    get model() {
        return this._model;
    }

    get enabled() {
        return this._enabled;
    }

    set enabled(value) {
        this._enabled = value;
    }

    toObject() {
        const ignoreProps = ['_model'];
        const obj = {};
        for (let prop in this) {
            if (this.hasOwnProperty(prop) && ignoreProps.indexOf(prop) === -1) {
                prop = prop.substr(1);
                obj[prop] = this[prop];
            }
        }

        return obj;
    }
}