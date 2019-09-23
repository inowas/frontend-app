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
    EXP = 'exp',
    REC = 'rec',
    SUM = 'sum'
}

export enum WeightAssignmentType {
    SPL = 'spl',
    RNK = 'rnk',
    RRW = 'rrw',
    MIF = 'mif',
    PWC = 'pwc'
}

export interface IWeightAssignment extends IIndexSignature {
    id: string;
    meta: any;
    method: WeightAssignmentType;
    subMethod: string;
    subParam: number;
    name: string;
    weights: IWeight[];
    isActive: boolean;
    parent: string | null;
}
