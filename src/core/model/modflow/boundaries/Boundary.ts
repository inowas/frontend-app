import Uuid from 'uuid';
import {ICells} from '../../geometry/Cells.type';
import {GeoJson} from '../../geometry/Geometry.type';
import {BoundaryType, IBoundary, SpValues} from './types';

export default abstract class Boundary {

    abstract get type(): BoundaryType;

    abstract get id(): string;

    abstract set id(id: string);

    abstract get geometry(): GeoJson | undefined;

    abstract get name(): string | undefined;

    abstract set name(name: string | undefined);

    abstract get cells(): ICells | undefined;

    abstract get layers(): number[] | undefined;

    abstract get geometryType(): string;

    abstract get valueProperties(): Array<{
        name: string,
        description: string,
        unit: string,
        decimals: number,
        default: number
    }>;

    public abstract getSpValues(opId?: string): SpValues | undefined | null;

    public abstract setSpValues(spValues: SpValues, opId?: string): void;

    public abstract toObject(): IBoundary;

    public clone(): Boundary {
        this.id = Uuid.v4();
        this.name = this.name + '(clone)';
        return this;
    }
}
