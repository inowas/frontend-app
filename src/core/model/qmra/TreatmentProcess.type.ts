export interface ITreatmentProcessGroup {
  processId: number;
  name: string;
  group: string;
}

export interface ITeatmentProcessElement {
  id: string;
  pathogenGroup: string;
  type: string;
  min: number;
  max: number;
}

export type ITreatmentProcess = ITreatmentProcessGroup & ITeatmentProcessElement;