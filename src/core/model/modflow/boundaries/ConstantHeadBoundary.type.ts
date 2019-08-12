import {LineString} from 'geojson';
import {ICells} from '../../geometry/Cells.type';
import {IBoundaryFeatureCollection} from './Boundary.type';
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
