export interface IResource {
  id: string;
  value: number;
}

export interface IResourceSettings {
  color?: string;
  id: string;
  max?: number;
  min?: number;
  name: string;
  needsStorage?: boolean;
  startValue: number;
  unit?: string;
}
