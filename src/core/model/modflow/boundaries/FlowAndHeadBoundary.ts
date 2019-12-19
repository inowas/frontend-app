import {LineString} from 'geojson';
import {cloneDeep} from 'lodash';
import Uuid from 'uuid';
import BoundingBox from '../../geometry/BoundingBox';
import {ICells} from '../../geometry/Cells.type';
import GridSize from '../../geometry/GridSize';
import {Cells, Geometry} from '../index';
import Stressperiods from '../Stressperiods';
import {ISpValues, IValueProperty} from './Boundary.type';
import {IFlowAndHeadBoundary, IFlowAndHeadBoundaryExport} from './FlowAndHeadBoundary.type';
import LineBoundary from './LineBoundary';

export default class FlowAndHeadBoundary extends LineBoundary {

    public static create(
        id: string,
        geometry: LineString,
        name: string,
        layers: number[],
        cells: ICells,
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
                        date_times: [],
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
            []
        );

        const opIdToRemove = boundary.observationPoints[0].id;
        obj.ops.forEach((op) => {
            boundary.createObservationPoint(
                op.id ? op.id : Uuid.v4(),
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
                default: 0
            },
            {
                name: 'Flow',
                description: 'Flow',
                unit: 'm³/day',
                decimals: 2,
                default: 0
            }
        ];
    }

    protected _props: IFlowAndHeadBoundary;

    public constructor(obj: IFlowAndHeadBoundary) {
        super();
        this._props = cloneDeep(obj);
        this._class = FlowAndHeadBoundary;
    }

    public get valueProperties(): IValueProperty[] {
        return FlowAndHeadBoundary.valueProperties();
    }

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
                    date_times: op.dateTimes.map((dt) => dt.format('YYYY-MM-DD')),
                    sp_values: op.getSpValues(stressperiods)
                }
            ))
        };
    }

    public toObject(): IFlowAndHeadBoundary {
        return this._props;
    }
}
