import MultipleOPBoundary from './MultipleOPBoundary';
import BoundaryFactory from './BoundaryFactory';

const boundaryType = 'chd';

export default class ConstantHeadBoundary extends MultipleOPBoundary {

    static createWithStartDate({id = null, name = null, geometry, utcIsoStartDateTime}) {
        return BoundaryFactory.createByTypeAndStartDate({id, name, type: boundaryType, geometry, utcIsoStartDateTime});
    }

    static createFromObject(objectData) {
        objectData.type = boundaryType;
        return BoundaryFactory.fromObjectData(objectData);
    }

    constructor() {
        super();

        // Shead—is the head at the boundary at the start of the stress period.
        const sHead = 0;
        // Ehead—is the head at the boundary at the end of the stress period.
        const eHead = 0;

        this._defaultValues = [sHead, eHead];
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
}
