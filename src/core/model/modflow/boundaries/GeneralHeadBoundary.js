/* eslint-disable camelcase */
import MultipleOPBoundary from './MultipleOPBoundary';
import BoundaryFactory from './BoundaryFactory';

const boundaryType = 'ghb';

export default class GeneralHeadBoundary extends MultipleOPBoundary {

    static createWithStartDate({id = null, name = null, geometry, utcIsoStartDateTime}) {
        return BoundaryFactory.createByTypeAndStartDate({id, name, type: boundaryType, geometry, utcIsoStartDateTime});
    }

    static createFromObject(objectData) {
        objectData.type = boundaryType;
        return BoundaryFactory.fromObjectData(objectData);
    }

    constructor() {
        super();

        // head—is the head on the boundary.
        const head = 0;
        // cond—is the hydraulic conductance of the interface between the aquifer cell and the boundary.
        const cond = 0;

        this._defaultValues = [head, cond];
        this._type = boundaryType;
    }

    isValid() {
        super.isValid();

        if (!(this._type === boundaryType)) {
            throw new Error('The parameter type is not not valid.');
        }

        // noinspection RedundantIfStatementJS
        if (this.geometry.type !== 'LineString') {
            throw new Error('The parameter geometry.type is not not valid.');
        }

        return true;
    }

    get geometryType() {
        return 'LineString';
    }

    get valueProperties() {
        return [
            {
                name: 'Head',
                description:'Groundwater Head',
                unit: 'm',
                decimals: 2
            },
            {
                name: 'Conductance',
                description: 'Hydraulic conductance',
                unit: 'm/day',
                decimals: 2
            }
        ]
    }
}
