/* eslint-disable camelcase */
import Uuid from 'uuid';
import ConstantHeadBoundary from './ConstantHeadBoundary';
import GeneralHeadBoundary from './GeneralHeadBoundary';
import RechargeBoundary from './RechargeBoundary';
import RiverBoundary from './RiverBoundary';
import WellBoundary from './WellBoundary';
import HeadObservation from './HeadObservation';

export default class BoundaryFactory {

    static availableTypes = ['chd', 'ghb', 'rch', 'riv', 'wel'];

    static fromType = (type) => {
        switch (type) {
            case 'chd':
                return new ConstantHeadBoundary();
            case 'ghb':
                return new GeneralHeadBoundary();
            case 'hob':
                return new HeadObservation();
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

    static createNewFromType(id, name, type, geometry, spValues) {
        const boundary = BoundaryFactory.fromType(type);
        boundary.id = id;
        boundary.name = name;
        boundary.geometry = geometry;
        boundary.spValues = spValues;
        return boundary;
    }

    static createByTypeAndStartDate({id = null, name = null, type, geometry, utcIsoStartDateTimes}) {
        const boundary = BoundaryFactory.fromType(type);
        boundary.id = id ? id : Uuid.v4();
        boundary.name = name ? name : 'new ' + type + '-boundary';
        boundary.geometry = geometry;
        boundary.setDefaultStartValues(utcIsoStartDateTimes);
        return boundary;
    }

    static fromObject = (obj) => {
        if (!obj) {
            return null;
        }

        if (obj.type === 'Feature') {
            const type = obj.properties.type;
            return BoundaryFactory.createNewFromType(type);
        }

        if (obj.type === 'FeatureCollection') {
            obj.features.forEach(feature => {
                if (BoundaryFactory.availableTypes.indexOf(feature.type) >= 0) {
                    const type = feature.properties.type;
                    return BoundaryFactory.createNewFromType(type);
                }
            });
        }

        return null;
    };
}
