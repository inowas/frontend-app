import {Collection} from '../collection/Collection';
import {ISensorParameter} from './Sensor.type';

export class ParameterCollection extends Collection<ISensorParameter> {
    public static fromObject(obj: ISensorParameter[]) {
        return new ParameterCollection(obj);
    }

    public toObject() {
        return this.all;
    }
}
