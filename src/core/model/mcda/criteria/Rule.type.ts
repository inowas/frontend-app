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
    id: string;
    name: string;
    color: string;
    expression: string;
    from: number;
    fromOperator: '>' | '>=';
    to: number;
    toOperator: '<' | '<=';
    type: 'fixed' | 'calc';
    value: number;
}
