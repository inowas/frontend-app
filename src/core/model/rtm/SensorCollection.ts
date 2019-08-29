import * as turf from '@turf/turf';
import {isEqual, uniqWith} from 'lodash';
import {Collection} from '../collection/Collection';
import {Sensor} from './index';
import {ISensor} from './Sensor.type';

export class SensorCollection extends Collection<Sensor> {
    public static fromObject(obj: ISensor[]) {
        const sc = new SensorCollection();
        sc.items = obj.map((s) => Sensor.fromObject(s));
        return sc;
    }

    public toObject() {
        return this.all.map(
            (item) => item.toObject());
    }

    public getBoundingBoxPolygon = () => {
        let points = this.all.map((s) => s.geolocation);
        points = uniqWith(points, isEqual);

        if (points.length < 1) {
            return null;
        }

        if (points.length === 1) {
            points = [{
                type: 'Point',
                coordinates: [points[0].coordinates[0] - 0.01, points[0].coordinates[1] - 0.01]
            }, {
                type: 'Point',
                coordinates: [points[0].coordinates[0] + 0.01, points[0].coordinates[1] + 0.01]
            }];
        }

        const turfPoints = points.map((p) => turf.point(p.coordinates));
        const features = turf.featureCollection(turfPoints);
        return turf.envelope(features);
    };

    public updateSensor = (sensor: Sensor) => {
        this.items = this.all.map((s) => {
            if (s.id === sensor.id) {
                return sensor;
            }

            return s;
        });

        return this;
    };
}
