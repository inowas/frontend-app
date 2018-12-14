import {includes} from 'lodash';
import {ActiveCells, BoundingBox, Geometry, GridSize, Stressperiods} from './index';
import {Mt3dms} from './mt3d';

export default class ModflowModel {

    _id;
    _name;
    _description;
    _activeCells;
    _boundingBox;
    _geometry;
    _gridSize;
    _lengthUnit;
    _mt3dms;
    _permissions;
    _public;
    _stressperiods;
    _timeUnit;

    static fromObject(obj) {
        const model = new ModflowModel();
        model.id = obj.id;
        model.name = obj.name;
        model.description = obj.description;
        model.geometry = Geometry.fromObject(obj.geometry);
        model.gridSize = GridSize.fromObject(obj.grid_size);
        model.boundingBox = BoundingBox.fromArray(obj.bounding_box);
        model.activeCells = ActiveCells.fromArray(obj.active_cells);
        model.lengthUnit = obj.length_unit;
        model.mt3dms = obj.mt3dms ? Mt3dms.fromObject(obj.mt3dms) : Mt3dms.fromDefaults();
        model.permissions = obj.permissions;
        model.public = obj.public;
        model.stressperiods = (obj.stress_periods) ? Stressperiods.fromObject(obj.stress_periods) : Stressperiods.fromDefaults();
        model.timeUnit = obj.time_unit;
        return model;
    }

    static fromParameters(id, name, description, geometry, boundingBox, gridSize, activeCells, lengthUnit, timeUnit, stressperiods, isPublic) {
        const model = new ModflowModel();
        model._id = id;
        model._name = name;
        model._description = description;
        model._activeCells = (activeCells instanceof ActiveCells) ? activeCells.toArray() : activeCells;
        model._boundingBox = (boundingBox instanceof BoundingBox) ? boundingBox.toArray() : boundingBox;
        model._geometry = (geometry instanceof Geometry) ? geometry.toObject() : geometry;
        model._gridSize = (gridSize instanceof GridSize) ? gridSize.toObject() : gridSize;
        model._lengthUnit = lengthUnit;
        model._timeUnit = timeUnit;
        model._public = isPublic;
        model._stressperiods = (stressperiods instanceof Stressperiods) ? stressperiods.toObject() : stressperiods;
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

    get mt3dms() {
        return this._mt3dms;
    }

    set mt3dms(value) {
        this._mt3dms = value;
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

    get stressperiods() {
        return this._stressperiods;
    }

    set stressperiods(value) {
        this._stressperiods = value;
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

    toObject = () => ({
        id: this.id,
        name: this.name,
        description: this.description,
        active_cells: this.activeCells.toArray(),
        bounding_box: this.boundingBox.toArray(),
        geometry: this.geometry.toObject(),
        grid_size: this.gridSize.toObject(),
        length_unit: this.lengthUnit,
        mt3dms: this.mt3dms.toObject(),
        permissions: this.permissions,
        public: this.public,
        stress_periods: this.stressperiods.toObject(),
        time_unit: this.timeUnit,
    });

    toPayload = () => ({
        id: this._id,
        name: this._name,
        description: this._description,
        active_cells: this._activeCells,
        bounding_box: this._boundingBox,
        geometry: this._geometry,
        grid_size: this._gridSize,
        length_unit: this._lengthUnit,
        mt3dms: this._mt3dms,
        permissions: this._permissions,
        public: this._public,
        stress_periods: this._stressperiods,
        time_unit: this._timeUnit,
    });
}
