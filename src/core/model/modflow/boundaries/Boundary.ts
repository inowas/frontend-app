import {cloneDeep} from 'lodash';
import Uuid from 'uuid';
import {Cells, Geometry} from '../index';
import {
    BoundaryType,
    IBoundary, IBoundaryImport,
    ISpValues,
    IValueProperty
} from './Boundary.type';

export default abstract class Boundary {

    protected _props: any;

    abstract get type(): BoundaryType;

    abstract get id(): string;

    abstract set id(id: string);

    abstract get geometry(): Geometry;

    abstract get name(): string;

    abstract set name(name: string);

    abstract get cells(): Cells;

    abstract get layers(): number[];

    abstract get geometryType(): string;

    abstract get valueProperties(): IValueProperty[];

    public abstract getSpValues(opId?: string): ISpValues;

    public abstract setSpValues(spValues: ISpValues, opId?: string): void;

    public abstract toImport(): IBoundaryImport;

    public abstract toObject(): IBoundary;

    public clone(): Boundary {
        this._props = cloneDeep(this._props);
        this.id = Uuid.v4();
        this.name = this.name + '(clone)';
        return this;
    }
}
