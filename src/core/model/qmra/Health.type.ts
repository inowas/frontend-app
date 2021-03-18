export default interface IHealth {
  id: string;
  pathogenId: number;
  pathogenName: string;
  infectionToIllness?: number;
  dalysPerCase?: number;
}
