import {LatLngExpression} from 'leaflet';
import uuidv4 from 'uuid/v4';
import {Cells, Geometry} from '../geometry';
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

    set geometry(value) {
        this._props.geometry = value.coordinatesLatLng as LatLngExpression[];
    }

    get cells() {
        return Cells.fromArray(this._props.cells);
    }

    set cells(value) {
        this._props.cells = value.toArray();
    }

    get priority() {
        return this._props.priority;
    }

    set priority(value) {
        this._props.priority = value;
    }

    public static fromObject(obj: IZone) {
        return new Zone(obj);
    }

    private readonly _props: IZone = {
        id: uuidv4(),
        name: '',
        geometry: null,
        cells: [],
        parameters: [],
        priority: 0
    };

    constructor(obj: IZone) {
        this._props = {...obj};
    }

    public toObject() {
        return this._props;
    }
}

export default Zone;
