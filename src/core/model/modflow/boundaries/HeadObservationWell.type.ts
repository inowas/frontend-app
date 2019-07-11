import {Point} from 'geojson';
import Cells from '../../geometry/Cells';
import {IBoundaryFeature, SpValues} from './types';

export interface IHeadObservationWell extends IBoundaryFeature {
    id: string;
    geometry?: Point;
    properties: {
        type: 'hob';
        name?: string;
        layers?: number[];
        cells?: Cells;
        sp_values?: SpValues;
    };
}
