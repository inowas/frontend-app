import {LineString} from 'geojson';
import {ICells} from '../../geometry/Cells.type';
import {IBoundaryFeatureCollection} from './Boundary.type';
import {IObservationPoint, IObservationPointImportData} from './ObservationPoint.type';

export interface IRiverBoundary extends IBoundaryFeatureCollection {
    type: 'FeatureCollection';
    features: Array<IObservationPoint | IRiverBoundaryFeature>;
}

export interface IRiverBoundaryFeature {
    type: 'Feature';
    id: string;
    geometry: LineString;
    properties: {
        type: 'riv';
        name: string;
        layers: number[];
        cells: ICells;
    };
}

export interface IRiverBoundaryImport {
    type: 'riv';
    id?: string;
    name: string;
    geometry: LineString;
    layers: number[];
    ops: IObservationPointImportData[];
}
