export default interface ITotal {
  repeatID: number;
  TreatmentSchemeID: number;
  PathogenID: number;
  events: number;
  inflow_median: number;
  logreduction_median: number;
  volume_sum: number;
  exposure_sum: number;
  dose_sum: number;
  infectionProb_sum: number;
  illnessProb_sum: number;
  dalys_sum: number;
}
