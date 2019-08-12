import {LineString} from 'geojson';
import {cloneDeep} from 'lodash';
import Uuid from 'uuid';
import {ICells} from '../../geometry/Cells.type';
import {ISpValues, IValueProperty} from './Boundary.type';
import LineBoundary from './LineBoundary';
import {IRiverBoundary} from './RiverBoundary.type';

export default class RiverBoundary extends LineBoundary {

    public static create(
        id: string,
        geometry: LineString,
        name: string,
        layers: number[],
        cells: ICells,
        spValues: ISpValues
    ) {
        return new RiverBoundary({
            type: 'FeatureCollection',
            features: [
                {
                    id: Uuid.v4(),
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
    }

    public toObject(): IRiverBoundary {
        return this._props;
    }

    public get valueProperties(): IValueProperty[] {
        return RiverBoundary.valueProperties();
    }
}
