export default interface ITreatmentScheme {
  id: string;
  schemeId: number;
  name: string;
  treatmentId: number;
  treatmentName: string;
}

export interface ITreatmentSchemePayload {
  TreatmentSchemeID: number;
  TreatmentSchemeName: string;
  TreatmentID: number;
  TreatmentName: string;
}
