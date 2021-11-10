export interface IProcessing {
  id: string;
  begin: number;
  end: number | null;
  type: string;
}

export type IValueProcessingOperator = '+' | '-' | '*' | '/' | '<' | '<=' | '>' | '>=' | '=';

export enum ECutRule {
  NONE = 'none',
  PERIOD = 'period',
  UNTIL_TODAY = 'untilToday',
  BEFORE_TODAY = 'beforeToday',
}

export interface IValueProcessing extends IProcessing {
  type: 'value';
  operator: IValueProcessingOperator;
  value: number;
}

export interface ITimeProcessing extends IProcessing {
  type: 'time';
  rule: string;
  method: string;
  cut: ECutRule;
  cutNumber?: number;
}
