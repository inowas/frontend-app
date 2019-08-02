import {Point} from 'geojson';
import {ICells} from '../../geometry/Cells.type';
import {IBoundaryFeature, SpValues} from './types';

export interface IHeadObservationWell extends IBoundaryFeature {
    id: string;
    geometry?: Point;
    properties: {
        type: 'hob';
        name?: string;
        layers?: number[];
        cells?: ICells;
        sp_values?: SpValues;
    };
}
