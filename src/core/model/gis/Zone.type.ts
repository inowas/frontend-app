import {ICell, ICells} from '../geometry/Cells.type';
import {GeoJson} from '../geometry/Geometry.type';
import {IRasterParameterLegacy} from './RasterParameter.type';

export interface IZone {
    id: string;
    name: string;
    geometry: GeoJson | null;
    cells: ICells;
}

export interface IZoneLegacy {
    id: string;
    name: string;
    geometry: GeoJson | null;
    cells: ICell[];
    priority: number;
    top: IRasterParameterLegacy;
    botm: IRasterParameterLegacy;
    hk: IRasterParameterLegacy;
    vka: IRasterParameterLegacy;
    hani: IRasterParameterLegacy;
    ss: IRasterParameterLegacy;
    sy: IRasterParameterLegacy;
}
