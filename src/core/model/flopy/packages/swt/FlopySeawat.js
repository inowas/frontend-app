import {VariableDensity} from '../../../modflow';
import {FlopySeawatSwt, FlopySeawatSwtvdf, FlopySeawatSwtvsc} from './index';

const packagesMap = {
    'swt': FlopySeawatSwt,
    'vdf': FlopySeawatSwtvdf,
    'vsc': FlopySeawatSwtvsc,
};

class FlopySeawat {

    _enabled = false;

    _packages = {};

    static createFromVariableDensity(variableDensity) {

        if (!(variableDensity instanceof VariableDensity)) {
            throw new Error('Expecting instance of VariableDensity')
        }

        const swt = new this();
        swt.enabled = variableDensity.enabled;

        if (variableDensity.vdfEnabled) {
            FlopySeawatSwtvdf.create(swt, {});

            if (variableDensity.vscEnabled) {
                FlopySeawatSwtvsc.create(swt, {});
            }
        }

        return swt;
    }

    static fromObject(obj) {
        const self = new this();
        self.enabled = obj.enabled;
        for (const prop in obj) {
            if (prop !== '_meta' && prop !== 'enabled') {
                if (obj.hasOwnProperty(prop)) {
                    self.setPackage(packagesMap[prop].fromObject(obj[prop]))
                }
            }
        }
        return self;
    }

    constructor() {
        this.setPackage(FlopySeawatSwt.create());
    }

    recalculate = (variableDensity) => {

        if (!(variableDensity instanceof VariableDensity)) {
            throw new Error('Expecting instance of VariableDensity')
        }

        this.enabled = variableDensity.enabled;

        if (variableDensity.vdfEnabled) {
            const swtVdf = this.hasPackage('vdf') ? this.getPackage('vdf') : FlopySeawatSwtvdf.create(null, {});
            this.setPackage(swtVdf);
        }
        if (variableDensity.vscEnabled) {
            const swtVsc = this.hasPackage('vsc') ? this.getPackage('vsc') : FlopySeawatSwtvsc.create(null, {});
            this.setPackage(swtVsc);
        }
    };

    get enabled() {
        return this._enabled;
    }

    // noinspection JSUnusedGlobalSymbols
    toggleEnabled() {
        this._enabled = !this._enabled;
    }

    set enabled(value) {
        this._enabled = value;
    }

    get packages() {
        return this._packages;
    }

    setPackage(p) {
        for (const name in packagesMap) {
            if (p instanceof packagesMap[name]) {
                this._packages[name] = p;
                return;
            }
        }

        throw new Error('Package ' + p.constructor.name + ' not found in PackageMap.')
    }

    hasPackage(name) {
        return !!this._packages[name];
    }

    // noinspection JSMethodCanBeStatic
    getPackageType(p) {
        let type = null;
        for (const name in packagesMap) {
            if (p instanceof packagesMap[name]) {
                type = name;
            }
        }

        return type;
    }

    getPackage(name) {
        if (!this._packages[name]) {
            throw new Error('Package not found');
        }

        return this._packages[name];
    }

    toObject() {
        const obj = {
            enabled: this.enabled
        };

        for (let prop in this.packages) {
            if (this.packages.hasOwnProperty(prop)) {
                obj[prop] = this.packages[prop].toObject();
            }
        }

        return obj;
    }

    toFlopyCalculation = () => {
        if (!this.enabled) {
            return null;
        }

        const obj = {
            packages: Object.keys(this.packages)
        };

        for (const prop in this.packages) {
            if (this.packages.hasOwnProperty(prop)) {
                obj[prop] = this.packages[prop].toObject();
            }
        }

        return obj;
    };
}

export default FlopySeawat;
