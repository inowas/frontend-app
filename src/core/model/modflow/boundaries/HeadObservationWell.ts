import {Point} from 'geojson';
import {cloneDeep} from 'lodash';
import Uuid from 'uuid';
import BoundingBox from '../../geometry/BoundingBox';
import {ICells} from '../../geometry/Cells.type';
import GridSize from '../../geometry/GridSize';
import {Cells, Geometry} from '../index';
import Stressperiods from '../Stressperiods';
import {ISpValues, IValueProperty} from './Boundary.type';
import {IHeadObservationWell, IHeadObservationWellExport} from './HeadObservationWell.type';
import PointBoundary from './PointBoundary';

export default class HeadObservationWell extends PointBoundary {

    get geometryType() {
        return this._class.geometryType();
    }

    public static geometryType() {
        return 'Point';
    }

    public static fromObject(obj: IHeadObservationWell) {
        return new this(obj);
    }

    public static valueProperties(): IValueProperty[] {
        return [
            {
                name: 'Observed head',
                description: 'Observed head',
                unit: 'm',
                decimals: 2,
                default: 0
            },
        ];
    }

    public static create(id: string, geometry: Point, name: string, layers: number[], cells: ICells,
                         spValues: ISpValues) {
        return new this({
            id,
            type: 'Feature',
            geometry,
            properties: {
                type: 'hob',
                name,
                layers,
                cells,
                sp_values: spValues
            }
        });
    }

    public static fromExport(obj: IHeadObservationWellExport, boundingBox: BoundingBox, gridSize: GridSize) {
        return this.create(
            obj.id ? obj.id : Uuid.v4(),
            obj.geometry,
            obj.name,
            obj.layers,
            Cells.fromGeometry(Geometry.fromGeoJson(obj.geometry), boundingBox, gridSize).toObject(),
            obj.sp_values
        );
    }

    constructor(props: IHeadObservationWell) {
        super();
        this._props = cloneDeep(props);
        this._class = HeadObservationWell;
    }

    public toExport = (stressPeriods: Stressperiods): IHeadObservationWellExport => ({
        id: this.id,
        type: this.type,
        name: this.name,
        geometry: this.geometry.toObject() as Point,
        layers: this.layers,
        sp_values: this.getSpValues(stressPeriods)
    });

    public toObject(): IHeadObservationWell {
        return this._props;
    }

    public get valueProperties(): IValueProperty[] {
        return this._class.valueProperties();
    }
}
