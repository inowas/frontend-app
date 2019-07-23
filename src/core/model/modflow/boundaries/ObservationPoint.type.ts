import {Point} from 'geojson';
import {IBoundaryFeature, SpValues} from './types';

export interface IObservationPoint extends IBoundaryFeature {
    type: 'Feature';
    id: string;
    geometry?: Point;
    properties: {
        name?: string
        sp_values?: SpValues;
        type: 'op';
        distance?: number;
    };
}
