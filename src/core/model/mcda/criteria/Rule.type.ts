export enum RuleIndex {
    ID = 'id',
    NAME = 'name',
    COLOR = 'color',
    EXPRESSION = 'expression',
    FROM = 'from',
    FROMOPERATOR = 'fromOperator',
    TO = 'to',
    TOOPERATOR = 'toOperator',
    TYPE = 'type',
    VALUE = 'value'
}

type IIndexSignature = {
    [key in RuleIndex]: any;
};

export interface IRule extends IIndexSignature {
    color: string;
    expression: string;
    from: number;
    fromOperator: '>' | '>=';
    id: string;
    name: string;
    to: number;
    toOperator: '<' | '<=';
    type: 'fixed' | 'calc';
    value: number;
}
