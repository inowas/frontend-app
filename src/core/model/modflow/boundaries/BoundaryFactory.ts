import {LineString, Point, Polygon} from 'geojson';
import BoundingBox from '../../geometry/BoundingBox';
import {ICells} from '../../geometry/Cells.type';
import {GeoJson} from '../../geometry/Geometry.type';
import GridSize from '../../geometry/GridSize';
import {
    BoundaryType,
    IBoundary,
    IBoundaryFeature, IBoundaryImport,
    ISpValues
} from './Boundary.type';
import ConstantHeadBoundary from './ConstantHeadBoundary';
import {IConstantHeadBoundary, IConstantHeadBoundaryImport} from './ConstantHeadBoundary.type';
import DrainageBoundary from './DrainageBoundary';
import {IDrainageBoundary, IDrainageBoundaryImport} from './DrainageBoundary.type';
import EvapotranspirationBoundary from './EvapotranspirationBoundary';
import {IEvapotranspirationBoundary, IEvapotranspirationBoundaryImport} from './EvapotranspirationBoundary.type';
import GeneralHeadBoundary from './GeneralHeadBoundary';
import {IGeneralHeadBoundary, IGeneralHeadBoundaryImport} from './GeneralHeadBoundary.type';
import HeadObservationWell from './HeadObservationWell';
import {IHeadObservationWell, IHeadObservationWellImport} from './HeadObservationWell.type';
import {Boundary} from './index';
import {IObservationPoint} from './ObservationPoint.type';
import RechargeBoundary from './RechargeBoundary';
import {IRechargeBoundary, IRechargeBoundaryImport} from './RechargeBoundary.type';
import RiverBoundary from './RiverBoundary';
import {IRiverBoundary, IRiverBoundaryImport} from './RiverBoundary.type';
import WellBoundary from './WellBoundary';
import {IWellBoundary, IWellBoundaryImport} from './WellBoundary.type';

export default abstract class BoundaryFactory {

    public static availableTypes = ['chd', 'drn', 'evt', 'ghb', 'hob', 'rch', 'riv', 'wel'];

    public static fromObject = (obj: IBoundary): Boundary => {
        let type;
        if (obj.type === 'Feature') {
            type = obj.properties.type;
        }

        if (obj.type === 'FeatureCollection') {
            obj.features.forEach((feature: IBoundaryFeature | IObservationPoint) => {
                if (feature.properties.type !== 'op') {
                    type = feature.properties.type;
                }
            });
        }

        switch (type) {
            case 'chd':
                return new ConstantHeadBoundary(obj as IConstantHeadBoundary);
            case 'drn':
                return new DrainageBoundary(obj as IDrainageBoundary);
            case 'evt':
                return new EvapotranspirationBoundary(obj as IEvapotranspirationBoundary);
            case 'ghb':
                return new GeneralHeadBoundary(obj as IGeneralHeadBoundary);
            case 'hob':
                return new HeadObservationWell(obj as IHeadObservationWell);
            case 'rch':
                return new RechargeBoundary(obj as IRechargeBoundary);
            case 'riv':
                return new RiverBoundary(obj as IRiverBoundary);
            case 'wel':
                return new WellBoundary(obj as IWellBoundary);
            default:
                throw new Error('BoundaryType ' + type + ' not implemented yet.');
        }
    };

    public static fromImport = (obj: IBoundaryImport, boundingBox: BoundingBox, gridSize: GridSize) => {
        const type = obj.type;
        switch (type) {
            case 'chd':
                return ConstantHeadBoundary.fromImport(obj as IConstantHeadBoundaryImport, boundingBox, gridSize);
            case 'drn':
                return DrainageBoundary.fromImport(obj as IDrainageBoundaryImport, boundingBox, gridSize);
            case 'evt':
                return EvapotranspirationBoundary.fromImport(
                    obj as IEvapotranspirationBoundaryImport, boundingBox, gridSize
                );
            case 'ghb':
                return GeneralHeadBoundary.fromImport(obj as IGeneralHeadBoundaryImport, boundingBox, gridSize);
            case 'hob':
                return HeadObservationWell.fromImport(obj as IHeadObservationWellImport, boundingBox, gridSize);
            case 'rch':
                return RechargeBoundary.fromImport(obj as IRechargeBoundaryImport, boundingBox, gridSize);
            case 'riv':
                return RiverBoundary.fromImport(obj as IRiverBoundaryImport, boundingBox, gridSize);
            case 'wel':
                return WellBoundary.fromImport(obj as IWellBoundaryImport, boundingBox, gridSize);
            default:
                throw new Error('BoundaryType ' + type + ' not implemented yet.');
        }
    };

    public static createNewFromProps(type: BoundaryType, id: string, geometry: GeoJson, name: string,
                                     layers: number[], cells: ICells, spValues: ISpValues) {
        switch (type) {
            case 'chd':
                return ConstantHeadBoundary.create(id, geometry as LineString, name, layers, cells, spValues);
            case 'drn':
                return DrainageBoundary.create(id, geometry as LineString, name, layers, cells, spValues);
            case 'evt':
                return EvapotranspirationBoundary.create(id, geometry as Polygon, name, layers,
                    cells, spValues, 1);
            case 'ghb':
                return GeneralHeadBoundary.create(id, geometry as LineString, name, layers, cells, spValues);
            case 'hob':
                return HeadObservationWell.create(id, geometry as Point, name, layers, cells, spValues);
            case 'rch':
                return RechargeBoundary.create(id, geometry as Polygon, name, layers, cells,
                    spValues, 1);
            case 'riv':
                return RiverBoundary.create(id, geometry as LineString, name, layers, cells, spValues);
            case 'wel':
                return WellBoundary.create(id, geometry as Point, name, layers, cells, spValues);
            default:
                throw new Error('BoundaryType ' + type + ' not implemented yet.');
        }
    }

    public static valuePropertiesByType(type: BoundaryType) {
        switch (type) {
            case 'chd':
                return ConstantHeadBoundary.valueProperties();
            case 'drn':
                return DrainageBoundary.valueProperties();
            case 'evt':
                return EvapotranspirationBoundary.valueProperties();
            case 'ghb':
                return GeneralHeadBoundary.valueProperties();
            case 'hob':
                return HeadObservationWell.valueProperties();
            case 'rch':
                return RechargeBoundary.valueProperties();
            case 'riv':
                return RiverBoundary.valueProperties();
            case 'wel':
                return WellBoundary.valueProperties();
            default:
                throw new Error('BoundaryType ' + type + ' not implemented yet.');
        }
    }

    public static geometryTypeByType(type: BoundaryType) {
        switch (type) {
            case 'chd':
                return ConstantHeadBoundary.geometryType();
            case 'drn':
                return DrainageBoundary.geometryType();
            case 'evt':
                return EvapotranspirationBoundary.geometryType();
            case 'ghb':
                return GeneralHeadBoundary.geometryType();
            case 'hob':
                return HeadObservationWell.geometryType();
            case 'rch':
                return RechargeBoundary.geometryType();
            case 'riv':
                return RiverBoundary.geometryType();
            case 'wel':
                return WellBoundary.geometryType();
            default:
                throw new Error('BoundaryType ' + type + ' not implemented yet.');
        }
    }
}
