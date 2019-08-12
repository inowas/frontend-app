import {LineString} from 'geojson';
import {ICells} from '../../geometry/Cells.type';
import {IBoundaryFeatureCollection, IObservationPointImportData} from './Boundary.type';
import {IObservationPoint} from './ObservationPoint.type';

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
    name: string;
    geometry: LineString;
    layers: number[];
    ops: IObservationPointImportData[];
}
