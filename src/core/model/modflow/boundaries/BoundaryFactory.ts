/* eslint-disable camelcase */
import {LineString, MultiPolygon, Point, Polygon} from 'geojson';
import Uuid from 'uuid';
import BoundingBox from '../../geometry/BoundingBox';
import Cells from '../../geometry/Cells';
import {GeoJson} from '../../geometry/Geometry';
import GridSize from '../../geometry/GridSize';
import {Geometry, LineBoundary} from '../index';
import Boundary from './Boundary';
import ConstantHeadBoundary from './ConstantHeadBoundary';
import DrainageBoundary from './DrainageBoundary';
import EvapotranspirationBoundary from './EvapotranspirationBoundary';
import {IEvapotranspirationBoundary} from './EvapotranspirationBoundary.type';
import GeneralHeadBoundary from './GeneralHeadBoundary';
import HeadObservationWell from './HeadObservationWell';
import {IHeadObservationWell} from './HeadObservationWell.type';
import {ILineBoundary} from './LineBoundary.type';
import ObservationPoint from './ObservationPoint';
import {IObservationPoint} from './ObservationPoint.type';
import RechargeBoundary from './RechargeBoundary';
import {IRechargeBoundary} from './RechargeBoundary.type';
import RiverBoundary from './RiverBoundary';
import {
    BoundaryInstance, BoundaryType, IBoundaryImport, IObservationPointImport,
    SpValues
} from './types';
import WellBoundary from './WellBoundary';
import {IWellBoundary} from './WellBoundary.type';

interface IIndexedBoundary extends Boundary {
    [name: string]: any;
}

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

    public static getClassName = (type: BoundaryType) => {
        switch (type) {
            case 'chd':
                return ConstantHeadBoundary;
            case 'drn':
                return DrainageBoundary;
            case 'evt':
                return EvapotranspirationBoundary;
            case 'ghb':
                return GeneralHeadBoundary;
            case 'hob':
                return HeadObservationWell;
            case 'rch':
                return RechargeBoundary;
            case 'riv':
                return RiverBoundary;
            case 'wel':
                return WellBoundary;
            default:
                throw new Error('BoundaryType ' + type + ' not implemented yet.');
        }
    };

    public static createNewFromProps(type: 'chd', id: string, geometry: LineString, name: string, layers: number[], cells: Cells, spValues: SpValues): ConstantHeadBoundary;
    public static createNewFromProps(type: 'drn', id: string, geometry: LineString, name: string, layers: number[], cells: Cells, spValues: SpValues): DrainageBoundary;
    public static createNewFromProps(type: 'evt', id: string, geometry: Polygon | MultiPolygon, name: string, layers: number[], cells: Cells, spValues: SpValues): EvapotranspirationBoundary;
    public static createNewFromProps(type: 'ghb', id: string, geometry: LineString, name: string, layers: number[], cells: Cells, spValues: SpValues): GeneralHeadBoundary;
    public static createNewFromProps(type: 'hob', id: string, geometry: Point, name: string, layers: number[], cells: Cells, spValues: SpValues): HeadObservationWell;
    public static createNewFromProps(type: 'rch', id: string, geometry: Polygon | MultiPolygon, name: string, layers: number[], cells: Cells, spValues: SpValues): RechargeBoundary;
    public static createNewFromProps(type: 'riv', id: string, geometry: LineString, name: string, layers: number[], cells: Cells, spValues: SpValues): RiverBoundary;
    public static createNewFromProps(type: 'wel', id: string, geometry: Point, name: string, layers: number[], cells: Cells, spValues: SpValues): WellBoundary;
    public static createNewFromProps(type: any, id: string, geometry: GeoJson, name: string, layers: number[], cells: Cells, spValues: SpValues) {
        const className = BoundaryFactory.getClassName(type);
        return className.create(id, type, geometry, name, layers, cells, spValues);
    }

    public static createFromTypeAndObject(type: 'chd', obj: ILineBoundary): ConstantHeadBoundary;
    public static createFromTypeAndObject(type: 'drn', obj: ILineBoundary): DrainageBoundary;
    public static createFromTypeAndObject(type: 'evt', obj: IEvapotranspirationBoundary): EvapotranspirationBoundary;
    public static createFromTypeAndObject(type: 'ghb', obj: ILineBoundary): GeneralHeadBoundary;
    public static createFromTypeAndObject(type: 'hob', obj: IHeadObservationWell): HeadObservationWell;
    public static createFromTypeAndObject(type: 'op', obj: IObservationPoint): ObservationPoint;
    public static createFromTypeAndObject(type: 'rch', obj: IRechargeBoundary): RechargeBoundary;
    public static createFromTypeAndObject(type: 'riv', obj: ILineBoundary): RiverBoundary;
    public static createFromTypeAndObject(type: 'wel', obj: IWellBoundary): WellBoundary;
    public static createFromTypeAndObject(type: any, obj: any) {
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
            case 'op':
                return ObservationPoint.fromObject(obj);
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

    public static fromObject = (obj: BoundaryInstance): IIndexedBoundary | null => {
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
            boundary.cells = cells;
            obj.ops.forEach((op: IObservationPointImport) => {
                boundary.addObservationPoint(op.name, op.geometry, op.sp_values);
            });

            return boundary;
        }

        if (boundary instanceof WellBoundary) {
            boundary.wellType = obj.well_type;
        }

        boundary.cells = cells;

        if (!(boundary instanceof LineBoundary)) {
            boundary.spValues = obj.sp_values;
        }

        return boundary;
    };
}
