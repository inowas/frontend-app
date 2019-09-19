import Rainbow from './Rainbowvis';

export interface ILegendItem {
    color: string;
    from?: number;
    fromOperator?: '>' | '>=';
    isContinuous?: boolean;
    label?: string;
    to?: number;
    toOperator?: '<' | '<=';
    value?: number | string;
}

export interface ILegendItemContinuous extends ILegendItem {
    color: string;
    from?: number;
    fromOperator?: '>' | '>=';
    isContinuous: true;
    label: string;
    toOperator?: '<' | '<=';
    to?: number;
}

export interface ILegendItemDiscrete extends ILegendItem {
    color: string;
    isContinuous: false;
    label: string;
    value: number;
}

export type RainbowOrLegend = ILegendItemContinuous[] | ILegendItemDiscrete[] | Rainbow;
