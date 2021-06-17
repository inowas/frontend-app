export default interface IStatsTotal {
  PathogenGroup: string;
  PathogenID: number;
  PathogenName: string;
  TreatmentSchemeID: number;
  TreatmentSchemeName: string;
  key: string;
  max: number;
  mean: number;
  median: number;
  min: number;
  p05: number;
  p25: number;
  p75: number;
  p95: number;
}
