import {LineString} from 'geojson';
import {ICells} from '../../geometry/Cells.type';
import {IBoundaryFeatureCollection} from './Boundary.type';
import {IObservationPoint} from './ObservationPoint.type';

export interface IDrainageBoundary extends IBoundaryFeatureCollection {
    type: 'FeatureCollection';
    features: Array<IObservationPoint | IDrainageBoundaryFeature>;
}

export interface IDrainageBoundaryFeature {
    type: 'Feature';
    id: string;
    geometry: LineString;
    properties: {
        type: 'drn';
        name: string;
        layers: number[];
        cells: ICells;
    };
}
