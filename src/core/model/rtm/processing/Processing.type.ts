export interface IProcessing {
    id: string;
    begin: number;
    end: number;
    type: string;
}

export interface IValueProcessing extends IProcessing {
    type: 'value';
    comparison: 'lte' | 'le' | 'gt' | 'gte';
    value: number;
}
