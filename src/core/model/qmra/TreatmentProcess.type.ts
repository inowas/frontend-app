export default interface ITreatmentProcess {
  id: number;
  name: string;
  group: string;
  pathogenGroup: string;
  type: string;
  min: number;
  max: number;
}
