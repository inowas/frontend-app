import {IRaster} from '../gis/Raster.type';
import {IRule} from './Rule.type';

export enum CriteriaType {
    CONTINUOUS = 'continuos',
    DISCRETE = 'discrete'
}

export interface ICriterion {
    id: string;
    parent: string | null;
    name: string;
    type: CriteriaType;
    unit: string;
    raster: IRaster;
    rules: IRule[];
    suitability: IRaster;
    constraintRaster: IRaster;
    constraintRules: IRule[];
    step: number;
}
