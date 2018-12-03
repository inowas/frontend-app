import uuid from 'uuid';
import {includes} from 'lodash';
import {ActiveCells, BoundingBox, Geometry, GridSize, Stressperiods} from './index';

export default class ModflowModel {

    _id;
    _name;
    _description;
    _activeCells;
    _boundingBox;
    _geometry;
    _gridSize;
    _lengthUnit;
    _permissions;
    _public;
    _stressPeriods;
    _timeUnit;

    static fromDefaults() {
        const model = new ModflowModel();
        model.id = uuid();
        model.name = 'New numerical groundwater model';
        model.description = 'Here you can say a bit more about the project';
        model.gridSize = GridSize.fromNxNy(100, 100);
        model.lengthUnit = 2;
        model.timeUnit = 4;
        model.public = true;
        model.permissions = 'rwx';
        return model;
    }

    static fromObject(obj) {
        const model = new ModflowModel();
        model.id = obj.id;
        model.name = obj.name;
        model.description = obj.description;
        model.activeCells = obj.active_cells ? ActiveCells.fromArray(obj.active_cells) : null;
        model.boundingBox = obj.bounding_box ? BoundingBox.fromArray(obj.bounding_box) : null;
        model.geometry = obj.geometry ? Geometry.fromObject(obj.geometry) : null;
        model.gridSize = obj.grid_size ? GridSize.fromObject(obj.grid_size) : null;
        model.lengthUnit = obj.length_unit;
        model.timeUnit = obj.time_unit;
        model.public = obj.public;
        model.permissions = obj.permissions;
        model.stressPeriods = obj.stress_periods ? Stressperiods.fromObject(obj.stress_periods) : null;
        return model;
    }

    static fromQuery(query) {
        return ModflowModel.fromObject(query);
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

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get activeCells() {
        return this._activeCells;
    }

    set activeCells(value) {
        this._activeCells = value;
    }

    get boundaries() {
        return this._boundaries;
    }

    set boundaries(value) {
        this._boundaries = value;
    }

    get boundingBox() {
        return this._boundingBox;
    }

    set boundingBox(value) {
        this._boundingBox = value;
    }

    get geometry() {
        return this._geometry;
    }

    set geometry(value) {
        this._geometry = value;
    }

    get gridSize() {
        return this._gridSize;
    }

    set gridSize(value) {
        this._gridSize = value;
    }

    get lengthUnit() {
        return this._lengthUnit;
    }

    set lengthUnit(value) {
        this._lengthUnit = value;
    }

    get permissions() {
        return this._permissions;
    }

    set permissions(value) {
        this._permissions = value;
    }

    get public() {
        return this._public;
    }

    set public(value) {
        this._public = value;
    }

    get stressPeriods() {
        return this._stressPeriods;
    }

    set stressPeriods(value) {
        this._stressPeriods = value;
    }

    get timeUnit() {
        return this._timeUnit;
    }

    set timeUnit(value) {
        this._timeUnit = value;
    }

    get readOnly() {
        return !includes(this.permissions, 'w');
    }

    toObject() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            active_cells: this.activeCells ? this.activeCells.toArray() : null,
            boundaries: this.boundaries,
            bounding_box: this.boundingBox ? this.boundingBox.toArray() : null,
            geometry: this.geometry ? this.geometry.toObject() : null,
            grid_size: this.gridSize ? this.gridSize.toObject() : null,
            length_unit: this.lengthUnit,
            permissions: this.permissions,
            public: this.public,
            stress_periods: this.stressPeriods ? this.stressPeriods.toObject() : null,
            time_unit: this.timeUnit,
        }
    }
}
