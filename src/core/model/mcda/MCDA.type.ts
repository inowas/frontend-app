import {IGridSize} from '../geometry/GridSize.type';
import {ICriterion} from './criteria/Criterion.type';
import {IWeightAssignment} from './criteria/WeightAssignment.type';
import {IGisMap} from './gis/GisMap.type';
import {ISuitability} from './Suitability.type';

export interface IMCDA {
    criteria: ICriterion[];
    weightAssignments: IWeightAssignment[];
    constraints?: IGisMap;
    gridSize: IGridSize;
    withAhp: boolean;
    suitability: ISuitability;
}
