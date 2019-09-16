import {IGeometry} from '../../geometry/Geometry.type';

export interface IGisArea {
    id: string;
    color: string;
    type: string; // TODO
    geometry: IGeometry;
}
