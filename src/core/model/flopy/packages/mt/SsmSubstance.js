import Uuid from 'uuid';
import SsmBoundaryValues from './SsmBoundaryValues';

class SsmSubstance {

    _id = '';
    _name = '';
    _boundaryValuesList = [];

    static create(name) {
        const substance = new SsmSubstance();
        substance._id = Uuid.v4();
        substance._name = name;
        return substance;
    }

    static fromObject(obj) {
        const substance = new SsmSubstance();
        substance._id = obj.id;
        substance._name = obj.name;
        substance._boundaries = obj.boundaryValues;
        return substance;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get boundaryValuesList() {
        return this._boundaryValuesList.map(bv => SsmBoundaryValues.fromObject(bv));
    }

    set boundaryValuesList(values) {
        this._boundaryValuesList = values.map(v => v.toObject());
    }

    getBoundaryValuesByBoundaryId(boundaryId) {
        const boundaryValues = this.boundaryValuesList.filter(bv => bv.boundaryId === boundaryId)[0];
        if (boundaryValues instanceof SsmBoundaryValues) {
            return boundaryValues;
        }
        return null;
    }

    updateBoundaryValues(ssmBoundaryValues) {
        if (!(ssmBoundaryValues instanceof SsmBoundaryValues)) {
            throw new Error('SsmBoundaryValues must be instanceof SsmBoundaryValues');
        }

        const boundaryValues = this.boundaryValuesList;

        if (boundaryValues.filter(bv => bv.boundaryId === ssmBoundaryValues.boundaryId).length === 0) {
            boundaryValues.push(ssmBoundaryValues);
            this.boundaryValuesList = boundaryValues;
            return;
        }

        this.boundaryValuesList = this.boundaryValuesList.map(bv => {
            if (bv.boundaryId === ssmBoundaryValues.boundaryId) {
                return ssmBoundaryValues;
            }
            return bv;
        });
    }

    removeBoundaryValues(boundaryId) {
        this.boundaryValuesList = this.boundaryValuesList.filter(bv => bv._boundaryId !== boundaryId);
    }

    toSsmPackageValues() {
        let ssmPackageValues = [];
        this.boundaryValuesList.forEach((bv, idx) => {
            if (idx === 0) {
                ssmPackageValues = bv.toSsmPackageValues();
            }

            if (idx > 0) {
                ssmPackageValues.push(...bv.toSsmPackageValues());
            }
        });

        return ssmPackageValues;
    }

    toObject() {
        return {
            id: this.id,
            name: this._name,
            boundaryValues: this._boundaryValuesList
        };
    }
}

export default SsmSubstance;
