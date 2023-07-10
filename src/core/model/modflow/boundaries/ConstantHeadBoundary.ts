import { BoundingBox, GridSize } from '../../geometry';
import { Cells, Geometry } from '../index';
import { ICells } from '../../geometry/Cells.type';
import { IConstantHeadBoundary, IConstantHeadBoundaryExport } from './ConstantHeadBoundary.type';
import { ISpValues, IValueProperty } from './Boundary.type';
import { LineString } from 'geojson';
import { cloneDeep } from 'lodash';
import LineBoundary from './LineBoundary';
import StressPeriods from '../Stressperiods';
import Uuid from 'uuid';

export default class ConstantHeadBoundary extends LineBoundary {

  public static create(
    id: string,
    geometry: LineString,
    name: string,
    layers: number[],
    cells: ICells,
    spValues: ISpValues,
    isExcludedFromCalculation = false,
  ) {
    return new this({
      type: 'FeatureCollection',
      features: [
        {
          id,
          type: 'Feature',
          geometry,
          properties: {
            type: 'chd',
            name,
            layers,
            cells,
            isExcludedFromCalculation,
          },
        },
        {
          id: Uuid.v4(),
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: geometry.coordinates[0],
          },
          properties: {
            name: 'OP1',
            sp_values: spValues,
            type: 'op',
            distance: 0,
          },
        },
      ],
    });
  }

  public static fromExport(obj: IConstantHeadBoundaryExport, boundingBox: BoundingBox, gridSize: GridSize) {
    const boundary = this.create(
      obj.id ? obj.id : Uuid.v4(),
      obj.geometry,
      obj.name,
      obj.layers,
      obj.cells || Cells.fromGeometry(Geometry.fromGeoJson(obj.geometry), boundingBox, gridSize).toObject(),
      [],
      obj.is_excluded_from_calculation,
    );

    const opIdToRemove = boundary.observationPoints[0].id;
    obj.ops.forEach((op) => {
      boundary.createObservationPoint(
        op.id ? op.id : Uuid.v4(),
        op.name,
        op.geometry,
        op.sp_values,
      );
    });

    boundary.removeObservationPoint(opIdToRemove);
    return boundary;
  }

  public static fromObject(obj: IConstantHeadBoundary) {
    return new this(obj);
  }

  public static valueProperties(): IValueProperty[] {
    return [
      {
        name: 'SHead',
        description: 'Head at the start of the stress period',
        unit: 'm',
        decimals: 1,
        default: 0,
      },
      {
        name: 'Ehead',
        description: 'Head at the end of the stress period',
        unit: 'm',
        decimals: 1,
        default: 0,
      },
    ];
  }

  protected _props: IConstantHeadBoundary;

  public constructor(obj: IConstantHeadBoundary) {
    super();
    this._props = cloneDeep(obj);
    this._class = ConstantHeadBoundary;
  }

  public toExport(stressPeriods: StressPeriods): IConstantHeadBoundaryExport {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      geometry: this.geometry.toObject() as LineString,
      cells: this.cells.toObject(),
      layers: this.layers,
      ops: this.observationPoints.map((op) => ({
          name: op.name,
          geometry: op.geometry,
          sp_values: op.getSpValues(stressPeriods),
        }
      )),
      is_excluded_from_calculation: this.isExcludedFromCalculation,
    };
  }

  public toObject(): IConstantHeadBoundary {
    return this._props;
  }

  get valueProperties(): IValueProperty[] {
    return ConstantHeadBoundary.valueProperties();
  }
}
