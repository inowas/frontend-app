import { IParameterRelation } from './Parameter.type';
import { PathConfig } from 'konva/lib/shapes/Path';

interface IZone {
  allowGameObjects?: boolean;
  id: string;
  options: PathConfig;
  relations?: IParameterRelation[];
}

export default IZone;
