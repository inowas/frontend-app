import {
    FlopyModpathMp7,
    FlopyModpathMp7bas,
    FlopyModpathMp7particledata,
    FlopyModpathMp7particlegroup,
    FlopyModpathMp7sim
} from './index';
import {IPropertyValueObject} from '../../../types';
import {ModpathPackage} from './types';
import {ZonesCollection} from '../../../modflow/soilmodel';
import FlopyModpathPackage from './FlopyModpathPackage';

const packagesMap: IPropertyValueObject = {
    mp7: FlopyModpathMp7,
    mp7bas: FlopyModpathMp7bas,
    mp7particledata: FlopyModpathMp7particledata,
    mp7particlegroup: FlopyModpathMp7particlegroup,
    mp7sim: FlopyModpathMp7sim
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

    get zones(): ZonesCollection {
        return this._meta.zones;
    }

    set zones(value: ZonesCollection) {
        this._meta.zones = value;
    }

    public static fromObject(obj: IPropertyValueObject): FlopyModpath {
        const self = new this();
        self.enabled = obj.enabled || false;
        return self;
    }

    public static create() {
        return FlopyModpath.fromObject({});
    }

    private _enabled = false;
    private _meta: {
        zones: ZonesCollection
    } = {
        zones: new ZonesCollection()
    };
    private _packages: IPropertyValueObject = {};

    constructor() {
        this.setPackage(new FlopyModpathMp7());
    }

    public recalculate = () => {
        const mp7 = this.hasPackage('mp7') ? this.getPackage('mp7') : FlopyModpathMp7.create(this);
        this.setPackage(mp7);

        const mp7bas = this.hasPackage('mp7bas') ? this.getPackage('mp7bas') : FlopyModpathMp7bas.create(this);
        this.setPackage(mp7bas);
    };

    public setPackage(p: FlopyModpathPackage) {
        for (const name in packagesMap) {
            // eslint-disable-next-line no-prototype-builtins
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
            // eslint-disable-next-line no-prototype-builtins
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
            enabled: this.enabled
        };

        for (const prop in this.packages) {
            // eslint-disable-next-line no-prototype-builtins
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
            // eslint-disable-next-line no-prototype-builtins
            if (this.packages.hasOwnProperty(prop)) {
                obj[prop] = this.packages[prop].toObject();
            }
        }

        return obj;
    };
}

export default FlopyModpath;
