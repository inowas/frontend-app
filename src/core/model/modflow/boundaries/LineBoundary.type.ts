import {LineString} from 'geojson';
import {ICells} from '../../geometry/Cells.type';
import {IBoundaryFeature} from './Boundary.type';
import {IObservationPoint, IObservationPointExport} from './ObservationPoint.type';

export type LineBoundaryType = 'chd' | 'fhb' | 'ghb' | 'riv' | 'drn' | 'hfb' | 'str';

export interface ILineBoundaryFeatureCollection {
    type: 'FeatureCollection';
    features: Array<IBoundaryFeature | IObservationPoint>;
}

export interface ILineBoundaryFeature {
    type: 'Feature';
    id: string;
    geometry: LineString;
    properties: ILineBoundaryFeatureProperties;
}

export interface ILineBoundaryFeatureProperties {
    name: string;
    layers: number[];
    cells: ICells;
}

export interface ILineBoundaryExport {
    id?: string;
    name: string;
    geometry: LineString;
    layers: number[];
    cells?: ICells;
    ops: IObservationPointExport[];
}
