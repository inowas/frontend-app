import {LineString} from 'geojson';
import {cloneDeep} from 'lodash';
import Uuid from 'uuid';
import BoundingBox from '../../geometry/BoundingBox';
import {ICells} from '../../geometry/Cells.type';
import GridSize from '../../geometry/GridSize';
import {Cells, Geometry} from '../index';
import Stressperiods from '../Stressperiods';
import {ISpValues, IValueProperty} from './Boundary.type';
import LineBoundary from './LineBoundary';
import {IRiverBoundary, IRiverBoundaryExport} from './RiverBoundary.type';

export default class RiverBoundary extends LineBoundary {

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
                        type: 'riv',
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
                        sp_values: spValues,
                        type: 'op',
                        distance: 0
                    }
                }
            ],
        });
    }

    public static fromExport(obj: IRiverBoundaryExport, boundingBox: BoundingBox, gridSize: GridSize) {
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
                op.sp_values
            );
        });

        boundary.removeObservationPoint(opIdToRemove);
        return boundary;
    }

    public static fromObject(obj: IRiverBoundary) {
        return new this(obj);
    }

    public static valueProperties(): IValueProperty[] {
        return [
            {
                name: 'Stage',
                description: 'River stage in m above sea level',
                unit: 'm',
                decimals: 1,
                default: 0
            },
            {
                name: 'Conductance',
                description: 'Riverbed conductance',
                unit: 'm/day',
                decimals: 1,
                default: 0
            },
            {
                name: 'Bottom',
                description: 'River bottom in m above sea level',
                unit: 'm',
                decimals: 1,
                default: 0
            }
        ];
    }

    protected _props: IRiverBoundary;

    public constructor(obj: IRiverBoundary) {
        super();
        this._props = cloneDeep(obj);
        this._class = RiverBoundary;
    }

    public toExport = (stressPeriods: Stressperiods): IRiverBoundaryExport => ({
        id: this.id,
        type: this.type,
        name: this.name,
        geometry: this.geometry.toObject() as LineString,
        layers: this.layers,
        ops: this.observationPoints.map((op) => ({
                name: op.name,
                geometry: op.geometry,
                sp_values: op.getSpValues(stressPeriods)
            }
        ))
    });

    public toObject(): IRiverBoundary {
        return this._props;
    }

    public get valueProperties(): IValueProperty[] {
        return RiverBoundary.valueProperties();
    }
}
