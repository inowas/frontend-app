import {cloneDeep} from 'lodash';
import {Collection} from '../../collection/Collection';
import {IDateTimeValue} from '../monitoring/Sensor.type';
import {IProcessing} from './Processing.type';
import ProcessingFactory from './ProcessingFactory';

export class ProcessingCollection extends Collection<IProcessing> {
    public static fromObject(obj: IProcessing[]) {
        return new ProcessingCollection(obj);
    }

    public async apply(rawData: IDateTimeValue[]) {
        let processedData = cloneDeep(rawData);
        for (const p of this.all) {
            const inst = ProcessingFactory.fromObject(p);
            if (inst) {
                processedData = await inst.apply(processedData);
            }
        }

        return processedData;
    }

    public toObject() {
        return cloneDeep(this.all);
    }
}

export default ProcessingCollection;
