import { Cells, Geometry } from '../index';
import { ICells } from '../../geometry/Cells.type';
import {
  IEvapotranspirationBoundary,
  IEvapotranspirationBoundaryExport,
  INevtop,
} from './EvapotranspirationBoundary.type';
import { ISpValues, IValueProperty } from './Boundary.type';
import { Polygon } from 'geojson';
import { cloneDeep } from 'lodash';
import Boundary from './Boundary';
import BoundingBox from '../../geometry/BoundingBox';
import GridSize from '../../geometry/GridSize';
import Stressperiods from '../Stressperiods';
import Uuid from 'uuid';

export default class EvapotranspirationBoundary extends Boundary {

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
    return EvapotranspirationBoundary.geometryType();
  }

  get nevtop() {
    return this._props.properties.nevtop;
  }

  set nevtop(value) {
    this._props.properties.nevtop = value;
  }

  get optionCode(): INevtop {
    return this.nevtop;
  }

  set optionCode(value: INevtop) {
    this.nevtop = value;
  }

  get isExcludedFromCalculation(): boolean {
    return this._props.properties.isExcludedFromCalculation ?? false;
  }

  set isExcludedFromCalculation(isExcluded) {
    this._props.properties.isExcludedFromCalculation = isExcluded;
  }

  public static create(
    id: string,
    geometry: Polygon,
    name: string,
    layers: number[],
    cells: ICells,
    spValues: ISpValues,
    nevtop = 1,
    isExcludedFromCalculation = false,
  ) {

    return new this({
      id,
      type: 'Feature',
      geometry,
      properties: {
        type: 'evt',
        name,
        cells,
        layers,
        sp_values: spValues,
        nevtop,
        isExcludedFromCalculation,
      },
    });
  }

  public static fromExport(obj: IEvapotranspirationBoundaryExport, boundingBox: BoundingBox, gridSize: GridSize) {
    return this.create(
      obj.id ? obj.id : Uuid.v4(),
      obj.geometry,
      obj.name,
      obj.layers,
      obj.cells || Cells.fromGeometry(Geometry.fromGeoJson(obj.geometry), boundingBox, gridSize).toObject(),
      obj.sp_values,
      obj.nevtop,
    );
  }

  public static fromObject(obj: IEvapotranspirationBoundary) {
    return new this(obj);
  }

  public static geometryType() {
    return 'Polygon';
  }

  public static valueProperties() {
    return [
      {
        name: 'Max EVT',
        description: 'Maximum Evapotranspiration on flux',
        unit: 'm/day',
        decimals: 5,
        default: 0,
      },
      {
        name: 'EVT Surface',
        description: 'Evapotranspiration of surface',
        unit: 'm',
        decimals: 5,
        default: 0,
      },
      {
        name: 'Extinction Depth',
        description: 'Evapotranspiration on depth',
        unit: 'm',
        decimals: 5,
        default: 0,
      },
    ];
  }

  constructor(props: IEvapotranspirationBoundary) {
    super();
    this._props = cloneDeep(props);
    this._class = EvapotranspirationBoundary;
  }

  public getSpValues(stressperiods: Stressperiods) {
    return Boundary.mergeStressperiodsWithSpValues(stressperiods, this._props.properties.sp_values);
  }

  public recalculateCells(boundingBox: BoundingBox, gridSize: GridSize): void {
    this.cells = Cells.fromGeometry(this.geometry, boundingBox, gridSize);
  }

  public setSpValues(spValues: ISpValues) {
    this._props.properties.sp_values = spValues;
  }

  public toExport = (stressPeriods: Stressperiods): IEvapotranspirationBoundaryExport => ({
    id: this.id,
    type: this.type,
    name: this.name,
    geometry: this.geometry.toObject() as Polygon,
    cells: this.cells.toObject(),
    layers: this.layers,
    nevtop: this.nevtop ? this.nevtop : 1,
    sp_values: this.getSpValues(stressPeriods),
    is_excluded_from_calculation: this.isExcludedFromCalculation,
  });

  public toObject(): IEvapotranspirationBoundary {
    return this._props;
  }

  public get valueProperties(): IValueProperty[] {
    return EvapotranspirationBoundary.valueProperties();
  }
}
