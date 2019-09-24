import {IRasterLayer} from '../gis/RasterLayer.type';
import {ISuitability} from '../Suitability.type';
import {IRule} from './Rule.type';

export enum CriteriaType {
    CONTINUOUS = 'continuos',
    DISCRETE = 'discrete'
}

export enum CriterionIndex {
    ID = 'id',
    PARENT = 'parent',
    NAME = 'name',
    TYPE = 'type',
    UNIT = 'unit',
    RASTER = 'raster',
    RULES = 'rules',
    SUITABILITY = 'suitability',
    CONSTRAINTRASTER = 'constraintRaster',
    CONSTRAINTRULES = 'constraintRules',
    STEP = 'step'
}

type IIndexSignature = {
    [key in CriterionIndex]: any;
};

export interface ICriterion extends IIndexSignature {
    id: string;
    parent: string | null;
    name: string;
    type: CriteriaType;
    unit: string;
    raster: IRasterLayer;
    rules: IRule[];
    suitability: ISuitability;
    constraintRaster: IRasterLayer;
    constraintRules: IRule[];
    step: number;
}
