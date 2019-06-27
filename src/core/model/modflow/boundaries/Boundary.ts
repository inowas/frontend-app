import Uuid from 'uuid';
import {Geometry} from '../../geometry';
import Cells from '../../geometry/Cells';

type SpValues = [number[]];

export default abstract class Boundary {

    abstract get type(): string;

    abstract get id(): string;

    abstract set id(name: string);

    abstract get geometry(): Geometry;

    abstract get name(): string;

    abstract set name(name: string);

    abstract get cells(): Cells;

    abstract get layers(): number[];

    abstract get geometryType(): string;

    abstract get valueProperties(): Array<{
        name: string,
        description: string,
        unit: string,
        decimals: number,
        default: number
    }>;

    public abstract getSpValues(opId?: number): SpValues;

    public abstract setSpValues(spValues: SpValues, opId?: number): void;

    public abstract toObject(): object;

    public clone(): Boundary {
        this.id = Uuid.v4();
        this.name = this.name + '(clone)';
        return this;
    }
}
