import {Geometry} from '../../geometry';
import {IVectorLayer} from './VectorLayer.type';

class VectorLayer {

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

    public static fromObject(obj: IVectorLayer) {
        return new VectorLayer(obj);
    }

    protected _props: IVectorLayer;

    constructor(obj: IVectorLayer) {
        this._props = obj;
    }

    public toObject() {
        return this._props;
    }
}

export default VectorLayer;
