import {LineString} from 'geojson';
import {cloneDeep} from 'lodash';
import Uuid from 'uuid';
import {ICells} from '../../geometry/Cells.type';
import {ISpValues, IValueProperty} from './Boundary.type';
import {IGeneralHeadBoundary} from './GeneralHeadBoundary.type';
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
        return new GeneralHeadBoundary({
            type: 'FeatureCollection',
            features: [
                {
                    id: Uuid.v4(),
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

    public toObject(): IGeneralHeadBoundary {
        return this._props;
    }

    public get valueProperties(): IValueProperty[] {
        return GeneralHeadBoundary.valueProperties();
    }
}
