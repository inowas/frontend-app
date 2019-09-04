import {Collection} from '../collection/Collection';
import {ISensorProperty} from './Sensor.type';

export class ParameterCollection extends Collection<ISensorProperty> {
    public static fromObject(obj: ISensorProperty[]) {
        return new ParameterCollection(obj);
    }

    public toObject() {
        return this.all;
    }
}
