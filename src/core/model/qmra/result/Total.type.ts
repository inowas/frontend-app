export default interface ITotal {
  repeatId: number;
  treatmentSchemeId: number;
  pathogenId: number;
  events: number;
  inflowMedian: number;
  logReductionMedian: number;
  volumeSum: number;
  exposureSum: number;
  doseSum: number;
  infectionProbSum: number;
  illnessProbSum: number;
  dalysSum: number;
}
