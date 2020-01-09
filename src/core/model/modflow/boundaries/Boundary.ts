import Uuid from 'uuid';
import BoundingBox from '../../geometry/BoundingBox';
import GridSize from '../../geometry/GridSize';
import {Cells, Geometry} from '../index';
import Stressperiods from '../Stressperiods';
import {
    BoundaryType,
    IBoundary,
    IBoundaryExport,
    ISpValues,
    IValueProperty
} from './Boundary.type';

export default abstract class Boundary {

    abstract get type(): BoundaryType;

    abstract get id(): string;

    abstract set id(id: string);

    abstract get geometry(): Geometry;

    abstract get name(): string;

    abstract set name(name: string);

    abstract get cells(): Cells;

    abstract get layers(): number[];

    get geometryType() {
        return this._class.geometryType();
    }

    abstract get valueProperties(): IValueProperty[];

    public static mergeStressperiodsWithSpValues = (stressperiods: Stressperiods, spValues: ISpValues): ISpValues => {
        return stressperiods.stressperiods.map((sp, idx) => {
            if (Array.isArray(spValues[idx])) {
                return spValues[idx];
            }
            return spValues[spValues.length - 1];
        });
    };

    protected _props: any;

    protected _class: any;

    public abstract getSpValues(stressPeriods: Stressperiods, opId?: string): ISpValues;

    public abstract recalculateCells(boundingBox: BoundingBox, gridSize: GridSize): void;

    public abstract setSpValues(spValues: ISpValues, opId?: string): void;

    public abstract toExport(stressPeriods: Stressperiods): IBoundaryExport;

    public abstract toObject(): IBoundary;

    public clone() {
        const b = this._class.fromObject(this._props);
        b.id = Uuid.v4();
        b.name = this.name + ' (clone)';
        return b;
    }
}
