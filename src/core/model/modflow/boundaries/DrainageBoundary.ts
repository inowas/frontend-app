import {LineString} from 'geojson';
import {cloneDeep} from 'lodash';
import Uuid from 'uuid';
import {ICells} from '../../geometry/Cells.type';
import {ISpValues, IValueProperty} from './Boundary.type';
import {IDrainageBoundary} from './DrainageBoundary.type';
import LineBoundary from './LineBoundary';

export default class DrainageBoundary extends LineBoundary {

    public static create(
        id: string,
        geometry: LineString,
        name: string,
        layers: number[],
        cells: ICells,
        spValues: ISpValues
    ) {
        return new DrainageBoundary({
            type: 'FeatureCollection',
            features: [
                {
                    id: Uuid.v4(),
                    type: 'Feature',
                    geometry,
                    properties: {
                        type: 'drn',
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

    public static valueProperties() {
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
                unit: 'm^2/day',
                decimals: 1,
                default: 0
            }
        ];
    }

    protected _props: IDrainageBoundary;

    public constructor(obj: IDrainageBoundary) {
        super();
        this._props = cloneDeep(obj);
    }

    public get valueProperties(): IValueProperty[] {
        return DrainageBoundary.valueProperties();
    }

    public toObject(): IDrainageBoundary {
        return this._props;
    }
}
