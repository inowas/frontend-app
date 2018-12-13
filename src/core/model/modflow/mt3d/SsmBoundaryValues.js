import SsmPackage from './SsmPackage';
import Boundary from '../boundaries/Boundary';
import AffectedCells from '../boundaries/AffectedCells';

class SsmBoundaryValues {

    _affectedCells;
    _boundaryType;
    _boundaryId;
    _stressPeriodValues;

    static create(boundary, numberOfStressPeriods) {
        const value = new SsmBoundaryValues();

        if (!(boundary instanceof Boundary)) {
            throw new Error('Boundary must be from instance Boundary');
        }

        value._affectedCells = boundary.affectedCells.toObject;
        value._boundaryId = boundary.id;
        value._boundaryType = boundary.type;
        value._stressPeriodValues = new Array(numberOfStressPeriods).fill(0);
        return value;
    }

    static fromObject(obj) {
        const substance = new SsmBoundaryValues();
        substance._affectedCells = obj.affectedCells;
        substance._boundaryId = obj.boundaryId;
        substance._boundaryType = obj.boundaryType;
        substance._stressPeriodValues = obj.stressPeriodValues;
        return substance;
    }

    get affectedCells() {
        return AffectedCells.fromObject(this._affectedCells);
    }

    get boundaryId() {
        return this._boundaryId;
    }

    get boundaryType() {
        return this._boundaryType;
    }

    get stressPeriodValues() {
        return this._stressPeriodValues;
    }

    set stressPeriodValues(value) {
        this._stressPeriodValues = value;
    }

    get values() {
        return this.stressPeriodValues;
    }

    set values(value) {
        this.stressPeriodValues = value;
    }

    get toSsmPackageValues() {
        return (
            this.stressPeriodValues.map(sp => {
                const spData = [];
                this.affectedCells.cells.forEach(c => {
                    spData.push([c[2], c[1], c[0], sp, SsmPackage.itype[this.boundaryType.toUpperCase()]]);
                });
                return spData;
            })
        );
    }

    get toObject() {
        return {
            affectedCells: this._affectedCells,
            boundaryId: this.boundaryId,
            boundaryType: this.boundaryType,
            stressPeriodValues: this.stressPeriodValues,
        };
    }
}

export default SsmBoundaryValues;
