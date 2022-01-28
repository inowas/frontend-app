export interface IParameter {
  relations?: IParameterRelation[];
  id: string;
  max?: number;
  min?: number;
  value: number;
}

export interface IParameterRelation {
  resourceId: string;
  relation?: number;
}
