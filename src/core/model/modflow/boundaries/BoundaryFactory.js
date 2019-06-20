/* eslint-disable camelcase */
import Uuid from 'uuid';
import ConstantHeadBoundary from './ConstantHeadBoundary';
import GeneralHeadBoundary from './GeneralHeadBoundary';
import HeadObservationWell from './HeadObservationWell';
import RechargeBoundary from './RechargeBoundary';
import RiverBoundary from './RiverBoundary';
import WellBoundary from './WellBoundary';
import {Geometry, LineBoundary} from '../index';
import Cells from '../../geometry/Cells';

export default class BoundaryFactory {

    static availableTypes = ['chd', 'ghb', 'hob', 'rch', 'riv', 'wel'];

    static fromType = (type) => {
        switch (type) {
            case 'chd':
                return new ConstantHeadBoundary();
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

    static getClassName = (type) => {
        switch (type) {
            case 'chd':
                return ConstantHeadBoundary;
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

    static createNewFromProps(type, id, geometry, name, layers, cells, spValues) {
        const className = BoundaryFactory.getClassName(type);
        return className.create(id, geometry, name, layers, cells, spValues);
    }

    static createFromTypeAndObject(type, obj) {
        const className = BoundaryFactory.getClassName(type);
        return className.fromObject(obj);
    }

    static fromObject = (obj) => {
        if (!obj) {
            return null;
        }

        if (obj.type === 'Feature') {
            const type = obj.properties.type;
            return BoundaryFactory.createFromTypeAndObject(type, obj);
        }

        if (obj.type === 'FeatureCollection') {
            let type = null;
            obj.features.forEach(feature => {
                if (BoundaryFactory.availableTypes.indexOf(feature.properties.type) >= 0) {
                    type = feature.properties.type;
                }
            });

            if (type) {
                return BoundaryFactory.createFromTypeAndObject(type, obj);
            }
        }
    };

    static fromImport = (obj, boundingBox, gridSize) => {
        if (!obj) {
            return null;
        }

        const type = obj.type;

        const boundary = BoundaryFactory.fromType(type);

        boundary.id = Uuid.v4();
        boundary.name = obj.name;
        boundary.geometry = obj.geometry;
        boundary.layers = obj.layers;
        const cells = Cells.fromGeometry(Geometry.fromGeoJson(obj.geometry), boundingBox, gridSize);

        if (boundary instanceof LineBoundary) {
            cells.calculateValues(boundary, boundingBox, gridSize);
            boundary.cells = cells.toArray();
            obj.ops.forEach(op => {
                boundary.addObservationPoint(op.name, op.geometry, op.sp_values);
            });

            return boundary;
        }

        if (boundary instanceof WellBoundary) {
            boundary.wellType = obj.well_type;
        }

        boundary.cells = cells.toArray();
        boundary.spValues = obj.sp_values;

        return boundary;
    };
}
