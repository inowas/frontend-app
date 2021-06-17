export interface IPathogenPayload {
  PathogenID: number;
  PathogenName: string;
  PathogenGroup: string;
  simulate: number;
  type: string;
  min: number;
  max: number;
}

interface IPathogen {
  id: number;
  name: string;
  group: string;
  simulate: number;
  type: string;
  min: number;
  max: number;
  reference: string;
  link: string;
  notes: string;
}

export default IPathogen;
