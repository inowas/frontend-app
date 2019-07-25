import {IPropertyValueObject} from '../../../types';
import {FlopySeawatSwt} from '../swt';
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

    private _enabled = false;
    private _packages: IPropertyValueObject = {};

    constructor() {
        this.setPackage(new FlopyModpathMp7());
    }

    public setPackage(p: ModpathPackage) {
        for (const name in packagesMap) {
            if (p instanceof packagesMap[name]) {
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
            if (p instanceof packagesMap[name]) {
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
}

export default FlopyModpath;
