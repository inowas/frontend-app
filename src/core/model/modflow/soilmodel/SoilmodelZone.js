import uuidv4 from 'uuid/v4';
import Geometry from '../../geometry/Geometry';
import ActiveCells from '../../geometry/ActiveCells';
import SoilmodelParameter from './SoilmodelParameter';
import {defaultParameters} from 'scenes/t03/defaults/soilmodel';

class SoilmodelZone {
    _id = uuidv4();
    _name = 'New Zone';
    _geometry = null;
    _activeCells = null;
    _priority = 0;
    _top = new SoilmodelParameter();
    _botm = new SoilmodelParameter();
    _hk = new SoilmodelParameter();
    _hani = new SoilmodelParameter();
    _vka = new SoilmodelParameter();
    _ss = new SoilmodelParameter();
    _sy = new SoilmodelParameter();

    static fromDefault() {
        const zone = new SoilmodelZone();
        zone.name = 'Default';
        zone.priority = 0;
        zone.top = SoilmodelParameter.fromObject(defaultParameters.top);
        zone.botm = SoilmodelParameter.fromObject(defaultParameters.botm);
        zone.hk = SoilmodelParameter.fromObject(defaultParameters.hk);
        zone.hani = SoilmodelParameter.fromObject(defaultParameters.hani);
        zone.vka = SoilmodelParameter.fromObject(defaultParameters.vka);
        zone.ss = SoilmodelParameter.fromObject(defaultParameters.ss);
        zone.sy = SoilmodelParameter.fromObject(defaultParameters.sy);
        return zone;
    }

    static fromObject(obj, parseParameters = true) {
        const zone = new SoilmodelZone();
        if (obj) {
            zone.id = obj.id;
            zone.name = obj.name;
            zone.geometry = obj.geometry ? Geometry.fromObject(obj.geometry) : null;
            zone.activeCells = obj.activeCells ? ActiveCells.fromArray(obj.activeCells) : null;
            zone.priority = obj.priority;
            zone.top = this.refactorParameter(obj.top, parseParameters);
            zone.botm = this.refactorParameter(obj.botm, parseParameters);
            zone.hk = this.refactorParameter(obj.hk, parseParameters);
            zone.hani = this.refactorParameter(obj.hani, parseParameters);
            zone.vka = this.refactorParameter(obj.vka, parseParameters);
            zone.ss = this.refactorParameter(obj.ss, parseParameters);
            zone.sy = this.refactorParameter(obj.sy, parseParameters);
        }
        return zone;
    }

    static refactorParameter(value, parseParameters) {
        if (value instanceof Object) {
            return SoilmodelParameter.fromObject(value, parseParameters);
        }
        const param = SoilmodelParameter.fromObject(defaultParameters.top);
        param.value = value;
        return param;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value ? value : uuidv4();
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value ? value : '';
    }

    get geometry() {
        return this._geometry;
    }

    set geometry(value) {
        this._geometry = value ? value : null;
    }

    get activeCells() {
        return this._activeCells;
    }

    set activeCells(value) {
        this._activeCells = value ? value : [];
    }

    get priority() {
        return this._priority;
    }

    set priority(value) {
        this._priority = value ? parseInt(value) : 0;
    }

    get top() {
        return this._top;
    }

    set top(value) {
        this._top = value;
    }

    get botm() {
        return this._botm;
    }

    set botm(value) {
        this._botm = value;
    }

    get hk() {
        return this._hk;
    }

    set hk(value) {
        this._hk = value;
    }

    get hani() {
        return this._hani;
    }

    set hani(value) {
        this._hani = value;
    }

    get vka() {
        return this._vka;
    }

    set vka(value) {
        this._vka = value;
    }

    get ss() {
        return this._ss;
    }

    set ss(value) {
        this._ss = value;
    }

    get sy() {
        return this._sy;
    }

    set sy(value) {
        this._sy = value;
    }

    toObject() {
        return {
            'id': this.id,
            'name': this.name,
            'geometry': this.geometry ? this.geometry.toObject() : null,
            'activeCells': this.activeCells ? this.activeCells.toArray() : [],
            'priority': this.priority,
            'top': this.top.toObject(),
            'botm': this.botm.toObject(),
            'hk': this.hk.toObject(),
            'hani': this.hani.toObject(),
            'vka': this.vka.toObject(),
            'ss': this.ss.toObject(),
            'sy': this.sy.toObject()
        };
    }
}

export default SoilmodelZone;