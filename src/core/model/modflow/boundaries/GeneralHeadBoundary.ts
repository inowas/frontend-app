import { Cells, Geometry } from '../index';
import { ICells } from '../../geometry/Cells.type';
import { IGeneralHeadBoundary, IGeneralHeadBoundaryExport } from './GeneralHeadBoundary.type';
import { ISpValues, IValueProperty } from './Boundary.type';
import { LineString } from 'geojson';
import { cloneDeep } from 'lodash';
import BoundingBox from '../../geometry/BoundingBox';
import GridSize from '../../geometry/GridSize';
import LineBoundary from './LineBoundary';
import Stressperiods from '../Stressperiods';
import Uuid from 'uuid';

export default class GeneralHeadBoundary extends LineBoundary {

  public static create(
    id: string,
    geometry: LineString,
    name: string,
    layers: number[],
    cells: ICells,
    spValues: ISpValues,
    isExcludedFromCalculation = false
  ) {
    return new this({
      type: 'FeatureCollection',
      features: [
        {
          id,
          type: 'Feature',
          geometry,
          properties: {
            type: 'ghb',
            name,
            layers,
            cells,
            isExcludedFromCalculation
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

  public static fromExport(obj: IGeneralHeadBoundaryExport, boundingBox: BoundingBox, gridSize: GridSize) {
    const boundary = this.create(
      obj.id ? obj.id : Uuid.v4(),
      obj.geometry,
      obj.name,
      obj.layers,
      obj.cells || Cells.fromGeometry(Geometry.fromGeoJson(obj.geometry), boundingBox, gridSize).toObject(),
      [],
      obj.is_excluded_from_calculation
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

  public static fromObject(obj: IGeneralHeadBoundary) {
    return new this(obj);
  }

  public static valueProperties(): IValueProperty[] {
    return [
      {
        name: 'Head',
        description: 'Groundwater Head',
        unit: 'm',
        decimals: 2,
        default: 0,
      },
      {
        name: 'Conductance',
        description: 'Hydraulic conductance',
        unit: 'm/day',
        decimals: 2,
        default: 0,
      },
    ];
  }

  protected _props: IGeneralHeadBoundary;

  public constructor(obj: IGeneralHeadBoundary) {
    super();
    this._props = cloneDeep(obj);
    this._class = GeneralHeadBoundary;
  }

  public get valueProperties(): IValueProperty[] {
    return GeneralHeadBoundary.valueProperties();
  }

  public toExport(stressPeriods: Stressperiods): IGeneralHeadBoundaryExport {
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

  public toObject(): IGeneralHeadBoundary {
    return this._props;
  }
}
