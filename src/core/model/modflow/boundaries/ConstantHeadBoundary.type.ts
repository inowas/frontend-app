import {LineString} from 'geojson';
import {ICells} from '../../geometry/Cells.type';
import {IBoundaryFeatureCollection} from './Boundary.type';
import {IObservationPoint, IObservationPointImportData} from './ObservationPoint.type';

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
    id?: string;
    name: string;
    geometry: LineString;
    layers: number[];
    ops: IObservationPointImportData[];
}
