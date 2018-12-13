import Ajv from 'ajv';
import AbstractMt3dPackage from './AbstractMt3dPackage';
import AdvPackage from './AdvPackage';
import BtnPackage from './BtnPackage';
import DspPackage from './DspPackage';
import GcgPackage from './GcgPackage';
import Mt3dPackageFactory from './Mt3dPackageFactory';
import MtPackage from './MtPackage';
import SsmPackage from './SsmPackage';
import {includes} from 'lodash';

class mt3dms {

    _enabled = false;

    _availablePackages = ['mt', 'btn', 'adv', 'dsp', 'gcg', 'ssm'];

    _packages = {
        'mt': MtPackage.fromDefault(),
        'btn': BtnPackage.fromDefault(),
        'adv': AdvPackage.fromDefault(),
        'dsp': DspPackage.fromDefault(),
        'gcg': GcgPackage.fromDefault(),
        'ssm': SsmPackage.fromDefault()
    };

    static fromDefaults() {
        return new mt3dms();
    }

    static fromObject(obj) {
        const mt = new mt3dms();
        mt.enabled = obj.enabled;
        obj.packages.forEach(packageName => {
            const mt3dPackage = Mt3dPackageFactory.fromData(obj[packageName]);
            if (mt3dPackage) {
                mt.addPackage(mt3dPackage);
            }
        });

        return mt;
    }

    get enabled() {
        return this._enabled;
    }

    toggleEnabled() {
        this._enabled = !this._enabled;
    }

    set enabled(value) {
        this._enabled = value;
    }

    get packages() {
        return this._packages;
    }

    get availablePackages() {
        return this._availablePackages;
    }

    addPackage = (p) => {
        if (!(p instanceof AbstractMt3dPackage)) {
            throw new Error('Package is not from type AbstractMt3dPackage');
        }

        if (!includes(this.availablePackages, p.packageName)) {
            throw new Error('Package is not in list of available Packages');
        }

        this.packages[p.packageName] = p;
    };

    getPackage = (packageName) => {
        if (this.packages.hasOwnProperty(packageName)) {
            return this.packages[packageName];
        }

        throw new Error('Package with packageName: ' + packageName + ' not found.');
    };

    get toObject() {
        const obj = {
            enabled: this.enabled,
            packages: Object.keys(this.packages)
        };

        for (const key in this.packages) {
            if (this.packages.hasOwnProperty(key)) {
                const p = this.packages[key];
                obj[p.packageName] = p.toObject;
            }
        }

        return obj;
    }

    validate() {
        const schema = require('./mt3dms.schema.json');
        const ajv = new Ajv({schemaId: 'id'});
        ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
        const validate = ajv.compile(schema);
        return [validate(this.toObject), validate.errors];
    }
}

export default mt3dms;
