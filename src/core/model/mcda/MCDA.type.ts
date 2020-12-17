import {ICriterion, ICriterion1v0} from './criteria/Criterion.type';
import {IGis, IGis1v0} from './gis/Gis.type';
import {IGridSize} from '../geometry/GridSize.type';
import {ISuitability, ISuitability1v0} from './Suitability.type';
import {IWeightAssignment} from './criteria/WeightAssignment.type';

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
    constraints: IGis;
    grid_size: IGridSize;
    suitability: ISuitability;
    version: string;
    weight_assignments: IWeightAssignment[];
    with_ahp: boolean;
}

export interface IMCDA1v0 {
    constraints: IGis1v0;
    criteria: ICriterion1v0[];
    suitability: ISuitability1v0;
    version?: '0';
    weight_assignments: IWeightAssignment[];
    with_ahp: boolean;
}
