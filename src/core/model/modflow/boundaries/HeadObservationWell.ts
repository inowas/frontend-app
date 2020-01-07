import {Point} from 'geojson';
import {cloneDeep} from 'lodash';
import moment, {Moment} from 'moment';
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
    set dateTimes(value: Moment[]) {
        this._props.properties.date_times = value.map((dt) => dt.format('YYYY-MM-DD'));
    }

    get geometryType() {
        return this._class.geometryType();
    }

    public get valueProperties(): IValueProperty[] {
        return this._class.valueProperties();
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
                         dateTimes: string[], spValues: ISpValues) {
        return new this({
            id,
            type: 'Feature',
            geometry,
            properties: {
                type: 'hob',
                name,
                layers,
                cells,
                date_times: dateTimes,
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
            obj.date_times,
            obj.sp_values
        );
    }

    constructor(props: IHeadObservationWell) {
        super();
        this._props = cloneDeep(props);
        this._class = HeadObservationWell;
    }

    public getDateTimes = (stressperiods: Stressperiods): Moment[] => {
        if (!this._props.properties.date_times) {
            this._props.properties.date_times = stressperiods.stressperiods.map((sp) =>
                sp.startDateTime.format('YYYY-MM-DD'));
        }
        return this._props.properties.date_times.map((dt: string) => moment.utc(dt));
    };

    public getSpValues(stressperiods: Stressperiods): ISpValues {
        const spValues = this._props.properties.sp_values;

        return this.getDateTimes(stressperiods).map((dt, idx) => {
            if (Array.isArray(spValues[idx])) {
                return spValues[idx];
            }
            return spValues[spValues.length - 1];
        });
    }

    public toExport = (stressPeriods: Stressperiods): IHeadObservationWellExport => ({
        id: this.id,
        type: this.type,
        name: this.name,
        geometry: this.geometry.toObject() as Point,
        layers: this.layers,
        date_times: this.getDateTimes(stressPeriods).map((dt: Moment) => dt.format('YYYY-MM-DD')),
        sp_values: this.getSpValues(stressPeriods)
    });

    public toObject(): IHeadObservationWell {
        return this._props;
    }
}
