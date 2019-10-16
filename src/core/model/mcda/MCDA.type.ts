import {IGridSize} from '../geometry/GridSize.type';
import {ICriterion} from './criteria/Criterion.type';
import {IWeightAssignment} from './criteria/WeightAssignment.type';
import {IGis} from './gis/Gis.type';
import {ISuitability} from './Suitability.type';

export interface IMCDA {
    criteria: ICriterion[];
    weightAssignments: IWeightAssignment[];
    constraints: IGis;
    gridSize: IGridSize;
    version: string;
    withAhp: boolean;
    suitability: ISuitability;
}

export interface IMCDAPayload {
    criteria: ICriterion[];
    weight_assignments: IWeightAssignment[];
    constraints: IGis;
    grid_size: IGridSize;
    version: string;
    with_ahp: boolean;
    suitability: ISuitability;
}
