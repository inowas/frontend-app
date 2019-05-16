import uuidv4 from 'uuid/v4';
import Geometry from '../../geometry/Geometry';
import Cells from '../../geometry/Cells';
import SoilmodelParameter from './SoilmodelParameter';
import {defaultParameters} from '../../../../scenes/t03/defaults/soilmodel';

class SoilmodelZone {
    _id = uuidv4();
    _name = 'New Zone';
    _geometry = null;
    _cells = null;
    _priority = 0;
    _top = new SoilmodelParameter();
    _botm = new SoilmodelParameter();
    _hk = new SoilmodelParameter();
    _hani = new SoilmodelParameter();
    _vka = new SoilmodelParameter();
    _ss = new SoilmodelParameter();
    _sy = new SoilmodelParameter();

    static fromObject(obj, parseParameters = true) {
        const zone = new SoilmodelZone();
        if (obj) {
            zone.id = obj.id;
            zone.name = obj.name;
            zone.geometry = obj.geometry ? Geometry.fromObject(obj.geometry) : null;
            zone.cells = obj.cells ? Cells.fromArray(obj.cells) : null;
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

    get cells() {
        return this._cells;
    }

    set cells(value) {
        this._cells = value ? value : [];
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
            'cells': this.cells ? this.cells.toArray() : [],
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