/* eslint-disable camelcase */
import ConstantHeadBoundary from './ConstantHeadBoundary';
import GeneralHeadBoundary from './GeneralHeadBoundary';
import HeadObservationWell from './HeadObservationWell';
import RechargeBoundary from './RechargeBoundary';
import RiverBoundary from './RiverBoundary';
import WellBoundary from './WellBoundary';

export default class BoundaryFactory {

    static availableTypes = ['chd', 'ghb', 'rch', 'riv', 'wel'];

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
            obj.features.forEach(feature => {
                if (BoundaryFactory.availableTypes.indexOf(feature.type) >= 0) {
                    const type = feature.properties.type;
                    return BoundaryFactory.createFromTypeAndObject(type, obj);
                }
            });
        }

        return null;
    };
}
