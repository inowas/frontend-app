import {ICells} from '../../geometry/Cells.type';
import {GeoJson} from '../../geometry/Geometry.type';
import {ISoilmodelParameter} from './SoilmodelParameter.type';

export interface ISoilmodelZone {
    id: string;
    name: string;
    geometry: GeoJson | null;
    cells: ICells | [];
    priority: number;
    top: ISoilmodelParameter;
    botm: ISoilmodelParameter;
    hk: ISoilmodelParameter;
    hani: ISoilmodelParameter;
    vka: ISoilmodelParameter;
    ss: ISoilmodelParameter;
    sy: ISoilmodelParameter;
}
