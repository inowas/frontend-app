import {CriteriaCollection, WeightAssignmentsCollection} from './criteria';
import {ActiveCells, BoundingBox, Geometry, GridSize} from '../model/modflow';

class MCDA {
    _criteria = new CriteriaCollection();
    /*_meta = {
        _activeCells: new ActiveCells(),
        _boundingBox: null,
        _geometry: null,
        _griSize: new GridSize(),
    };*/
    _weightAssignments = new WeightAssignmentsCollection();


    static fromObject(obj) {
        const mcda = new MCDA();
        mcda.criteriaCollection = CriteriaCollection.fromArray(obj.criteria);
        /*mcda.activeCells = ActiveCells.fromArray(obj._meta.activeCells);
        mcda.boundingBox = BoundingBox.fromArray(obj._meta.boundingBox);
        mcda.geometry = Geometry.fromObject(obj._meta.geometry);
        mcda.gridSize = GridSize.fromObject(obj._meta.gridSize);*/
        mcda.weightAssignmentsCollection = WeightAssignmentsCollection.fromArray(obj.weightAssignments);
        return mcda;
    }

    get criteriaCollection() {
        return this._criteria;
    }

    set criteriaCollection(value) {
        this._criteria = value;
    }

    get weightAssignmentsCollection() {
        return this._weightAssignments;
    }

    set weightAssignmentsCollection(value) {
        this._weightAssignments = value;
    }

    get activeCells() {
        return this._meta._activeCells;
    }

    set activeCells(value) {
        this._meta._activeCells = value;
    }

    get boundingBox() {
        return this._meta._boundingBox;
    }

    set boundingBox(value) {
        this._meta._boundingBox = value;
    }

    get geometry() {
        return this._meta._geometry;
    }

    set geometry(value) {
        this._meta._geometry = value;
    }

    get gridSize() {
        return this._meta._griSize;
    }

    set gridSize(value) {
        this._meta._griSize = value;
    }

    toObject() {
        return ({
            criteria: this.criteriaCollection.toArray(),
            /*_meta: {
                activeCells: this.activeCells,
                boundingBox: this.boundingBox,
                geometry: this.geometry,
                gridSize: this.gridSize
            },*/
            weightAssignments: this.weightAssignmentsCollection.toArray()
        });
    }

    updateCriteria(criteriaCollection) {
        if (!(criteriaCollection instanceof CriteriaCollection)) {
            throw new Error('CriteriaCollection expected to be of type CriteriaCollection.');
        }

        this.criteriaCollection = criteriaCollection;
    }
}

export default MCDA;