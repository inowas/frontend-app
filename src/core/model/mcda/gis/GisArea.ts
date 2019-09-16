import {Geometry} from '../../geometry';
import {IGisArea} from './GisArea.type';

class GisArea {

    get id() {
        return this._props.id;
    }

    set id(value) {
        this._props.id = value;
    }

    get color() {
        return this._props.color;
    }

    set color(value) {
        this._props.color = value;
    }

    get type() {
        return this._props.type;
    }

    set type(value) {
        this._props.type = value;
    }

    get geometry(): Geometry {
        return Geometry.fromObject(this._props.geometry);
    }

    set geometry(value: Geometry) {
        this._props.geometry = value.toObject();
    }

    public static fromObject(obj: IGisArea) {
        return new GisArea(obj);
    }

    protected _props: IGisArea;

    constructor(obj: IGisArea) {
        this._props = obj;
    }

    public toObject() {
        return this._props;
    }
}

export default GisArea;
