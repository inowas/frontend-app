import {ECutRule, ITimeProcessing} from './Processing.type';
import {GenericObject} from '../../genericObject/GenericObject';
import {IDateTimeValue} from '../Sensor.type';
import {makeTimeProcessingRequest} from '../../../../services/api';
import _ from 'lodash';

export const methods = [
    [
        'cubic',
        'These methods use the numerical values of the index'
    ],
    [
        'linear',
        'Ignore the index and treat the values as equally spaced'
    ],
    [
        'nearest',
        'These methods use the numerical values of the index'
    ],
    [
        'quadratic',
        'These methods use the numerical values of the index'
    ],
    [
        'slinear',
        'These methods use the numerical values of the index'
    ],
    [
        'time',
        'Works on daily and higher resolution data to interpolate given length of interval.'
    ],
    [
        'zero',
        'These methods use the numerical values of the index'
    ]
];

class TimeProcessing extends GenericObject<ITimeProcessing> {

    public static fromObject(obj: ITimeProcessing) {
        return new TimeProcessing(this.cloneDeep(obj));
    }

    get id() {
        return this._props.id;
    }

    get begin(): number {
        return this._props.begin;
    }

    set begin(value: number) {
        this._props.begin = value;
    }

    get end(): number {
        return this._props.end;
    }

    set end(value: number) {
        this._props.end = value;
    }

    get cut(): ECutRule {
        return this._props.cut;
    }

    set cut(value: ECutRule) {
        this._props.cut = value;
    }

    get cutNumber(): number | undefined {
        return this._props.cutNumber;
    }

    set cutNumber(value: number | undefined) {
        this._props.cutNumber = value;
    }

    get type(): string {
        return this._props.type;
    }

    get method(): string {
        return this._props.method;
    }

    set method(value: string) {
        this._props.method = value;
    }

    get rule(): string {
        return this._props.rule;
    }

    set rule(value: string) {
        this._props.rule = value;
    }

    public async apply(input: IDateTimeValue[]) {
        let dataToProcess: IDateTimeValue[] = _.uniqBy(input, 'timeStamp');
        if (!this.cut || this.cut === ECutRule.NONE || this.cut === ECutRule.PERIOD) {
            dataToProcess = dataToProcess.filter((i) => i.timeStamp >= this.begin && i.timeStamp <= this.end);
        }
        if (this.cut === ECutRule.UNTIL_TODAY) {
            dataToProcess = dataToProcess.filter((i) => i.timeStamp >= this.begin);
        }

        // eslint-disable-next-line no-useless-catch
        try {
            const processedData = await makeTimeProcessingRequest(dataToProcess, this.rule, this.method);

            if (!this.cut || this.cut === ECutRule.NONE) {
                return input.filter((i) => !(i.timeStamp >= this.begin && i.timeStamp <= this.end))
                    .concat(processedData)
                    .sort((a: IDateTimeValue, b: IDateTimeValue) => a.timeStamp - b.timeStamp);
            }
            if (this.cut === ECutRule.BEFORE_TODAY) {
                const n = this.cutNumber || 0;
                return processedData.sort((a: IDateTimeValue, b: IDateTimeValue) => a.timeStamp - b.timeStamp).slice(-1 * n);
            }
            return processedData.sort((a: IDateTimeValue, b: IDateTimeValue) => a.timeStamp - b.timeStamp);
        } catch (e) {
            throw e;
        }
    }
}

export default TimeProcessing;
