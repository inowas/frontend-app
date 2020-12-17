import {Cells, Geometry} from '../index';
import {ICells} from '../../geometry/Cells.type';
import {
    IFlowAndHeadBoundary,
    IFlowAndHeadBoundaryExport,
    IFlowAndHeadBoundaryFeature
} from './FlowAndHeadBoundary.type';
import {IObservationPoint} from './ObservationPoint.type';
import {ISpValues, IValueProperty} from './Boundary.type';
import {LineString} from 'geojson';
import {cloneDeep, orderBy, sortedUniq} from 'lodash';
import BoundingBox from '../../geometry/BoundingBox';
import GridSize from '../../geometry/GridSize';
import LineBoundary from './LineBoundary';
import Stressperiods from '../Stressperiods';
import Uuid from 'uuid';
import moment, {DurationInputArg1, DurationInputArg2, Moment} from 'moment';

export default class FlowAndHeadBoundary extends LineBoundary {

    public static create(
        id: string,
        geometry: LineString,
        name: string,
        layers: number[],
        cells: ICells,
        dateTimes: string[],
        spValues: ISpValues
    ) {
        return new this({
            type: 'FeatureCollection',
            features: [
                {
                    id,
                    type: 'Feature',
                    geometry,
                    properties: {
                        type: 'fhb',
                        sp_values_enabled: [true, true],
                        name,
                        layers,
                        cells
                    }
                },
                {
                    id: Uuid.v4(),
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: geometry.coordinates[0]
                    },
                    properties: {
                        name: 'OP1',
                        date_times: dateTimes,
                        sp_values: spValues,
                        type: 'op',
                        distance: 0
                    }
                }
            ],
        });
    }

    public static fromExport(obj: IFlowAndHeadBoundaryExport, boundingBox: BoundingBox, gridSize: GridSize) {
        const boundary = this.create(
            obj.id ? obj.id : Uuid.v4(),
            obj.geometry,
            obj.name,
            obj.layers,
            Cells.fromGeometry(Geometry.fromGeoJson(obj.geometry), boundingBox, gridSize).toObject(),
            [],
            []
        );

        const opIdToRemove = boundary.observationPoints[0].id;
        obj.ops.forEach((op) => {
            const id = op.id ? op.id : Uuid.v4();
            boundary.createObservationPoint(
                id,
                op.name,
                op.geometry,
                op.sp_values,
                op.date_times
            );
        });

        boundary.removeObservationPoint(opIdToRemove);
        return boundary;
    }

    public static fromObject(obj: IFlowAndHeadBoundary) {
        return new this(obj);
    }

    public static valueProperties(): IValueProperty[] {
        return [
            {
                name: 'Head',
                description: 'Head',
                unit: 'm',
                decimals: 2,
                default: 0,
                canBeDisabled: true
            },
            {
                name: 'Flow',
                description: 'Flow',
                unit: 'm³/day',
                decimals: 2,
                default: 0,
                canBeDisabled: true
            }
        ];
    }

    protected _props: IFlowAndHeadBoundary;

    public constructor(obj: IFlowAndHeadBoundary) {
        super();
        this._props = cloneDeep(obj);
        this._class = FlowAndHeadBoundary;
    }

    public get spValuesEnabled(): boolean[] {
        let spe;
        this._props.features.forEach((f: IObservationPoint | IFlowAndHeadBoundaryFeature) => {
            if (f.properties.type !== 'op') {
                spe = f.properties.sp_values_enabled;
            }
        });

        if (spe) {
            return spe;
        }

        return [true, true];
    }

    public set spValuesEnabled(value) {
        this._props.features.forEach((f: IObservationPoint | IFlowAndHeadBoundaryFeature) => {
            if (f.properties.type !== 'op') {
                f.properties.sp_values_enabled = value;
            }
        });
    }

    public get valueProperties(): IValueProperty[] {
        return FlowAndHeadBoundary.valueProperties();
    }

    public addDateTime(amount: DurationInputArg1, unit: DurationInputArg2, opId?: string,
                       stressperiods?: Stressperiods) {
        if (opId && stressperiods) {
            const observationPoint = this.findObservationPointById(opId);
            const dateTimes = observationPoint.getDateTimes(stressperiods);
            if (dateTimes.length > 0) {
                const newDateTime = moment.utc(dateTimes[dateTimes.length - 1]).add(amount, unit);
                observationPoint.addDateTimeValue(
                    newDateTime,
                    observationPoint.getSpValues(stressperiods)[observationPoint.getSpValues(stressperiods).length - 1]
                );
                this.updateObservationPoint(
                    opId,
                    observationPoint.name,
                    observationPoint.geometry,
                    observationPoint.spValues,
                    observationPoint.dateTimes
                );
                return this;
            }
            observationPoint.addDateTimeValue(stressperiods.startDateTime, this.valueProperties.map((v) => v.default));
            this.updateObservationPoint(opId, observationPoint.name, observationPoint.geometry,
                observationPoint.spValues, observationPoint.dateTimes);
        }

        return this;
    }

    public changeDateTime(value: string, idx: number, opId?: string) {
        if (opId) {
            const observationPoint = this.findObservationPointById(opId);
            if (observationPoint) {
                observationPoint.updateDateTime(idx, moment.utc(value));
            }
            this.updateObservationPoint(opId, observationPoint.name, observationPoint.geometry,
                observationPoint.spValues, orderBy(observationPoint.dateTimes, (o: Moment) => {
                    return o.format('YYYYMMDD');
                }, ['asc']));
        }
        return this;
    }

    public removeDateTime(id: number, opId?: string) {
        if (opId) {
            const observationPoint = this.findObservationPointById(opId);
            if (observationPoint && observationPoint.dateTimes) {
                const dateTimes: Moment[] = [];
                const spValues: ISpValues = [];
                observationPoint.dateTimes.forEach((dt: Moment, idx: number) => {
                    if (id !== idx) {
                        spValues.push(observationPoint.spValues[idx]);
                        dateTimes.push(dt);
                    }
                });
                observationPoint.dateTimes = dateTimes;
                observationPoint.spValues = spValues;
                this.updateObservationPoint(opId, observationPoint.name, observationPoint.geometry,
                    observationPoint.spValues, observationPoint.dateTimes);
            }
        }
        return this;
    }

    public getDateTimes = (stressperiods: Stressperiods, opId?: string): Moment[] => {
        if (opId) {
            const observationPoint = this.findObservationPointById(opId);
            return observationPoint.getDateTimes(stressperiods);
        }

        let dateTimeStamps: number[] = [];
        this.observationPoints.forEach((op) => dateTimeStamps = dateTimeStamps.concat(
            op.getDateTimes(stressperiods).map((dt) => dt.unix())
        ));

        return sortedUniq(dateTimeStamps).map((dts) => moment.unix(dts));
    };

    public toExport(stressperiods: Stressperiods): IFlowAndHeadBoundaryExport {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            geometry: this.geometry.toObject() as LineString,
            layers: this.layers,
            ops: this.observationPoints.map((op) => ({
                    name: op.name,
                    geometry: op.geometry,
                    date_times: op.getDateTimes(stressperiods).map((dt) => dt.format('YYYY-MM-DD')),
                    sp_values: op.getSpValues(stressperiods)
                }
            ))
        };
    }

    public toObject(): IFlowAndHeadBoundary {
        return this._props;
    }
}
