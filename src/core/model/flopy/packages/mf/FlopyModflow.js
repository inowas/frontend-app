import FlopyModflowMf from './FlopyModflowMf';
import FlopyModflowMfbas from './FlopyModflowMfbas';
import FlopyModflowMfbcf from './FlopyModflowMfbcf';
import FlopyModflowMfchd from './FlopyModflowMfchd';
import FlopyModflowMfdis from './FlopyModflowMfdis';
import FlopyModflowMfghb from './FlopyModflowMfghb';
import FlopyModflowMfhob from './FlopyModflowMfhob';
import FlopyModflowMflpf from './FlopyModflowMflpf';
import FlopyModflowMfoc from './FlopyModflowMfoc';
import FlopyModflowMfpcg from './FlopyModflowMfpcg';
import FlopyModflowMfrch from './FlopyModflowMfrch';
import FlopyModflowMfriv from './FlopyModflowMfriv';
import FlopyModflowMfwel from './FlopyModflowMfwel';
import FlopyModflowSerializable from '../FlopyModflowSerializable';

import {BoundaryCollection, ModflowModel, Soilmodel} from 'core/model/modflow';
import {delc, delr} from 'services/geoTools/distance';

const packagesMap = {
    'mf': FlopyModflowMf,
    'bas': FlopyModflowMfbas,
    'bcf': FlopyModflowMfbcf,
    'chd': FlopyModflowMfchd,
    'dis': FlopyModflowMfdis,
    'ghb': FlopyModflowMfghb,
    'hob': FlopyModflowMfhob,
    'lpf': FlopyModflowMflpf,
    'oc': FlopyModflowMfoc,
    'pcg': FlopyModflowMfpcg,
    'rch': FlopyModflowMfrch,
    'riv': FlopyModflowMfriv,
    'wel': FlopyModflowMfwel
};

export default class FlopyModflow extends FlopyModflowSerializable {

    _packages = {};

    static createFromModel(model, soilmodel, boundaries) {

        if (!(model instanceof ModflowModel)) {
            throw new Error('Expecting instance of ModflowModel')
        }

        if (!(soilmodel instanceof Soilmodel)) {
            throw new Error('Expecting instance of Soilmodel')
        }

        if (!(boundaries instanceof BoundaryCollection)) {
            throw new Error('Expecting instance of BoundaryCollection')
        }

        const self = new this();
        self.setDiscretization(model, soilmodel);
        self.setBoundaries(boundaries);
        self.setFlowPackage('lpf', soilmodel);
        self.setSolver('pcg');
        self.setDefaultOutputControl(model.stressperiods.count);

        return self;
    }

