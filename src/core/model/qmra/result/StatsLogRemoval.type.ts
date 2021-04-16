export default interface IStatsLogRemoval {
  PathogenGroup: string;
  TreatmentID: number;
  TreatmentName: string;
  TreatmentSchemeID: number;
  TreatmentSchemeName: string;
  max: number;
  mean: number;
  median: number;
  min: number;
  p05: number;
  p25: number;
  p75: number;
  p95: number;
}
