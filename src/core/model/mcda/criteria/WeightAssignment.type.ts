import {IWeight} from './Weight.type';

export enum WeightAssignmentIndex {
    ID = 'id',
    META = 'meta',
    METHOD = 'method',
    SUB_METHOD = 'subMethod',
    SUB_PARAM = 'subParam',
    NAME = 'name',
    WEIGHTS = 'weights',
    IS_ACTIVE = 'isActive',
    PARENT = 'parent'
}

type IIndexSignature = {
    [key in WeightAssignmentIndex]: any;
};

export enum WARankingSubMethod {
    EXPONENTIAL = 'exp',
    RECIPROCAL = 'rec',
    SUMMED = 'sum'
}

export enum WeightAssignmentType {
    RATING = 'rtn',
    RANKING = 'rnk',
    MULTI_INFLUENCE = 'mif',
    PAIRWISE_COMPARISON = 'pwc'
}

export interface IWeightAssignment extends IIndexSignature {
    id: string;
    isActive: boolean;
    meta: any;
    method: WeightAssignmentType;
    name: string;
    parent: string | null;
    subMethod: string;
    subParam: number;
    weights: IWeight[];
}

export interface IWeightAssignment1v0 {
    id: string;
    isActive: boolean;
    meta: any;
    method: string;
    name: string;
    parent: string | null;
    subMethod: string;
    subParam: number;
    weights: IWeight[];
}
