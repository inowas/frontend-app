import {Collection} from '../collection/Collection';
import {Sensor} from './index';
import {ISensor} from './Sensor.type';

export class SensorCollection extends Collection<Sensor> {
    public static fromArray(array: ISensor[]) {
        const sc = new SensorCollection();
        sc.items = array.map((s) => Sensor.fromObject(s));
        return sc;
    }

    public toArray() {
        return this.all.map(
            (item) => item.toObject());
    }
}
