import {ICriteriaRelation} from './CriteriaRelation.type';

export interface IWeight {
    id: string;
    criterion: {
        id: string,
        name: string
    };
    initialValue: number;
    relations: ICriteriaRelation[];
    value: number;
}
