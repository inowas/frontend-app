import {IRasterLayer, IRasterLayer1v0} from '../gis/RasterLayer.type';
import {IRule} from './Rule.type';

export enum CriteriaType {
    CONTINUOUS = 'continuous',
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
    suitability: IRasterLayer;
    constraintRaster: IRasterLayer;
    constraintRules: IRule[];
    step: number;
}

export interface ICriterion1v0 {
    id: string;
    parentId: string | null;
    name: string;
    type: CriteriaType;
    unit: string;
    raster: IRasterLayer1v0;
    rules: IRule[];
    suitability: IRasterLayer1v0;
    constraintRaster: IRasterLayer1v0;
    constraintRules: IRule[];
    step: number;
}