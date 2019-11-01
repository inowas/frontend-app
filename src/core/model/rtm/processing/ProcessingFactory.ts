import {ValueProcessing} from './index';
import {IProcessing, IValueProcessing} from './Processing.type';

function isValueProcessing(arg: any): arg is IValueProcessing {
    return arg.type === 'value';
}

export class ProcessingFactory {

    public static fromObject(obj: IProcessing): ValueProcessing {
        if (isValueProcessing(obj)) {
            return new ValueProcessing(obj);
        }

        throw new Error('Datasource plain object does not match.');
    }
}

export default ProcessingFactory;
