import {GeoJson} from '../../geometry/Geometry';
import {Cell} from '../../geometry/types';
import {ISoilmodelParameter} from './SoilmodelParameter.type';

export interface ISoilmodelZone {
    id: string;
    name: string;
    geometry: GeoJson | null;
    cells: Cell[] | [];
    priority: number;
    top: ISoilmodelParameter;
    botm: ISoilmodelParameter;
    hk: ISoilmodelParameter;
    hani: ISoilmodelParameter;
    vka: ISoilmodelParameter;
    ss: ISoilmodelParameter;
    sy: ISoilmodelParameter;
}
