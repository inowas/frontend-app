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

import {BoundaryCollection, ModflowModel, Soilmodel} from 'core/model/modflow';
import {delc, delr} from 'services/geoTools/distance';
import FlopyModflowMflmt from './FlopyModflowMflmt';
import FlopyModflowMfupw from './FlopyModflowMfupw';
import FlopyModflowFlowPackage from './FlopyModflowFlowPackage';


const packagesMap = {
    'mf': FlopyModflowMf,
    'bas': FlopyModflowMfbas,
    'bcf': FlopyModflowMfbcf,
    'chd': FlopyModflowMfchd,
    'dis': FlopyModflowMfdis,
    'ghb': FlopyModflowMfghb,
    'hob': FlopyModflowMfhob,
    'lpf': FlopyModflowMflpf,
    'lmt': FlopyModflowMflmt,
    'oc': FlopyModflowMfoc,
    'pcg': FlopyModflowMfpcg,
    'rch': FlopyModflowMfrch,
    'riv': FlopyModflowMfriv,
    'upw': FlopyModflowMfupw,
    'wel': FlopyModflowMfwel
};

export default class FlopyModflow {

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
        self.setFlowPackageType('lpf', soilmodel);
        self.setSolverPackage('pcg');
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
        this.setPackage(FlopyModflowMf.create());
    }

    recalculate = (model, soilmodel, boundaries) => {
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
        this.setFlowPackageType(this.getPackageType(this.getFlowPackage()), soilmodel);
        this.setDefaultOutputControl(model.stressperiods.count)
    };

    updateBoundaries = boundaries => {

        if (!(boundaries instanceof BoundaryCollection)) {
            throw new Error('Expecting instance of BoundaryCollection')
        }

        this.setBoundaries(boundaries);
    };

    setDiscretization(model, soilmodel) {
        if (!(model instanceof ModflowModel)) {
            throw new Error('Expecting instance of ModflowModel')
        }

        if (!(soilmodel instanceof Soilmodel)) {
            throw new Error('Expecting instance of Soilmodel')
        }

        const mfDis = this.hasPackage('dis') ? this.getPackage('dis') : FlopyModflowMfdis.create(null, {});
        mfDis.nlay = soilmodel.layersCollection.length;
        mfDis.nrow = model.gridSize.nY;
        mfDis.ncol = model.gridSize.nX;
        mfDis.nper = model.stressperiods.count;
        mfDis.delr = delr(model.boundingBox, model.gridSize);
        mfDis.delc = delc(model.boundingBox, model.gridSize);

        const layers = soilmodel.layersCollection.orderBy('number').all;
        mfDis.laycbd = layers.map(() => 0);
        mfDis.top = layers[0].top;
        mfDis.botm = layers.map(l => l.botm);

        const stressperiods = model.stressperiods;
        stressperiods.recalculateStressperiods();

        mfDis.perlen = stressperiods.perlens;
        mfDis.nstp = stressperiods.stressperiods.map(sp => sp.nstp);
        mfDis.tsmult = stressperiods.stressperiods.map(sp => sp.tsmult);
        mfDis.steady = stressperiods.stressperiods.map(sp => sp.steady);

        mfDis.itmuni = model.timeUnit;
        mfDis.lenuni = model.lengthUnit;

        mfDis.xul = model.boundingBox.xMin;
        mfDis.yul = model.boundingBox.yMax;
        mfDis.proj4_str = 'EPSG:3857';
        mfDis.start_datetime = stressperiods.startDateTime.format('YYYY-MM-DD');

        this.setPackage(mfDis);

        const mfBas = this.hasPackage('bas') ? this.getPackage('bas') : FlopyModflowMfbas.create(null, {});
        mfBas.ibound = model.cells.calculateIBound(mfDis.nlay, mfDis.nrow, mfDis.ncol);
        mfBas.strt = new Array(mfDis.nlay).fill(mfDis.top);
        this.setPackage(mfBas);
    }

    setBoundaries = (boundaries) => {

        if (!(boundaries instanceof BoundaryCollection)) {
            throw new Error('Expecting instance of BoundaryCollection')
        }

        const mfDis = this.getPackage('dis');
        const {nper, nrow, ncol} = mfDis;

        // CHDs
        const mfChd = this.hasPackage('chd') ? this.getPackage('chd') : FlopyModflowMfchd.create();
        this.removePackageIfExists(mfChd);

        let spData = FlopyModflowMfchd.calculateSpData(boundaries.all, nper);
        if (spData) {
            mfChd.stress_period_data = spData;
            this.setPackage(mfChd);
        }

        // GHBs
        const mfGhb = this.hasPackage('ghb') ? this.getPackage('ghb') : FlopyModflowMfghb.create();
        this.removePackageIfExists(mfGhb);

        spData = FlopyModflowMfghb.calculateSpData(boundaries.all, nper);
        if (spData) {
            mfGhb.stress_period_data = spData;
            this.setPackage(mfGhb);
        }

        // RCHs
        const mfRch = this.hasPackage('rch') ? this.getPackage('rch') : FlopyModflowMfrch.create();
        this.removePackageIfExists(mfRch);
        spData = FlopyModflowMfrch.calculateSpData(boundaries.all, nper, nrow, ncol);
        if (spData) {
            mfRch.stress_period_data = spData;
            this.setPackage(mfRch);
        }

        // RIV
        const mfRiv = this.hasPackage('riv') ? this.getPackage('riv') : FlopyModflowMfriv.create();
        this.removePackageIfExists(mfRiv);
        spData = FlopyModflowMfriv.calculateSpData(boundaries.all, nper);
        if (spData) {
            mfRiv.stress_period_data = spData;
            this.setPackage(mfRiv);
        }

        // WEL
        const mfWel = this.hasPackage('wel') ? this.getPackage('wel') :FlopyModflowMfwel.create();
        this.removePackageIfExists(mfWel);
        spData = FlopyModflowMfwel.calculateSpData(boundaries.all, nper);
        if (spData) {
            mfWel.stress_period_data = spData;
            this.setPackage(mfWel);
        }
    };

    setFlowPackageType = (type, soilmodel) => {

        const layers = soilmodel.layersCollection.orderBy('number').all;

        if (!(soilmodel instanceof Soilmodel)) {
            throw new Error('Expecting instance of Soilmodel')
        }

        if (type === 'bcf') {
            const mfBcf = FlopyModflowMfbcf.create();
            mfBcf.ipakcb = layers.map(() => 53);
            mfBcf.intercellt = layers.map(l => l.layavg);
            mfBcf.laycon = layers.map(l => l.laytyp);
            mfBcf.trpy = layers.map(l => l.hani);
            mfBcf.hdry = layers.map(() => -1e+30);
            mfBcf.iwdflg = layers.map(l => l.laywet);
            mfBcf.wetfct = layers.map(() => 0.1);
            mfBcf.iwetit = layers.map(() => 1);
            mfBcf.ihdwet = layers.map(() => 0);
            mfBcf.tran = layers.map((l, idx) => {
                if (idx === 0) {
                    return l.calculateTransmissivity(l.top);
                }
                return l.calculateTransmissivity(layers[idx - 1].botm);
            });
            mfBcf.hy = layers.map(l => l.hk);
            mfBcf.vcont = layers.map(() => 1);
            mfBcf.sf1 = layers.map(l => l.ss);
            mfBcf.sf2 = layers.map(l => l.sy);
            mfBcf.wetdry = layers.map(() => -0.01);

            return this.setPackage(mfBcf);
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
            return this.setPackage(mfLpf);
        }

        throw new Error('FlowPackage from type ' + type + ' is not implemented.');
    };

    getFlowPackage() {
        return Object.values(this.packages).filter(p => (p instanceof FlopyModflowFlowPackage))[0];
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

    // noinspection JSMethodCanBeStatic
    get availableFlowPackages() {
        return [
            {type: 'bcf', package: FlopyModflowMfbcf, name: 'Block-Centered Flow Package'},
            {type: 'lpf', package: FlopyModflowMflpf, name: 'Layer-Property Flow Package'},
            //{type: 'upw', package: FlopyModflowMfupw, name: 'Upstream Weighting Package'},
        ];
    }

    setSolverPackage = type => {
        // noinspection JSRedundantSwitchStatement
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
            spData.push([[per, 0], ['save head', 'save drawdown']]);
        }

        const mfOc = FlopyModflowMfoc.create();
        mfOc.stress_period_data = spData;
        this.setPackage(mfOc);
    };

    setTransportEnabled = enabled => {
        if (enabled) {
            return this.setPackage(FlopyModflowMflmt.create());
        }

        this.removePackageIfExists(FlopyModflowMflmt.create());
    };

    get packages() {
        return this._packages;
    }

    setPackage(p) {
        if (p instanceof FlopyModflowFlowPackage) {
            this.availableFlowPackages.forEach(fp => {
                this.removePackageByType(fp.type);
            });
        }

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

    getPackage(name) {
        if (!this._packages[name]) {
            throw new Error('Package not found');
        }

        return this._packages[name];
    }

    getSolverPackage() {
        return this._packages['pcg'];
    }

    removePackageIfExists(p) {
        for (const name in packagesMap) {
            if (p instanceof packagesMap[name]) {
                delete this._packages[name];
                return;
            }
        }
    }

    removePackageByType(type) {
        delete this._packages[type];
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
    };
}
