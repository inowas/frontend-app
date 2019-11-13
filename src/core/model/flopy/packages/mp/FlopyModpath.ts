import {ZonesCollection} from '../../../modflow/soilmodel';
import {IPropertyValueObject} from '../../../types';
import FlopyModpathPackage from './FlopyModpathPackage';
import {
    FlopyModpathMp7,
    FlopyModpathMp7bas,
    FlopyModpathMp7particledata,
    FlopyModpathMp7particlegroup,
    FlopyModpathMp7sim
} from './index';
import {ModpathPackage} from './types';

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

    public static fromObject(obj: IPropertyValueObject) {
        const self = new this();
        self.enabled = obj.enabled;
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
            enabled: this.enabled
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
