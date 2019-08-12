import {LineString} from 'geojson';
import {cloneDeep} from 'lodash';
import Uuid from 'uuid';
import BoundingBox from '../../geometry/BoundingBox';
import {ICells} from '../../geometry/Cells.type';
import GridSize from '../../geometry/GridSize';
import {Cells, Geometry} from '../index';
import {ISpValues, IValueProperty} from './Boundary.type';
import {IGeneralHeadBoundary, IGeneralHeadBoundaryImport} from './GeneralHeadBoundary.type';
import LineBoundary from './LineBoundary';

export default class GeneralHeadBoundary extends LineBoundary {

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
                        type: 'ghb',
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

    public static fromImport(obj: IGeneralHeadBoundaryImport, boundingBox: BoundingBox, gridSize: GridSize) {
        const boundary = this.create(
            Uuid.v4(),
            obj.geometry,
            obj.name,
            obj.layers,
            Cells.fromGeometry(Geometry.fromGeoJson(obj.geometry), boundingBox, gridSize).toObject(),
            []
        );

        const opIdToRemove = boundary.observationPoints[0].id;
        obj.ops.forEach((op) => {
            boundary.addObservationPoint(Uuid.v4(), op.name, op.geometry, op.sp_values);
        });

        boundary.removeObservationPoint(opIdToRemove);
        return boundary;
    }

    public static fromObject(obj: IGeneralHeadBoundary) {
        return new this(obj);
    }

    public static valueProperties(): IValueProperty[] {
        return [
            {
                name: 'Head',
                description: 'Groundwater Head',
                unit: 'm',
                decimals: 2,
                default: 0
            },
            {
                name: 'Conductance',
                description: 'Hydraulic conductance',
                unit: 'm/day',
                decimals: 2,
                default: 0
            }
        ];
    }

    protected _props: IGeneralHeadBoundary;

    public constructor(obj: IGeneralHeadBoundary) {
        super();
        this._props = cloneDeep(obj);
    }

    public get valueProperties(): IValueProperty[] {
        return GeneralHeadBoundary.valueProperties();
    }

    public toImport(): IGeneralHeadBoundaryImport {
        return {
            type: this.type,
            name: this.name,
            geometry: this.geometry.toObject() as LineString,
            layers: this.layers,
            ops: this.observationPoints.map((op) => ({
                    name: op.name,
                    geometry: op.geometry,
                    sp_values: op.spValues
                }
            ))
        };
    }

    public toObject(): IGeneralHeadBoundary {
        return this._props;
    }
}
