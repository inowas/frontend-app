export interface IProcessing {
    id: string;
    begin: number;
    end: number;
    type: string;
}

export type IValueProcessingOperator = '+' | '-' | '*' | '/' | '<' | '<=' | '>' | '>=' | '=';

export interface IValueProcessing extends IProcessing {
    type: 'value';
    operator: IValueProcessingOperator;
    value: number;
}

export interface ITimeProcessing extends IProcessing {
    type: 'time';
    rule: string;
    method: string;
}