    static fromObject(obj) {
        const self = new this();
        for (const prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                self.setPackage(packagesMap[prop].fromObject(obj[prop]))
            }
        }
        return self;
    }

    constructor() {
        super();
        this.setPackage(FlopyModflowMf.create(null, {}));
    }

    updateDiscretization = (model, soilmodel, boundaries) => {
        if (!(model instanceof ModflowModel)) {
            throw new Error('Expecting instance of ModflowModel')
        }

        if (!(soilmodel instanceof Soilmodel)) {
            throw new Error('Expecting instance of Soilmodel')
        }

        if (!(boundaries instanceof BoundaryCollection)) {
            throw new Error('Expecting instance of BoundaryCollection')
        }

        this.setDiscretization(model, soilmodel);
        this.setBoundaries(boundaries);
    };

    updateBoundaries = boundaries => {

        if (!(boundaries instanceof BoundaryCollection)) {
            throw new Error('Expecting instance of BoundaryCollection')
        }

        const self = new this();
        this.setBoundaries(boundaries);

        return self;
    };

    setDiscretization(model, soilmodel) {
        if (!(model instanceof ModflowModel)) {
            throw new Error('Expecting instance of ModflowModel')
        }

        if (!(soilmodel instanceof Soilmodel)) {
            throw new Error('Expecting instance of Soilmodel')
        }

        const mfDis = FlopyModflowMfdis.create(null, {});
        mfDis.nlay = soilmodel.layersCollection.length;
        mfDis.nrow = model.gridSize.nY;
        mfDis.ncol = model.gridSize.nX;
        mfDis.nper = model.stressperiods.count;
        mfDis.delr = delr(model.boundingBox, model.gridSize);
        mfDis.delc = delc(model.boundingBox, model.gridSize);
        mfDis.laycbd = 0;

        const layers = soilmodel.layersCollection.orderBy('number').all;
        mfDis.top = layers[0].top;
        mfDis.botm = layers.map(l => l.botm);

        mfDis.perlen = model.stressperiods.stressperiods.map(sp => sp.perlen);
        mfDis.nstp = model.stressperiods.stressperiods.map(sp => sp.nstp);
        mfDis.tsmult = model.stressperiods.stressperiods.map(sp => sp.tsmult);
        mfDis.steady = model.stressperiods.stressperiods.map(sp => sp.steady);

        mfDis.itmuni = model.timeUnit;
        mfDis.lenuni = model.lengthUnit;

        mfDis.xul = model.boundingBox.xMin;
        mfDis.yul = model.boundingBox.yMax;
        mfDis.rotation = 0;
        mfDis.proj4_str = 'EPSG:3857';
        mfDis.start_date_time = model.stressperiods.startDateTime;

        this.setPackage(mfDis);

        const mfBas = FlopyModflowMfbas.create(null, {});
        mfBas.iBound = model.cells.calculateIBound(mfDis.nlay, mfDis.nrow, mfDis.ncol);
        mfBas.strt = mfDis.top;
        this.setPackage(mfDis);
    }

    setBoundaries = (boundaries) => {
        if (!(boundaries instanceof BoundaryCollection)) {
            throw new Error('Expecting instance of BoundaryCollection')
        }

        const mfDis = this.getPackage('dis');
        const {nper, nrow, ncol} = mfDis;

        // CHDs
        const mfChd = FlopyModflowMfchd.create();
        this.removePackageIfExists(mfChd);

        let spData = FlopyModflowMfchd.calculateSpData(boundaries, nper);
        if (spData) {
            const mfChd = FlopyModflowMfchd.create();
            mfChd.stress_period_data = spData;
            this.setPackage(mfChd);
        }


        // GHBs
        const mfGhb = FlopyModflowMfghb.create();
        this.removePackageIfExists(mfGhb);

        spData = FlopyModflowMfghb.calculateSpData(boundaries, nper);
        if (spData) {
            mfGhb.stress_period_data = spData;
            this.setPackage(mfGhb);
        }

        // RCHs
        const mfRch = FlopyModflowMfrch.create();
        this.removePackageIfExists(mfRch);
        spData = FlopyModflowMfrch.calculateSpData(boundaries, nper, nrow, ncol);
        if (spData) {
            mfRch.rech = spData;
            this.setPackage(mfRch);
        }

        // RIV
        const mfRiv = FlopyModflowMfriv.create();
        this.removePackageIfExists(mfRiv);
        spData = FlopyModflowMfriv.calculateSpData(boundaries, nper);
        if (spData) {
            mfRiv.stress_period_data = spData;
            this.setPackage(mfRiv);
        }

        // WEL
        const mfWel = FlopyModflowMfwel.create();
        this.removePackageIfExists(mfWel);
        spData = FlopyModflowMfwel.calculateSpData(boundaries, nper);
        if (spData) {
            mfWel.stress_period_data = spData;
            this.setPackage(mfWel);
        }
    };

    setFlowPackage = (type, soilmodel) => {

        const layers = soilmodel.layersCollection.orderBy('number').all;

        if (!(soilmodel instanceof Soilmodel)) {
            throw new Error('Expecting instance of Soilmodel')
        }

        if (type === 'lpf') {
            const mfLpf = FlopyModflowMflpf.create();
            mfLpf.laytyp = layers.map(l => l.laytyp);
            mfLpf.layavg = layers.map(l => l.layavg);
            mfLpf.chani = layers.map(() => 0);
            mfLpf.layvka = layers.map(() => 0);
            mfLpf.laywet = layers.map(l => l.laywet);
            mfLpf.hk = layers.map(l => l.hk);
            mfLpf.hani = layers.map(l => l.hani);
            mfLpf.vka = layers.map(l => l.vka);
            mfLpf.ss = layers.map(l => l.ss);
            mfLpf.sy = layers.map(l => l.sy);
            this.setPackage(mfLpf);
        }

        throw new Error('FlowPackage from type ' + type + 'is not implemented.');
    };

    setSolver = type => {
        switch (type) {
            case 'pcg':
                return this.setPackage(FlopyModflowMfpcg.create());
            default:
                throw new Error('Solver from type ' + type + 'is not implemented.');
        }
    };

    setDefaultOutputControl = nper => {

        const spData = [];
        for (let per = 0; per < nper; per++) {
            spData.push([[per, 0], ['save head', 'save drawdown', 'save budget']]);
        }

        const mfOc = FlopyModflowMfoc.create();
        mfOc.stress_period_data = spData;
        this.setPackage(mfOc);
    };

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

    getPackage(name) {
        if (!this._packages[name]) {
            throw new Error('Package not found');
        }

        return this._packages[name];
    }

    hasPackage(name) {
        return this.packages.hasOwnProperty(name);
    }

    removePackageIfExists(p) {
        for (const name in packagesMap) {
            if (p instanceof packagesMap[name]) {
                delete this._packages[name];
                return;
            }
        }
    }

    toObject() {
        const obj = {};
        for (let prop in this.packages) {
            if (this.packages.hasOwnProperty(prop)) {
                obj[prop] = this.packages[prop].toObject();
            }
        }

        return obj;
    }

    toFlopyCalculation = () => {
        const obj = {
            packages: Object.keys(this.packages)
        };

        for (const prop in this.packages) {
            if (this.packages.hasOwnProperty(prop)) {
                obj[prop] = this.packages[prop].toObject();
            }
        }

        return obj;
    }
}
