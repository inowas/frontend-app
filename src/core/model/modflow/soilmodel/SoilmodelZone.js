import uuidv4 from 'uuid/v4';
import Geometry from '../../../geometry/Geometry';
import ActiveCells from '../../../geometry/ActiveCells';

class SoilmodelZone {
    _id = uuidv4();
    _name = 'New Zone';
    _geometry = null;
    _activeCells = null;
    _priority = 0;
    _top = null;
    _botm = null;
    _hk = null;
    _hani = null;
    _vka = null;
    _ss = null;
    _sy = null;

    static fromDefault() {
        const zone = new SoilmodelZone();
        zone.name = 'Default';
        zone.priority = 0;
        zone.top = 1;
        zone.botm = 0;
        zone.hk = 10;
        zone.hani = 1;
        zone.vka = 1;
        zone.ss = 0.00002;
        zone.sy = 0.15;
        return zone;
    }

    static fromObject(obj) {
        const zone = new SoilmodelZone();
        if (obj) {
            zone.id = obj.id;
            zone.name = obj.name;
            zone.geometry = obj.geometry ? Geometry.fromObject(obj.geometry) : null;
            zone.activeCells = obj.activeCells ? ActiveCells.fromArray(obj.activeCells) : null;
            zone.priority = obj.priority;
            zone.top = obj.top;
            zone.botm = obj.botm;
            zone.hk = obj.hk;
            zone.hani = obj.hani;
            zone.vka = obj.vka;
            zone.ss = obj.ss;
            zone.sy = obj.sy;
        }
        return zone;
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
        this._top = this.parseValue(value);
    }

    get botm() {
        return this._botm;
    }

    set botm(value) {
        this._botm = this.parseValue(value);
    }

    get hk() {
        return this._hk;
    }

    set hk(value) {
        this._hk = this.parseValue(value);
    }

    get hani() {
        return this._hani;
    }

    set hani(value) {
        this._hani = this.parseValue(value);
    }

    get vka() {
        return this._vka;
    }

    set vka(value) {
        this._vka = this.parseValue(value);
    }

    get ss() {
        return this._ss;
    }

    set ss(value) {
        this._ss = this.parseValue(value);
    }

    get sy() {
        return this._sy;
    }

    set sy(value) {
        this._sy = this.parseValue(value);
    }

    toObject() {
        return {
            'id': this.id,
            'name': this.name,
            'geometry': this.geometry ? this.geometry.toObject() : null,
            'activeCells': this.activeCells ? this.activeCells.toArray() : [],
            'priority': this.priority,
            'top': this.top,
            'botm': this.botm,
            'hk': this.hk,
            'hani': this.hani,
            'vka': this.vka,
            'ss': this.ss,
            'sy': this.sy
        };
    }

    parseValue(value) {
        if (this.priority === 0 && Array.isArray(value)) {
            return value;
        }
        if (this.priority === 0) {
            return value && value !== '' ? parseFloat(value) : 0;
        }
        return value && value !== '' ? parseFloat(value) : null;
    }
}

export default SoilmodelZone;