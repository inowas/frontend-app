import {Cells, Geometry} from '../index';
import {ICells} from '../../geometry/Cells.type';
import {IHeadObservationWell, IHeadObservationWellExport} from './HeadObservationWell.type';
import {ISpValues, IValueProperty} from './Boundary.type';
import {Point} from 'geojson';
import {cloneDeep, orderBy} from 'lodash';
import BoundingBox from '../../geometry/BoundingBox';
import GridSize from '../../geometry/GridSize';
import PointBoundary from './PointBoundary';
import Stressperiods from '../Stressperiods';
import Uuid from 'uuid';
import moment, {DurationInputArg1, DurationInputArg2, Moment} from 'moment';

export default class HeadObservationWell extends PointBoundary {
    set dateTimes(value: Moment[]) {
        this._props.properties.date_times = value.map((dt) => dt.format('YYYY-MM-DD'));
    }

    get dateTimes() {
        return this._props.properties.date_times.map((dt: string) => moment.utc(dt));
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

    public addDateTime(amount: DurationInputArg1, unit: DurationInputArg2, opId?: string,
                       stressperiods?: Stressperiods) {
        if (stressperiods) {
            const dateTimes = this._props.properties.date_times;
            if (this._props.properties.date_times.length > 0) {
                const newDateTime = moment.utc(dateTimes[dateTimes.length - 1]).add(amount, unit);
                this._props.properties.date_times.push(newDateTime.format('YYYY-MM-DD'));
                this._props.properties.sp_values.push(
                    this._props.properties.sp_values[this._props.properties.sp_values.length - 1]
                );
                return this;
            }
            this._props.properties.date_times.push(stressperiods.startDateTime.format('YYYY-MM-DD'));
            this._props.properties.sp_values.push(this.valueProperties.map((v) => v.default));
        }
        return this;
    }

    public changeDateTime(value: string, idx: number, opId?: string) {
        const dateTimes = this.dateTimes;
        if (dateTimes.length > idx) {
            dateTimes[idx] = moment.utc(value);
        }

        this.dateTimes = dateTimes;
        this.reorderDateTimes();

        return this;
    }

    public removeDateTime(id: number) {
        const dateTimes: string[] = [];
        const spValues: ISpValues = [];
        this._props.properties.date_times.forEach((dt: string, idx: number) => {
            if (id !== idx) {
                spValues.push(this._props.properties.sp_values[idx]);
                dateTimes.push(dt);
            }
        });
        this._props.properties.date_times = dateTimes;
        this._props.properties.sp_values = spValues;
        return this;
    }

    public reorderDateTimes() {
        this.dateTimes = orderBy(this.dateTimes, (o: Moment) => o.unix(), ['asc']);
        return this;
    }

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
