import { Array3D } from '../../../geometry/Array2D.type';
import { IPropertyValueObject } from '../../../types';
import { IStressPeriodData } from './FlopyModflow.type';
import { ModflowModel, Soilmodel } from '../../../modflow';
import { cloneDeep } from 'lodash';
import BoundaryCollection from '../../../modflow/boundaries/BoundaryCollection';
import FlopyModflowBoundary from './FlopyModflowBoundary';
import FlopyModflowPackage from './FlopyModflowPackage';
import LakeBoundary from '../../../modflow/boundaries/LakeBoundary';

export interface IFlopyModflowMflak {
  nlakes: number;
  ipakcb: number | null;
  theta: number;
  nssitr: number;
  sscncr: number;
  surfdep: number;
  stages: number[];
  stage_range: Array<[number, number]> | null;
  lakarr: Array3D<number> | null;
  bdlknc: Array3D<number> | null;
  sill_data: IStressPeriodData<Array<[[number, number], number]>> | null;
  flux_data: IStressPeriodData<[[number, number, number, number, number, number]]> | null;
  extension: string;
  unitnumber: number | null;
  filenames: null | string | string[];
  options: string[] | null;
}

export const defaults: IFlopyModflowMflak = {
  nlakes: 1,
  ipakcb: null,
  theta: 1.0,
  nssitr: 0,
  sscncr: 0.001,
  surfdep: 0.0,
  stages: [1.0],
  stage_range: null,
  lakarr: null,
  bdlknc: null,
  sill_data: null,
  flux_data: null,
  extension: 'lak',
  unitnumber: null,
  filenames: null,
  options: null,
};

export default class FlopyModflowMflak extends FlopyModflowBoundary<IFlopyModflowMflak> {

  public static create(boundaries: BoundaryCollection, model: ModflowModel, soilmodel: Soilmodel) {
    return this.fromDefault().update(boundaries, model, soilmodel);
  }

  public static fromDefault() {
    return this.fromObject({});
  }

