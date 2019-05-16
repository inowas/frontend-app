export interface IRule {
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
