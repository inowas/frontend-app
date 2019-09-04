import {IZone} from '../../../gis/Zone.type';
import {IPropertyValueObject} from '../../../types';
import FlopyModpathPackage from './FlopyModpathPackage';
import {
    FlopyModpathMp,
    FlopyModpathMpbas,
    FlopyModpathMpsim
} from './index';
import {ModpathPackage} from './types';

const packagesMap: IPropertyValueObject = {
    mp: FlopyModpathMp,
    mpbas: FlopyModpathMpbas,
    mpsim: FlopyModpathMpsim
};

class FlopyModpath {

    get enabled(): boolean {
        return this._enabled;
    }

    set enabled(value: boolean) {
        this._enabled = value;
    }

    get packages() {
        return this._packages;
    }

    get meta() {
        return this._meta;
    }

    public static fromObject(obj: IPropertyValueObject) {
        const self = new this();
        self.enabled = obj.enabled;
        self._meta = obj._meta;
        for (const prop in obj) {
            if (prop !== '_meta' && prop !== 'enabled') {
                if (obj.hasOwnProperty(prop)) {
                    self.setPackage(packagesMap[prop].fromObject(obj[prop]));
                }
            }
        }
        return self;
    }

    private _enabled: boolean = false;
    private _meta: {
        particleZones: IZone[]
    } = {
        particleZones: []
    };
    private _packages: IPropertyValueObject = {};

    constructor() {
        this.setPackage(new FlopyModpathMp());
    }

    public recalculate = () => {
        const mp7 = this.hasPackage('mp') ? this.getPackage('mp') : FlopyModpathMp.create(this);
        this.setPackage(mp7);

        const mp7bas = this.hasPackage('mpbas') ? this.getPackage('mpbas') : FlopyModpathMpbas.create(this);
        this.setPackage(mp7bas);

        const mp7sim = this.hasPackage('mpsim') ? this.getPackage('mpsim') : FlopyModpathMpsim.create(this);
        this.setPackage(mp7sim);
    };

    public setPackage(p: FlopyModpathPackage) {
        for (const name in packagesMap) {
            if (packagesMap.hasOwnProperty(name) && p instanceof packagesMap[name]) {
                this._packages[name] = p;
                return;
            }
        }

        throw new Error('Package ' + p.constructor.name + ' not found in PackageMap.');
    }

    public hasPackage(name: string) {
        return !!this._packages[name];
    }

    // noinspection JSMethodCanBeStatic
    public getPackageType(p: ModpathPackage) {
        let type = null;
        for (const name in packagesMap) {
            if (packagesMap.hasOwnProperty(name) && p instanceof packagesMap[name]) {
                type = name;
            }
        }

        return type;
    }

    public getPackage(name: string) {
        if (!this._packages[name]) {
            throw new Error('Package not found');
        }

        return this._packages[name];
    }

    public toObject() {
        const obj: IPropertyValueObject = {
            enabled: this.enabled,
            _meta: this.meta
        };

        for (const prop in this.packages) {
            if (this.packages.hasOwnProperty(prop)) {
                obj[prop] = this.packages[prop].toObject();
            }
        }

        return obj;
    }

    public toCalculation = () => {
        if (!this.enabled) {
            return null;
        }

        const obj: IPropertyValueObject = {
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

export default FlopyModpath;
