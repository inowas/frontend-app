import { Boundary } from './index';
import { Cells, Geometry } from '../index';
import { ICells } from '../../geometry/Cells.type';
import { ILakeBoundary, ILakeBoundaryExport } from './LakeBoundary.type';
import { ISpValues, IValueProperty } from './Boundary.type';
import { Polygon } from 'geojson';
import { cloneDeep } from 'lodash';
import BoundingBox from '../../geometry/BoundingBox';
import GridSize from '../../geometry/GridSize';
import Stressperiods from '../Stressperiods';
import Uuid from 'uuid';

export default class LakeBoundary extends Boundary {

  _props: ILakeBoundary;

  get type() {
    return this._props.properties.type;
  }

  get id() {
    return this._props.id;
  }

  set id(value) {
    this._props.id = value;
  }

  get geometry() {
    return Geometry.fromObject(this._props.geometry);
  }

  set geometry(value) {
    this._props.geometry = value.toObject() as Polygon;
  }

  get name() {
    return this._props.properties.name;
  }

  set name(value) {
    this._props.properties.name = value;
  }

  get layers() {
    return this._props.properties.layers;
  }

  set layers(value) {
    this._props.properties.layers = value;
  }

  get cells() {
    return Cells.fromObject(this._props.properties.cells);
  }

  set cells(value) {
    this._props.properties.cells = value.toObject();
  }

  get geometryType() {
    return LakeBoundary.geometryType();
  }

  get bedLeakance() {
    return this._props.properties.bed_leakance;
  }

  set bedLeakance(value) {
    this._props.properties.bed_leakance = value;
  }

  get initialStage() {
    return this._props.properties.initial_stage;
  }

  set initialStage(value) {
    this._props.properties.initial_stage = value;
  }

  get stageRange() {
    return this._props.properties.stage_range;
  }

  set stageRange(value) {
    this._props.properties.stage_range = value;
  }

  get spValues() {
    return this._props.properties.sp_values;
  }

  set spValues(value) {
    this._props.properties.sp_values = value;
  }

  get isExcludedFromCalculation(): boolean {
    return this._props.properties.is_excluded_from_calculation ?? false;
  }

  set isExcludedFromCalculation(isExcluded) {
    this._props.properties.is_excluded_from_calculation = isExcluded;
  }

  public static geometryType() {
    return 'Polygon';
  }

  public static fromExport(obj: ILakeBoundaryExport, boundingBox: BoundingBox, gridSize: GridSize) {
    return this.create(
      obj.id ? obj.id : Uuid.v4(),
      obj.geometry,
      obj.name,
      obj.layers,
      obj.cells || Cells.fromGeometry(Geometry.fromGeoJson(obj.geometry), boundingBox, gridSize).toObject(),
      obj.sp_values,
      obj.bed_leakance,
      obj.initial_stage,
      obj.stage_range,
      obj.is_excluded_from_calculation,
    );
  }

  public static fromObject(obj: ILakeBoundary) {
    return new this(obj);
  }

  public static valueProperties(): IValueProperty[] {
    return [
      {
        name: 'Precipitation',
        description: 'Precipitation',
        unit: 'm/day',
        decimals: 5,
        default: 0,
      },
      {
        name: 'Evaporation',
        description: 'Evaporation',
        unit: 'm/day',
        decimals: 5,
        default: 0,
      },
      {
        name: 'Runoff',
        description: 'Overland Runoff',
        unit: 'm³/day',
        decimals: 5,
        default: 0,
      },
      {
        name: 'Withdrawal',
        description: 'Withdrawal',
        unit: 'm³/day',
        decimals: 5,
        default: 0,
      },
    ];
  }

  public static create(
    id: string,
    geometry: Polygon,
    name: string,
    layers: number[],
    cells: ICells,
    sp_values: ISpValues,
    bed_leakance = 0.1,
    initial_stage = 1,
    stage_range = [1, 2],
    is_excluded_from_calculation = false,
  ) {

    return new this({
      id,
      type: 'Feature',
      geometry,
      properties: {
        type: 'lak',
        name,
        cells,
        layers,
        sp_values: sp_values,
        bed_leakance: bed_leakance,
        initial_stage: initial_stage,
        stage_range: stage_range as [number, number],
        is_excluded_from_calculation: is_excluded_from_calculation,
      },
    });
  }

  constructor(props: ILakeBoundary) {
    super();
    this._props = cloneDeep(props);
    this._class = LakeBoundary;
  }

  public getSpValues(stressPeriods: Stressperiods) {
    return Boundary.mergeStressperiodsWithSpValues(stressPeriods, this.spValues);
  }

  public setSpValues(spValues: ISpValues) {
    this._props.properties.sp_values = spValues;
  }

  public recalculateCells(boundingBox: BoundingBox, gridSize: GridSize): void {
    this.cells = Cells.fromGeometry(this.geometry, boundingBox, gridSize);
  }

  public toExport = (stressPeriods: Stressperiods): ILakeBoundaryExport => ({
    id: this.id,
    type: this.type,
    name: this.name,
    geometry: this.geometry.toObject() as Polygon,
    cells: this.cells.toObject(),
    layers: this.layers,
    bed_leakance: this.bedLeakance,
    sp_values: this.getSpValues(stressPeriods),
    initial_stage: this.initialStage,
    stage_range: this.stageRange,
    is_excluded_from_calculation: this.isExcludedFromCalculation,
  });

  public toObject(): ILakeBoundary {
    return this._props;
  }

  public get valueProperties(): IValueProperty[] {
    return LakeBoundary.valueProperties();
  }
}