  public static fromObject(obj: IPropertyValueObject): FlopyModflowMflak {
    const d: any = FlopyModflowPackage.cloneDeep(defaults);
    for (const key in d) {
      if (d.hasOwnProperty(key) && obj.hasOwnProperty(key)) {
        d[key] = obj[key];
      }
    }

    return new this(d);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update = (boundaries: BoundaryCollection, model: ModflowModel, soilmodel: Soilmodel) => {
    const lakeBoundaries = boundaries.all.filter((b) => b.type === 'lak') as LakeBoundary[];
    if (lakeBoundaries.length === 0) {
      return null;
    }

    this.nlakes = lakeBoundaries.length;

    const lakeArray: Array3D<number> = new Array(soilmodel.numberOfLayers).fill(0)
      .map(() => new Array(model.gridSize.nY).fill(0)
        .map(() => new Array(model.gridSize.nX).fill(0))) as Array3D<number>;

    const bdLknc: Array3D<number> = cloneDeep(lakeArray);

    lakeBoundaries.forEach((lakeBoundary, bIdx) => {
      lakeBoundary.layers.forEach((l) => {
        lakeBoundary.cells.toArray().forEach((c) => {
          lakeArray[l][c[1]][c[0]] = bIdx + 1;
          bdLknc[l][c[1]][c[0]] = lakeBoundary.bedLeakance;
        });
      });
    });

    this.bdlknc = this.extendValuesToNeighbourCells(bdLknc);
    this.lakarr = lakeArray;

    let fluxData: Exclude<typeof this.flux_data, null> = [];
    lakeBoundaries.forEach((lakeBoundary, idx) => {
      const spValues = lakeBoundary.getSpValues(model.stressperiods) as Array<[number, number, number, number]>;
      if (idx === 0) {
        fluxData = spValues.map((spValue) => [[...spValue, lakeBoundary.initialStage, lakeBoundary.initialStage]]);
      }

      if (idx > 0) {
        spValues.forEach((spValue, spIdx) => {
          if (!this.flux_data || !this.flux_data[spIdx]) {
            return;
          }
          fluxData[spIdx].push([...spValue, lakeBoundary.stageRange[0], lakeBoundary.stageRange[1]]);
        });
      }
    });

    this.flux_data = fluxData;

    this.stages = lakeBoundaries.map((b) => b.initialStage);
    this.stage_range = lakeBoundaries.map((b) => b.stageRange);

    return this;
  };

  private extendValuesToNeighbourCells = (bdLknc: Array3D<number>) => {
    for (let lIdx = 0; lIdx < bdLknc.length; lIdx++) {
      for (let rIdx = 0; rIdx < bdLknc[lIdx].length; rIdx++) {
        for (let cIdx = 0; cIdx < bdLknc[lIdx][rIdx].length - 1; cIdx++) {
          if (bdLknc[lIdx][rIdx][cIdx] === 0 && bdLknc[lIdx][rIdx][cIdx + 1] !== 0) {
            bdLknc[lIdx][rIdx][cIdx] = bdLknc[lIdx][rIdx][cIdx + 1];
          }
        }

        for (let cIdx = bdLknc[lIdx][rIdx].length - 1; cIdx > 0; cIdx--) {
          if (bdLknc[lIdx][rIdx][cIdx] === 0 && bdLknc[lIdx][rIdx][cIdx - 1] !== 0) {
            bdLknc[lIdx][rIdx][cIdx] = bdLknc[lIdx][rIdx][cIdx - 1];
          }
        }
      }

      for (let cIdx = 0; cIdx < bdLknc[lIdx][0].length; cIdx++) {
        for (let rIdx = 0; rIdx < bdLknc[lIdx].length - 1; rIdx++) {
          if (bdLknc[lIdx][rIdx][cIdx] === 0 && bdLknc[lIdx][rIdx + 1][cIdx] !== 0) {
            bdLknc[lIdx][rIdx][cIdx] = bdLknc[lIdx][rIdx + 1][cIdx];
          }
        }

        for (let rIdx = bdLknc[lIdx].length - 1; rIdx > 0; rIdx--) {
          if (bdLknc[lIdx][rIdx][cIdx] === 0 && bdLknc[lIdx][rIdx - 1][cIdx] !== 0) {
            bdLknc[lIdx][rIdx][cIdx] = bdLknc[lIdx][rIdx - 1][cIdx];
          }
        }
      }
    }

    for (let rIdx = 0; rIdx < bdLknc[0].length; rIdx++) {
      for (let cIdx = 0; cIdx < bdLknc[0][rIdx].length; cIdx++) {
        for (let lIdx = 0; lIdx < bdLknc.length - 1; lIdx++) {
          if (bdLknc[lIdx][rIdx][cIdx] === 0 && bdLknc[lIdx + 1][rIdx][cIdx] !== 0) {
            bdLknc[lIdx][rIdx][cIdx] = bdLknc[lIdx + 1][rIdx][cIdx];
          }
        }

        for (let lIdx = bdLknc.length - 1; lIdx > 0; lIdx--) {
          if (bdLknc[lIdx][rIdx][cIdx] === 0 && bdLknc[lIdx - 1][rIdx][cIdx] !== 0) {
            bdLknc[lIdx][rIdx][cIdx] = bdLknc[lIdx - 1][rIdx][cIdx];
          }
        }
      }
    }

    return cloneDeep(bdLknc);
  };

  get nlakes() {
    return this._props.nlakes;
  }

  set nlakes(value) {
    this._props.nlakes = value;
  }

  get ipakcb() {
    return this._props.ipakcb;
  }

  set ipakcb(value) {
    this._props.ipakcb = value;
  }

  get theta() {
    return this._props.theta;
  }

  set theta(value) {
    this._props.theta = value;
  }

  get nssitr() {
    return this._props.nssitr;
  }

  set nssitr(value) {
    this._props.nssitr = value;
  }

  get sscncr() {
    return this._props.sscncr;
  }

  set sscncr(value) {
    this._props.sscncr = value;
  }

  get surfdep() {
    return this._props.surfdep;
  }

  set surfdep(value) {
    this._props.surfdep = value;
  }

  get stages() {
    return this._props.stages;
  }

  set stages(value) {
    this._props.stages = value;
  }

  get stage_range() {
    return this._props.stage_range;
  }

  set stage_range(value) {
    this._props.stage_range = value;
  }

  get lakarr() {
    return this._props.lakarr;
  }

  set lakarr(value) {
    this._props.lakarr = value;
  }

  get bdlknc() {
    return this._props.bdlknc;
  }

  set bdlknc(value) {
    this._props.bdlknc = value;
  }

  get sill_data() {
    return this._props.sill_data;
  }

  set sill_data(value) {
    this._props.sill_data = value;
  }

  get flux_data() {
    return this._props.flux_data;
  }

  set flux_data(value) {
    this._props.flux_data = value;
  }

  get extension() {
    return this._props.extension;
  }

  set extension(value) {
    this._props.extension = value;
  }

  get unitnumber() {
    return this._props.unitnumber;
  }

  set unitnumber(value) {
    this._props.unitnumber = value;
  }

  get filenames() {
    return this._props.filenames;
  }

  set filenames(value) {
    this._props.filenames = value;
  }

  get options() {
    return this._props.options;
  }

  set options(value) {
    this._props.options = value;
  }
}
