import {Point} from 'geojson';
import {Cell} from '../../geometry/types';
import {IBoundaryFeature, SpValues} from './types';

export interface IHeadObservationWell extends IBoundaryFeature {
    id: string;
    geometry?: Point;
    properties: {
        type: 'hob';
        name?: string;
        layers?: number[];
        cells?: Cell[];
        sp_values?: SpValues;
    };
}
