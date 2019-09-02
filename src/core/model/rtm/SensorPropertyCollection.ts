import {Collection} from '../collection/Collection';
import {ISensorProperty} from './Sensor.type';

export class SensorPropertyCollection extends Collection<ISensorProperty> {
    public static fromObject(obj: ISensorProperty[]) {
        return new SensorPropertyCollection(obj);
    }

    public toObject() {
        return this.all;
    }
}
