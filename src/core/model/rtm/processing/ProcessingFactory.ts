import {ValueProcessing} from './index';
import {IProcessing, ITimeProcessing, IValueProcessing} from './Processing.type';
import TimeProcessing from './TimeProcessing';

const isValueProcessing = (arg: any): arg is IValueProcessing => arg.type === 'value';

const isTimeProcessing = (arg: any): arg is ITimeProcessing => arg.type === 'time';

export class ProcessingFactory {

    public static fromObject(obj: IProcessing): TimeProcessing | ValueProcessing {
        if (isValueProcessing(obj)) {
            return new ValueProcessing(obj);
        }

        if (isTimeProcessing(obj)) {
            return new TimeProcessing(obj);
        }

        throw new Error('Datasource plain object does not match.');
    }
}

export default ProcessingFactory;
