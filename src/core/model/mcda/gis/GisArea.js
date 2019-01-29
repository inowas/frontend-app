import uuidv4 from 'uuid/v4';
import {Geometry} from '../../geometry';

class GisArea {

    _id = uuidv4();
    _color = 'blue';
    _type = 'area';
    _geometry = null;

    static fromObject(obj) {
        const area = new GisArea();
        area.id = obj.id;
        area.color = obj.color;
        area.type = obj.type;
        area.geometry = obj.geometry ? Geometry.fromObject(obj.geometry) : null;
        return area;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get color() {
        return this._color;
    }

    set color(value) {
        this._color = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get geometry() {
        return this._geometry;
    }

    set geometry(value) {
        this._geometry = value;
    }

    toObject() {
        return {
            id: this.id,
            color: this.color,
            type: this.type,
            geometry: this.geometry ? this.geometry.toObject() : null
        }
    }
}

export default GisArea;
