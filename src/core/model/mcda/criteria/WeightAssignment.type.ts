import {IWeight} from './Weight.type';

export enum WeightAssignmentType {
    SPL = 'spl',
    RNK = 'rnk',
    RRW = 'rrw',
    MIF = 'mif',
    PWC = 'pwc'
}

export interface IWeightAssignment {
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
