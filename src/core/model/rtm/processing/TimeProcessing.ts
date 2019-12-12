import {makeTimeProcessingRequest} from '../../../../services/api';
import {GenericObject} from '../../genericObject/GenericObject';
import {IDateTimeValue} from '../Sensor.type';
import {ITimeProcessing} from './Processing.type';

class TimeProcessing extends GenericObject<ITimeProcessing> {

    get id() {
        return this._props.id;
    }

    get begin(): number {
        return this._props.begin;
    }

    get end(): number {
        return this._props.begin;
    }

    get type(): string {
        return this._props.type;
    }

    get interpolationMethod(): string {
        return this._props.interpolationMethod;
    }

    get rule(): string {
        return this._props.rule;
    }

    public async apply(input: IDateTimeValue[]) {
        const data = input.filter((i) => i.timeStamp >= this.begin && i.timeStamp <= this.end);
        return await makeTimeProcessingRequest(data, this.rule, this.interpolationMethod) as IDateTimeValue[];
    }
}

export default TimeProcessing;
