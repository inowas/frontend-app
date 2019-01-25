import BoundaryFactory from './BoundaryFactory';
import SingleOPBoundary from './SingleOPBoundary';

const boundaryType = 'rch';

export default class RechargeBoundary extends SingleOPBoundary {

    static createWithStartDate({id = null, name = null, geometry, utcIsoStartDateTime}) {
        return BoundaryFactory.createByTypeAndStartDate({id, name, type: boundaryType, geometry, utcIsoStartDateTimes: utcIsoStartDateTime});
    }

    static createFromObject(objectData) {
        objectData.type = boundaryType;
        return BoundaryFactory.fromObjectData(objectData);
    }

    constructor() {
        super();
        this._defaultValues = [0];
        this._type = boundaryType;
    }

    isValid() {
        super.isValid();

        if (!(this._type === boundaryType)) {
            throw new Error('The parameter type is not not valid.');
        }

        // noinspection RedundantIfStatementJS
        if (this.geometry.type !== 'Polygon') {
            throw new Error('The parameter geometry.type is not not valid.');
        }

        return true;
    }

    get geometryType() {
        return 'Polygon';
    }


    get valueProperties() {
        return [
            {
                name: 'Recharge rate',
                description:'Recharge rate to the groundwater head',
                unit: 'm/day',
                decimals: 5
            }
        ]
    }
}
