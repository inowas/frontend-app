/* eslint-disable camelcase */
import {LineString, MultiPolygon, Point, Polygon} from 'geojson';
import Uuid from 'uuid';
import BoundingBox from '../../geometry/BoundingBox';
import Cells from '../../geometry/Cells';
import {ICells} from '../../geometry/Cells.type';
import {GeoJson} from '../../geometry/Geometry.type';
import GridSize from '../../geometry/GridSize';
import {Geometry, LineBoundary} from '../index';
import Boundary from './Boundary';
import ConstantHeadBoundary from './ConstantHeadBoundary';
import DrainageBoundary from './DrainageBoundary';
import EvapotranspirationBoundary from './EvapotranspirationBoundary';
import GeneralHeadBoundary from './GeneralHeadBoundary';
import HeadObservationWell from './HeadObservationWell';
import ObservationPoint from './ObservationPoint';
import RechargeBoundary from './RechargeBoundary';
import RiverBoundary from './RiverBoundary';
import {
    BoundaryInstance, BoundaryType, IBoundaryImport, IObservationPointImport,
    SpValues
} from './types';
import WellBoundary from './WellBoundary';

export default class BoundaryFactory {

    public static availableTypes = ['chd', 'drn', 'evt', 'ghb', 'hob', 'rch', 'riv', 'wel'];

    public static fromType = (type: BoundaryType) => {
        switch (type) {
            case 'chd':
                return new ConstantHeadBoundary();
            case 'drn':
                return new DrainageBoundary();
            case 'evt':
                return new EvapotranspirationBoundary();
            case 'ghb':
                return new GeneralHeadBoundary();
            case 'hob':
                return new HeadObservationWell();
            case 'rch':
                return new RechargeBoundary();
            case 'riv':
                return new RiverBoundary();
            case 'wel':
                return new WellBoundary();
            default:
                throw new Error('BoundaryType ' + type + ' not implemented yet.');
        }
    };

    public static createNewFromProps(type: BoundaryType | 'op', id: string, geometry: GeoJson, name: string,
                                     layers: number[], cells: ICells, spValues: SpValues) {
        switch (type) {
            case 'chd':
                return ConstantHeadBoundary.create(id, type, geometry as LineString, name, layers, cells, spValues);
            case 'drn':
                return DrainageBoundary.create(id, type, geometry as LineString, name, layers, cells, spValues);
            case 'evt':
                return EvapotranspirationBoundary.create(id, type, geometry as Polygon | MultiPolygon, name, layers,
                    cells, spValues);
            case 'ghb':
                return GeneralHeadBoundary.create(id, type, geometry as LineString, name, layers, cells, spValues);
            case 'hob':
                return HeadObservationWell.create(id, type, geometry as Point, name, layers, cells, spValues);
            case 'op':
                return ObservationPoint.create(id, type, geometry as Point, name, spValues);
            case 'rch':
                return RechargeBoundary.create(id, type, geometry as Polygon | MultiPolygon, name, layers, cells,
                    spValues);
            case 'riv':
                return RiverBoundary.create(id, type, geometry as LineString, name, layers, cells, spValues);
            case 'wel':
                return WellBoundary.create(id, type, geometry as Point, name, layers, cells, spValues);
            default:
                throw new Error('BoundaryType ' + type + ' not implemented yet.');
        }
    }

    public static createFromTypeAndObject(type: BoundaryType | 'op', obj: any): Boundary {
        switch (type) {
            case 'chd':
                return ConstantHeadBoundary.fromObject(obj);
            case 'drn':
                return DrainageBoundary.fromObject(obj);
            case 'evt':
                return EvapotranspirationBoundary.fromObject(obj);
            case 'ghb':
                return GeneralHeadBoundary.fromObject(obj);
            case 'hob':
                return HeadObservationWell.fromObject(obj);
            case 'rch':
                return RechargeBoundary.fromObject(obj);
            case 'riv':
                return RiverBoundary.fromObject(obj);
            case 'wel':
                return WellBoundary.fromObject(obj);
            default:
                throw new Error('BoundaryType ' + type + ' not implemented yet.');
        }
    }

    public static fromObject = (obj: BoundaryInstance): Boundary | null => {
        if (!obj) {
            return null;
        }

        if (obj.type === 'Feature' && obj.properties.type !== '') {
            const type = obj.properties.type;
            return BoundaryFactory.createFromTypeAndObject(type, obj);
        }

        if (obj.type === 'FeatureCollection') {
            let type = null;
            obj.features.forEach((feature) => {
                if (BoundaryFactory.availableTypes.indexOf(feature.properties.type) >= 0) {
                    type = feature.properties.type;
                }
            });

            if (type) {
                return BoundaryFactory.createFromTypeAndObject(type, obj);
            }
        }

        return null;
    };

    public static fromImport = (obj: IBoundaryImport, boundingBox: BoundingBox, gridSize: GridSize) => {
        const type = obj.type;
        const boundary = BoundaryFactory.fromType(type);

        boundary.id = Uuid.v4();
        boundary.name = obj.name;
        boundary.geometry = obj.geometry;
        boundary.layers = obj.layers;
        const cells = Cells.fromGeometry(Geometry.fromGeoJson(obj.geometry), boundingBox, gridSize);

        if (boundary instanceof LineBoundary && obj.ops) {
            cells.calculateValues(boundary, boundingBox, gridSize);
            boundary.cells = cells.toArray();
            obj.ops.forEach((op: IObservationPointImport) => {
                boundary.addObservationPoint(op.name, op.geometry, op.sp_values);
            });

            return boundary;
        }

        if (boundary instanceof WellBoundary) {
            boundary.wellType = obj.well_type;
        }

        boundary.cells = cells.toArray();

        if (!(boundary instanceof LineBoundary)) {
            boundary.spValues = obj.sp_values;
        }

        return boundary;
    };
}
