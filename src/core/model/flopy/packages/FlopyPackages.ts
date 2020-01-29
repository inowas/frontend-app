import md5 from 'md5';
import {validate as jsonSchemaValidate} from '../../../../services/jsonSchemaValidator';
import {ModflowModel, Transport, VariableDensity} from '../../modflow';
import BoundaryCollection from '../../modflow/boundaries/BoundaryCollection';
import Soilmodel from '../../modflow/soilmodel/Soilmodel';
import {IPropertyValueObject} from '../../types';
import {IFlopyCalculation, IFlopyPackages} from './FlopyPackages.type';
import FlopyModflow from './mf/FlopyModflow';
import FlopyModpath from './mp/FlopyModpath';
import FlopyMt3d from './mt/FlopyMt3d';
import FlopySeawat from './swt/FlopySeawat';

import {JSON_SCHEMA_URL} from '../../../../services/api';

export default class FlopyPackages {

    get version() {
        return this._version;
    }

    get author() {
        return this._author;
    }

    set author(value) {
        this._author = value;
    }

    get project() {
        return this._project;
    }

    set project(value) {
        this._project = value;
    }

    get calculation_id() {
        return this.hash(this.getData());
    }

    get modelId() {
        return this._modelId;
    }

    set modelId(value) {
        this._modelId = value;
    }

    get mf() {
        if (this._mf) {
            return this._mf;
        }

        throw new Error('Mf has to be instance of FlopyModflow');
    }

    set mf(value) {
        this._mf = value;
    }

    get mp() {
        if (this._mp) {
            return this._mp;
        }

        throw new Error('Mp has to be instance of FlopyModpath');
    }

    set mp(value) {
        this._mp = value;
    }

    get mt() {
        if (this._mt) {
            return this._mt;
        }

        throw new Error('Mt has to be instance of FlopyMt3d');
    }

    set mt(value) {
        this._mt = value;

        if (this.mf) {
            this.mf.setTransportEnabled(value.enabled);
        }
    }

    get swt() {
        if (this._swt) {
            return this._swt;
        }

        throw new Error('Swt has to be instance of FlopySeawat');
    }

    set swt(value) {
        this._swt = value;
    }

    public static createFromModelInstances(
        model: ModflowModel,
        soilmodel: Soilmodel,
        boundaries: BoundaryCollection,
        transport: Transport,
        variableDensity: VariableDensity
    ) {
        const mf = FlopyModflow.create(model, soilmodel, boundaries);
        const modpath = new FlopyModpath();
        const mt = FlopyMt3d.createFromTransport(transport, boundaries);
        const swt = FlopySeawat.createFromVariableDensity(variableDensity);
        return FlopyPackages.create(model.id, mf, modpath, mt, swt);
    }

    public static create(modelId: string, mf: FlopyModflow, mp: FlopyModpath, mt: FlopyMt3d, swt: FlopySeawat) {

        const self = new this();
        self.modelId = modelId;
        self.mf = mf;
        self.mp = mp;
        self.mt = mt;
        self.mf.setTransportEnabled(mt.enabled);
        self.swt = swt;

        return self;
    }

    public static fromQuery(obj: any) {
        if (Array.isArray(obj) && obj.length === 0) {
            return null;
        }

        return FlopyPackages.fromObject(obj);
    }

    public static fromObject(obj: IFlopyPackages) {
        const mf = FlopyModflow.fromObject(obj.mf);
        const mp = obj.mp ? FlopyModpath.fromObject(obj.mp) : new FlopyModpath();
        const mt = FlopyMt3d.fromObject(obj.mt);
        const swt = obj.swt ? FlopySeawat.fromObject(obj.swt) : new FlopySeawat();
        const modelId = obj.model_id;

        const self = new this();
        self._modelId = modelId;
        self._mf = mf;
        self._mf.setTransportEnabled(mt.enabled);
        self._mp = mp;
        self._mt = mt;
        self._swt = swt;
        self._version = obj.version;
        self._author = obj.author;
        self._project = obj.project;
        return self;
    }

    private _version = '3.2.12';
    private _author = '';
    private _project = '';

    private _modelId: string | null = null;

    private _mf: FlopyModflow | null = null;
    private _mp: FlopyModpath | null = null;
    private _mt: FlopyMt3d | null = null;
    private _swt: FlopySeawat | null = null;

    public update = (
        model: ModflowModel,
        soilmodel: Soilmodel,
        boundaries: BoundaryCollection,
        transport: Transport,
        variableDensity: VariableDensity
    ) => {
        this.mf = this.mf.recalculate(model, soilmodel, boundaries);
        this.mf.setTransportEnabled(transport.enabled);
        this.mt = this.mt.update(transport, boundaries);
        this.swt = this.swt.update(variableDensity);
        return this;
    };

    public getData = () => {
        const data: any = {};

        if (this.mf) {
            data.mf = this.mf.toFlopyCalculation();
        }

        if (this.mp && this.mp.enabled) {
            data.mp = this.mp.toCalculation();
        }

        if (this.mt && this.mt.enabled) {
            data.mt = this.mt.toFlopyCalculation();
        }

        if (this.swt && this.swt.enabled && this.mt && this.mt.enabled) {
            data.swt = this.swt.toFlopyCalculation();
        }

        return data;
    };

    public toObject(): IFlopyPackages {
        return {
            author: this.author,
            project: this.project,
            version: this.version,
            model_id: this.modelId || '',
            mf: this.mf.toObject(),
            mp: this.mp ? this.mp.toObject() : null,
            mt: this.mt ? this.mt.toObject() : null,
            swt: this.swt ? this.swt.toObject() : null
        };
    }

    public toFlopyCalculation(): IFlopyCalculation {
        return {
            author: this.author,
            project: this.project,
            version: this.version,
            calculation_id: this.calculation_id,
            model_id: this.modelId || '',
            data: this.getData()
        };
    }

    public sort = (object: IPropertyValueObject) => {
        const sortedObj: IPropertyValueObject = {};
        const keys = Object.keys(object);

        keys.sort((key1, key2) => {
            key1 = key1.toLowerCase();
            key2 = key2.toLowerCase();

            if (key1 < key2) {
                return -1;
            }
            if (key1 > key2) {
                return 1;
            }
            return 0;
        });

        for (const index in keys) {
            if (keys.hasOwnProperty(index)) {
                const key = keys[index];
                if (typeof object[key] === 'object' && !(object[key] instanceof Array) && !(object[key] === null)) {
                    sortedObj[key] = this.sort(object[key]);
                } else {
                    sortedObj[key] = object[key];
                }
            }
        }

        return sortedObj;
    };

    public hash = (data: IPropertyValueObject) => {
        const sorted = this.sort(data);
        return md5(JSON.stringify(sorted));
    };

    public validate(forCalculationServer = true) {

        if (forCalculationServer) {
            return jsonSchemaValidate(
                this.toFlopyCalculation(),
                JSON_SCHEMA_URL + '/modflow/packages/flopyCalculation.json'
            );
        }

        return jsonSchemaValidate(
            this.toObject(),
            JSON_SCHEMA_URL + '/modflow/packages/flopyCalculationPackages.json'
        );
    }
}
