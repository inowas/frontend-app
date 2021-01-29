import {
    BoundaryType,
    IBoundary,
    IBoundaryExport,
    ISpValues,
    IValueProperty
} from './Boundary.type';
import {Cells, Geometry} from '../index';
import {dxCell, dyCell} from '../../../../services/geoTools/distance';
import BoundingBox from '../../geometry/BoundingBox';
import GridSize from '../../geometry/GridSize';
import Stressperiod from '../Stressperiod';
import Stressperiods from '../Stressperiods';
import uuid from 'uuid';

export default abstract class Boundary {

    abstract get type(): BoundaryType;

    abstract get id(): string;

    abstract set id(id: string);

    abstract get geometry(): Geometry;

    abstract set geometry(geometry: Geometry);

    abstract get name(): string;

    abstract set name(name: string);

    abstract get cells(): Cells;

    abstract set cells(cells: Cells);

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

    public calculateAreaByCells(boundingBox: BoundingBox, gridSize: GridSize) {
        const cellHeight = dyCell(boundingBox, gridSize) * 10000 / 10;
        const cellWidth = dxCell(boundingBox, gridSize) * 10000 / 10;
        return cellHeight * cellWidth * this.cells.cells.length;
    }

    public spValueDisabled(key: number, stressPeriod: Stressperiod) {
      return false;
    }

    public clone() {
        const b = this._class.fromObject(this._props);
        b.id = uuid.v4();
        b.name = this.name + ' (clone)';
        return b;
    }
}
