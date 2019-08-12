import {LineString} from 'geojson';
import {cloneDeep} from 'lodash';
import Uuid from 'uuid';
import {ICells} from '../../geometry/Cells.type';
import {ISpValues, IValueProperty} from './Boundary.type';
import {IConstantHeadBoundary} from './ConstantHeadBoundary.type';
import LineBoundary from './LineBoundary';

export default class ConstantHeadBoundary extends LineBoundary {

    public static create(
        id: string,
        geometry: LineString,
        name: string,
        layers: number[],
        cells: ICells,
        spValues: ISpValues
    ) {
        return new ConstantHeadBoundary({
            type: 'FeatureCollection',
            features: [
                {
                    id: Uuid.v4(),
                    type: 'Feature',
                    geometry,
                    properties: {
                        type: 'chd',
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
                name: 'SHead',
                description: 'Head at the start of the stress period',
                unit: 'm',
                decimals: 1,
                default: 0
            },
            {
                name: 'Ehead',
                description: 'Head at the end of the stress period',
                unit: 'm',
                decimals: 1,
                default: 0
            }
        ];
    }

    protected _props: IConstantHeadBoundary;

    public constructor(obj: IConstantHeadBoundary) {
        super();
        this._props = cloneDeep(obj);
    }

    get valueProperties(): IValueProperty[] {
        return ConstantHeadBoundary.valueProperties();
    }

    public toObject(): IConstantHeadBoundary {
        return this._props;
    }
}
