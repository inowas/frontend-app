import {Cells, Geometry, Stressperiod} from '../index';
import {ICells} from '../../geometry/Cells.type';
import {ILakeBoundary, ILakeBoundaryExport} from './LakeBoundary.type';
import {ISpValues, IValueProperty} from './Boundary.type';
import {Polygon} from 'geojson';
import {cloneDeep} from 'lodash';
import Boundary from './Boundary';
import BoundingBox from '../../geometry/BoundingBox';
import GridSize from '../../geometry/GridSize';
import Stressperiods from '../Stressperiods';
import Uuid from 'uuid';

export default class LakeBoundary extends Boundary {

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

  get nevtop() {
    return this._props.properties.nevtop;
  }

  set nevtop(value) {
    this._props.properties.nevtop = value;
  }

  public static create(id: string, geometry: Polygon, name: string, layers: number[],
                       cells: ICells, spValues: ISpValues) {

    return new this({
      id,
      type: 'Feature',
      geometry,
      properties: {
        type: 'lak',
        name,
        cells,
        layers,
        sp_values: spValues
      }
    });
  }

  public static fromExport(obj: ILakeBoundaryExport, boundingBox: BoundingBox, gridSize: GridSize) {
    return this.create(
      obj.id ? obj.id : Uuid.v4(),
      obj.geometry,
      obj.name,
      obj.layers,
      Cells.fromGeometry(Geometry.fromGeoJson(obj.geometry), boundingBox, gridSize).toObject(),
      obj.sp_values
    );
  }

  public static fromObject(obj: ILakeBoundary) {
    return new this(obj);
  }

  public static geometryType() {
    return 'Polygon';
  }

  public static valueProperties() {
    return [
      {
        name: 'PRCPLK',
        description: 'Precipitation',
        unit: 'm/day',
        decimals: 5,
        default: 0
      },
      {
        name: 'EVAPLK',
        description: 'Evapotranspiration',
        unit: 'm/day',
        decimals: 5,
        default: 0
      },
      {
        name: 'RNF',
        description: 'Overland runoff from an adjacent watershed entering the lake.',
        unit: 'm3/day',
        decimals: 5,
        default: 0
      },
      {
        name: 'WTHDRW',
        description: 'Water removal from a lake.',
        unit: 'm3/day',
        decimals: 5,
        default: 0
      },
      {
        name: 'SSMN',
        description: 'Minimum stage allowed',
        unit: 'm',
        decimals: 5,
        default: 0
      },
      {
        name: 'SSMX',
        description: 'Maximum stage allowed',
        unit: 'm',
        decimals: 5,
        default: 0
      }
    ];
  }

  constructor(props: ILakeBoundary) {
    super();
    this._props = cloneDeep(props);
    this._class = LakeBoundary;
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

  public toExport = (stressperiods: Stressperiods): ILakeBoundaryExport => ({
    id: this.id,
    type: this.type,
    name: this.name,
    geometry: this.geometry.toObject() as Polygon,
    layers: this.layers,
    sp_values: this.getSpValues(stressperiods)
  });

  public toObject(): ILakeBoundary {
    return this._props;
  }

  public get valueProperties(): IValueProperty[] {
    return LakeBoundary.valueProperties();
  }

  public spValueDisabled(key: number, stressPeriod: Stressperiod): boolean {
    return key >= 4 && !stressPeriod.steady;
  }
}
