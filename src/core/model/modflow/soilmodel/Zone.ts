import {Cells, Geometry} from '../../geometry';
import {IZone} from './Zone.type';

class Zone {

    get id() {
        return this._props.id;
    }

    set id(value) {
        this._props.id = value;
    }

    get name() {
        return this._props.name;
    }

    set name(value) {
        this._props.name = value;
    }

    get geometry() {
        return Geometry.fromGeoJson(this._props.geometry);
    }

    set geometry(value: Geometry) {
        this._props.geometry = value.toObject();
    }

    get cells() {
        return Cells.fromArray(this._props.cells);
    }

    set cells(value) {
        this._props.cells = value.toArray();
    }

    public static fromObject(obj: IZone) {
        return new Zone(obj);
    }

    private readonly _props: IZone;

    constructor(obj: IZone) {
        this._props = {...obj};
    }

    public toObject() {
        return this._props;
    }
}

export default Zone;
