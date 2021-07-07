import * as turf from '@turf/turf';
import { AllGeoJSON, Feature } from '@turf/helpers';
import { GeoJSON, Point } from 'geojson';
import { Geometry } from '../modflow';
import { IBoundingBox } from './BoundingBox.type';
import { envelope } from '@turf/turf';
import { isEqual } from 'lodash';
import md5 from 'md5';

class BoundingBox {

  public static default = [[13.74, 51.03], [13.75, 51.04]];

  get xMin() {
    return this._props[0][0] < this._props[1][0] ? this._props[0][0] : this._props[1][0];
  }

  get xMax() {
    return this._props[0][0] > this._props[1][0] ? this._props[0][0] : this._props[1][0];
  }

  get yMin() {
    return this._props[0][1] < this._props[1][1] ? this._props[0][1] : this._props[1][1];
  }

  get yMax() {
    return this._props[0][1] > this._props[1][1] ? this._props[0][1] : this._props[1][1];
  }

  get dX() {
    return this.xMax - this.xMin;
  }

  get dY() {
    return this.yMax - this.yMin;
  }

  get geoJson(): GeoJSON {
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [[
          [this.xMin, this.yMin],
          [this.xMin, this.yMax],
          [this.xMax, this.yMax],
          [this.xMax, this.yMin],
          [this.xMin, this.yMin]
        ]],
        type: 'Polygon'
      }
    };
  }

  get northEast() {
    return {
      lat: this.yMax,
      lng: this.xMax
    };
  }

  get southWest() {
    return {
      lat: this.yMin,
      lng: this.xMin
    };
  }

  get heightInMeters() {
    return turf.distance([this.xMin, this.yMin], [this.xMin, this.yMax], { units: 'meters' });
  }

  get widthInMeters() {
    return turf.distance([this.xMin, this.yMin], [this.xMax, this.yMin], { units: 'meters' });
  }

  get rotationPoint() {
    return turf.centerOfMass(this.geoJson as AllGeoJSON);
  }

  public static fromGeoJson(geoJson: AllGeoJSON) {
    const polygon = envelope(geoJson);

    if (!polygon.geometry) {
      throw new Error('No geometry');
    }

    const coordinates = polygon.geometry.coordinates[0];
    let [xMin, yMin] = coordinates[0];
    let [xMax, yMax] = coordinates[0];

    coordinates.forEach((c) => {
      if (c[0] < xMin) {
        xMin = c[0];
      }

      if (c[0] > xMax) {
        xMax = c[0];
      }

      if (c[1] < yMin) {
        yMin = c[1];
      }

      if (c[1] > yMax) {
        yMax = c[1];
      }
    });

    return BoundingBox.fromObject([
      [xMin, yMin],
      [xMax, yMax]
    ]);
  }

  public static fromPoints(points: Point[]) {
    if (points.length < 1) {
      return new BoundingBox(BoundingBox.default);
    }

    const firstPoint = points[0];
    let [xMin, yMin] = firstPoint.coordinates;
    let [xMax, yMax] = firstPoint.coordinates;

    if (points.length === 1) {
      xMin -= .01;
      xMax += .01;
      yMin -= .01;
      yMax += .01;
      return new BoundingBox([[xMin, yMin], [xMax, yMax]]);
    }

    points.forEach((p: Point) => {
      const [x, y] = p.coordinates;
      if (x < xMin) {
        xMin = x;
      }

      if (x > xMax) {
        xMax = x;
      }

      if (y < yMin) {
        yMin = y;
      }

      if (y > yMax) {
        yMax = y;
      }
    });

    return new BoundingBox([[xMin, yMin], [xMax, yMax]]);

  }

  public static fromObject(obj: IBoundingBox) {
    return new BoundingBox(obj);
  }

  public static fromGeometryAndRotation = (area: Geometry, rotation: number) => {
    const withRotation = turf.transformRotate(area.toGeoJSON(), -1 * rotation, { pivot: area.centerOfMass });
    return BoundingBox.fromGeoJson(withRotation);
  };

  public static geoJsonFromGeometryAndRotation = (area: Geometry, rotation: number) => {
    const bbox = BoundingBox.fromGeometryAndRotation(area, rotation);
    return bbox.geoJsonWithRotation(rotation, area.centerOfMass);
  };

  private readonly _props: IBoundingBox;

  constructor([[xMin, yMin], [xMax, yMax]]: IBoundingBox) {
    this._props = [[xMin, yMin], [xMax, yMax]];
  }

  public geoJsonWithRotation = (rotation: number, center: Feature<Point | null>): GeoJSON => {
    return turf.transformRotate(
      Geometry.fromGeoJson(this.geoJson).toGeoJSON(), rotation, { pivot: center }
    );
  };

  public hash = () => (md5(JSON.stringify(this.geoJson)));

  public isValid = () => !(!this.xMin || !this.xMax || !this.yMin || !this.yMax);

  public toObject = (): IBoundingBox => this._props;

  public getBoundsLatLng = (): Array<[number, number]> => {
    return [
      [this.yMin, this.xMin],
      [this.yMax, this.xMax]
    ];
  };

  public sameAs = (obj: BoundingBox) => {
    return isEqual(obj.toObject(), this.toObject());
  };
}

export default BoundingBox;
