/* eslint-disable camelcase */
import Uuid from 'uuid';
import ConstantHeadBoundary from './ConstantHeadBoundary';
import GeneralHeadBoundary from './GeneralHeadBoundary';
import RechargeBoundary from './RechargeBoundary';
import RiverBoundary from './RiverBoundary';
import WellBoundary from './WellBoundary';
import HeadObservation from './HeadObservation';
import Geometry from '../Geometry';
import {ActiveCells} from '../index';

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

    static createByTypeAndStartDate({id = null, name = null, type, geometry, utcIsoStartDateTimes}) {
        const boundary = BoundaryFactory.fromType(type);
        id ? boundary.id = id : boundary._id = Uuid.v4();
        name ? boundary.name = name : boundary._name = 'new ' + type + '-boundary';
        boundary.geometry = geometry;
        boundary.setDefaultStartValues(utcIsoStartDateTimes);
        return boundary;
    }

    static fromObjectData = (objectData) => {
        if (!objectData) {
            return null;
        }

        const {id, name, geometry, type, affected_layers, metadata, date_time_values, observation_points, active_cells} = objectData;
        const boundary = BoundaryFactory.fromType(type);

        boundary.id = id;
        boundary.name = name;
        boundary.geometry = Geometry.fromObject(geometry);
        boundary.affectedLayers = affected_layers;
        boundary.metadata = metadata;
        boundary.activeCells = ActiveCells.fromArray(active_cells);

        if (date_time_values) {
            boundary.setDateTimeValues(date_time_values);
        }

        if (observation_points) {
            boundary.observationPoints = observation_points;
        }

        return boundary;
    };
}
