export interface IParameter {
  relations: IParameterRelation[];
  id: string;
  isFixed?: boolean;
  max?: number;
  min?: number;
  name?: string;
  value: number | number[];
  valuePropertyKey?: number;
}

export interface IParameterRelation {
  id: string;
  isStorage?: boolean;
  resourceId: string;
  relation: number;
}
