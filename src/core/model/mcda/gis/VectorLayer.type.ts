import {IGeometry} from '../../geometry/Geometry.type';

export interface IVectorLayer {
    id: string;
    color: string;
    type: string; // TODO
    geometry: IGeometry;
}