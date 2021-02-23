export default interface IHealth {
  pathogenId: number;
  pathogenName: string;
  infectionToIllness?: number;
  daysPerCase?: number;
}
