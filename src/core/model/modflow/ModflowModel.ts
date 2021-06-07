import {BoundingBox, Cells, Geometry, GridSize, LengthUnit, Stressperiods, TimeUnit} from './index';
import {IDiscretization, IModflowModel} from './ModflowModel.type';
import {cloneDeep, includes} from 'lodash';

export default class ModflowModel {

  get id(): string {
    return this._props.id;
  }

  set id(value) {
    this._props.id = value;
  }

  get name(): string {
    return this._props.name;
  }

  set name(value) {
    this._props.name = value;
  }

  get description(): string {
    return this._props.description;
  }

  set description(value) {
    this._props.description = value;
  }

  get cells(): Cells {
    return Cells.fromObject(this._props.discretization.cells);
  }

  set cells(value: Cells) {
    this._props.discretization.cells = value.toObject();
  }

  get inactiveCells(): Cells {
    return this.cells.invert(this.gridSize);
  }

  get boundingBox() {
    return BoundingBox.fromObject(this._props.discretization.bounding_box);
  }

  set boundingBox(value) {
    this._props.discretization.bounding_box = value.toObject();
  }

  get geometry() {
    return Geometry.fromObject(this._props.discretization.geometry);
  }

  set geometry(value) {
    this._props.discretization.geometry = value.toObject();
  }

  get gridSize() {
    return GridSize.fromObject(this._props.discretization.grid_size);
  }

  set gridSize(value) {
    this._props.discretization.grid_size = value.toObject();
  }

  get intersection() {
    return this._props.discretization.intersection === undefined ? 50 : this._props.discretization.intersection;
  }

  set intersection(value) {
    this._props.discretization.intersection = value;
  }

  get rotation() {
    return this._props.discretization.rotation || 0;
  }

  set rotation(value) {
    this._props.discretization.rotation = value;
  }

  get lengthUnit() {
    return LengthUnit.fromInt(this._props.discretization.length_unit);
  }

  set lengthUnit(value) {
    this._props.discretization.length_unit = value.toInt();
  }

  get permissions() {
    return this._props.permissions;
  }

  set permissions(value) {
    this._props.permissions = value;
  }

  get isPublic() {
    return this._props.public;
  }

  set isPublic(value) {
    this._props.public = value;
  }

  get stressperiods() {
    return Stressperiods.fromObject(this._props.discretization.stressperiods);
  }

  set stressperiods(value) {
    this._props.discretization.stressperiods = value.toObject();
  }

  get timeUnit() {
    return TimeUnit.fromInt(this._props.discretization.time_unit);
  }

  set timeUnit(value) {
    this._props.discretization.time_unit = value.toInt();
  }

  get calculationId() {
    return this._props.calculation_id;
  }

  set calculationId(value) {
    this._props.calculation_id = value;
  }

  get discretization(): IDiscretization {
    return this._props.discretization;
  }

  get readOnly() {
    return !includes(this.permissions, 'w');
  }

  public static fromObject(obj: IModflowModel) {
    return new ModflowModel(obj);
  }

  public static fromQuery(query: IModflowModel) {
    const model = new ModflowModel(query);
    model.removeInvalidCells();
    return model;
  }

  public static createFromParameters(
    id: string,
    name: string,
    description: string,
    geometry: Geometry,
    boundingBox: BoundingBox,
    gridSize: GridSize,
    cells: Cells,
    lengthUnit: LengthUnit,
    timeUnit: TimeUnit,
    intersection: number,
    rotation: number,
    stressperiods: Stressperiods,
    isPublic: boolean) {
    return new ModflowModel({
      id,
      name,
      description,
      public: isPublic,
      permissions: 'rwx',
      discretization: {
        geometry: geometry.toObject(),
        bounding_box: boundingBox.toObject(),
        grid_size: gridSize.toObject(),
        cells: cells.toObject(),
        length_unit: lengthUnit.toInt(),
        intersection,
        rotation,
        stressperiods: stressperiods.toObject(),
        time_unit: timeUnit.toInt(),
      },
      calculation_id: ''
    });
  }

  protected readonly _props: IModflowModel;

  protected removeInvalidCells() {
    this._props.discretization.cells = this._props.discretization.cells.filter((cell) => {
      let cellIsValid = true;
      if (
        cell[0] < 0 || cell[0] > this._props.discretization.grid_size.n_x ||
        cell[1] < 0 || cell[1] > this._props.discretization.grid_size.n_y ||
        (cell.length === 3 && cell[2] < 0)
      ) {
        cellIsValid = false;
      }
      return cellIsValid;
    });
  }

  constructor(props: IModflowModel) {
    this._props = cloneDeep(props);
  }

  public toObject = () => (this._props);

  public toPayload = () => (this._props);

  public toCreatePayload = () => ({
    id: this.id,
    name: this.name,
    description: this.description,
    public: this.isPublic,
    geometry: this.geometry.toObject(),
    bounding_box: this.boundingBox.toObject(),
    grid_size: this.gridSize.toObject(),
    cells: this.cells.toObject(),
    length_unit: this.lengthUnit.toInt(),
    intersection: this.intersection,
    rotation: this.rotation,
    stressperiods: this.stressperiods.toObject(),
    time_unit: this.timeUnit.toInt()
  });

  public getClone = () => (
    ModflowModel.fromObject(this.toObject())
  );
}
