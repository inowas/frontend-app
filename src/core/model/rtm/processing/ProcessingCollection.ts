import {cloneDeep} from 'lodash';
import {Collection} from '../../collection/Collection';
import {IDateTimeValue} from '../Sensor.type';
import {IProcessing} from './Processing.type';
import ProcessingFactory from './ProcessingFactory';

export class ProcessingCollection extends Collection<IProcessing> {
    public static fromObject(obj: IProcessing[]) {
        return new ProcessingCollection(obj);
    }

    public async apply(rawData: IDateTimeValue[]) {
        let data = rawData;
        for (const p of this.all) {
            const inst = ProcessingFactory.fromObject(p);
            if (inst) {
                data = await inst.apply(data);
            }
        }

        return data;
    }

    public toObject() {
        return cloneDeep(this.all);
    }
}

export default ProcessingCollection;
