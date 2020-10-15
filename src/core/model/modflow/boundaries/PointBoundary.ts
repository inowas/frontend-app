import {BoundingBox, Cells, Geometry, GridSize} from '../index';
import Stressperiods from '../Stressperiods';
import Boundary from './Boundary';
import {ISpValues} from './Boundary.type';

export default abstract class PointBoundary extends Boundary {

    get type() {
        return this._props.properties.type;
    }

    get id() {
        return this._props.id;
    }

    set id(value) {
        this._props.id = value;
    }

    get geometry() {
        return Geometry.fromObject(this._props.geometry);
    }

    set geometry(value) {
        this._props.geometry = value.toObject();
    }

    get name() {
        return this._props.properties.name;
    }

    set name(value) {
        this._props.properties.name = value;
    }

    get layers() {
        return this._props.properties.layers;
    }

    set layers(value) {
        this._props.properties.layers = value;
    }

    get cells() {
        return Cells.fromObject(this._props.properties.cells);
    }

    set cells(value) {
        this._props.properties.cells = value.toObject();
    }

    public getSpValues(stressperiods: Stressperiods): ISpValues {
        return Boundary.mergeStressperiodsWithSpValues(stressperiods, this._props.properties.sp_values);
    }

    public recalculateCells(boundingBox: BoundingBox, gridSize: GridSize): void {
        this.cells = Cells.fromGeometry(this.geometry, boundingBox, gridSize);
    }

    public setSpValues(spValues: ISpValues) {
        this._props.properties.sp_values = spValues;
    }
}
