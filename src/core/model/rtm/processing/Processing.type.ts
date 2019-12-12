export interface IProcessing {
    id: string;
    begin: number;
    end: number;
    type: string;
}

export type IValueProcessingComparator = 'lte' | 'le' | 'gt' | 'gte';

export interface IValueProcessing extends IProcessing {
    type: 'value';
    comparator: IValueProcessingComparator;
    value: number;
}

export interface ITimeProcessing extends IProcessing {
    type: 'time';
    rule: string;
    interpolationMethod: string;
}
