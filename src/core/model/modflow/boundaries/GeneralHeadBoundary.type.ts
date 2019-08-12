import {LineString} from 'geojson';
import {ICells} from '../../geometry/Cells.type';
import {IBoundaryFeatureCollection, IObservationPointImportData} from './Boundary.type';
import {IObservationPoint} from './ObservationPoint.type';

export interface IGeneralHeadBoundary extends IBoundaryFeatureCollection {
    type: 'FeatureCollection';
    features: Array<IObservationPoint | IGeneralHeadBoundaryFeature>;
}

export interface IGeneralHeadBoundaryFeature {
    type: 'Feature';
    id: string;
    geometry: LineString;
    properties: {
        type: 'ghb';
        name: string;
        layers: number[];
        cells: ICells;
    };
}

export interface IGeneralHeadBoundaryImport {
    type: 'ghb';
    name: string;
    geometry: LineString;
    layers: number[];
    ops: IObservationPointImportData[];
}
