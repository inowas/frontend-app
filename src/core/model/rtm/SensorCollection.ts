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
}
