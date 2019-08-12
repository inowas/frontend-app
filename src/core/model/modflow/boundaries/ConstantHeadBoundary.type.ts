import {LineString} from 'geojson';
import {ICells} from '../../geometry/Cells.type';
import {IBoundaryFeatureCollection, IObservationPointImportData} from './Boundary.type';
import {IObservationPoint} from './ObservationPoint.type';

export interface IConstantHeadBoundary extends IBoundaryFeatureCollection {
    type: 'FeatureCollection';
    features: Array<IObservationPoint | IConstantHeadBoundaryFeature>;
}

export interface IConstantHeadBoundaryFeature {
    type: 'Feature';
    id: string;
    geometry: LineString;
    properties: {
        type: 'chd';
        name: string;
        layers: number[];
        cells: ICells;
    };
}

export interface IConstantHeadBoundaryImport {
    type: 'chd';
    name: string;
    geometry: LineString;
    layers: number[];
    ops: IObservationPointImportData[];
}
