import {includes} from 'lodash';
import {Cells, BoundingBox, Geometry, GridSize, Stressperiods} from './index';
import {Mt3dms} from './mt3d';
import Calculation from './Calculation';

export default class ModflowModel {

    _id;
    _name;
    _description;
    _public;

    _geometry;
    _boundingBox;
    _gridSize;
    _cells;
    _lengthUnit;

    _stressperiods;
    _timeUnit;

    _mt3dms;
    _calculation;
    _permissions;

    static fromObject(obj) {
        const model = new ModflowModel();
        model.id = obj.id;
        model.name = obj.name;
        model.description = obj.description;
        model.public = obj.public;

        model.geometry = Geometry.fromObject(obj.geometry);
        model.boundingBox = BoundingBox.fromArray(obj.bounding_box);
        model.gridSize = GridSize.fromObject(obj.grid_size);
        model.cells = Cells.fromArray(obj.cells);
        model.lengthUnit = obj.length_unit;

        model.stressperiods = (obj.stressperiods) ? Stressperiods.fromObject(obj.stressperiods) : Stressperiods.fromDefaults();
        model.timeUnit = obj.time_unit;

        model.mt3dms = obj.mt3dms ? Mt3dms.fromObject(obj.mt3dms) : Mt3dms.fromDefaults();
        model.calculation = obj.calculation ? Calculation.fromObject(obj.calculation) : null;
        model.permissions = obj.permissions;
        return model;
    }

    static createFromParameters(id, name, description, geometry, boundingBox, gridSize, cells, lengthUnit, timeUnit, stressperiods, isPublic) {
        const model = new ModflowModel();
        model._id = id;
        model._name = name;
        model._description = description;
        model._public = isPublic;

        model._geometry = (geometry instanceof Geometry) ? geometry.toObject() : geometry;
        model._boundingBox = (boundingBox instanceof BoundingBox) ? boundingBox.toArray() : boundingBox;
        model._gridSize = (gridSize instanceof GridSize) ? gridSize.toObject() : gridSize;
        model._cells = (cells instanceof Cells) ? cells.toArray(): cells;
        model._lengthUnit = lengthUnit;

        model._stressperiods = (stressperiods instanceof Stressperiods) ? stressperiods.toObject() : stressperiods;
        model._timeUnit = timeUnit;
        return model;
    }

    static fromQuery(query) {
        const model = new ModflowModel();
        model.id = query.id;
        model.name = query.name;
        model.description = query.description;
        model.public = query.public;
        model.permissions = query.permissions;

        const {discretization} = query;

        model.geometry = Geometry.fromObject(discretization.geometry);
        model.boundingBox = BoundingBox.fromArray(discretization.bounding_box);
        model.gridSize = GridSize.fromObject(discretization.grid_size);
        model.cells = Cells.fromArray(discretization.cells);
        model.lengthUnit = discretization.length_unit;

        model.stressperiods = (discretization.stressperiods) ? Stressperiods.fromObject(discretization.stressperiods) : Stressperiods.fromDefaults();
        model.timeUnit = discretization.time_unit;

        model.mt3dms = Mt3dms.fromDefaults();

        return model;
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

    get cells() {
        return this._cells;
    }

    set cells(value) {
        this._cells = value;
    }

    get boundingBox() {
        return this._boundingBox;
    }

    set boundingBox(value) {
        this._boundingBox = value;
    }

    get calculation() {
        return this._calculation;
    }

    set calculation(value) {
        this._calculation = value;
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

    get isPublic() {
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
        cells: this.cells.toArray(),
        bounding_box: this.boundingBox.toArray(),
        geometry: this.geometry.toObject(),
        grid_size: this.gridSize.toObject(),
        length_unit: this.lengthUnit,
        mt3dms: this.mt3dms.toObject(),
        permissions: this.permissions,
        public: this.public,
        stressperiods: this.stressperiods.toObject(),
        time_unit: this.timeUnit,
        calculation: (this.calculation instanceof Calculation) ? this.calculation.toObject() : null
    });

    toPayload = () => ({
        id: this._id,
        name: this._name,
        description: this._description,
        public: this._public,

        geometry: (this._geometry instanceof Geometry) ? this._geometry.toObject() : this._geometry,
        bounding_box: (this._boundingBox instanceof BoundingBox) ? this._boundingBox.toArray() : this._boundingBox,
        grid_size: (this._gridSize instanceof GridSize) ? this._gridSize.toObject() : this._gridSize,
        cells: this._cells,
        length_unit: this._lengthUnit,

        stressperiods: (this._stressperiods instanceof Stressperiods) ? this._stressperiods.toObject() : this._stressperiods,
        time_unit: this._timeUnit,

        mt3dms: (this._mt3dms instanceof Mt3dms) ? this._mt3dms.toObject() : this._mt3dms
    });
}
