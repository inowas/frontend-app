import {GenericObject} from '../../genericObject/GenericObject';
import {IDateTimeValue} from '../Sensor.type';
import {IValueProcessing, IValueProcessingComparator} from './Processing.type';

export const comparators = ['lte', 'le', 'gt', 'gte', 'eq'];

class ValueProcessing extends GenericObject<IValueProcessing> {

    public static fromObject(obj: IValueProcessing) {
        return new ValueProcessing(obj);
    }

    get id() {
        return this._props.id;
    }

    get type(): string {
        return this._props.type;
    }

    get begin(): number {
        return this._props.begin;
    }

    set begin(value) {
        this._props.begin = value;
    }

    get end(): number {
        return this._props.begin;
    }

    set end(value) {
        this._props.end = value;
    }

    get comparator(): IValueProcessingComparator {
        return this._props.comparator;
    }

    set comparator(value) {
        this._props.comparator = value;
    }

    get value(): number {
        return this._props.value;
    }

    set value(value) {
        this._props.value = value;
    }

    public async apply(input: IDateTimeValue[]) {
        return input.filter((i) => i.timeStamp >= this.begin && i.timeStamp <= this.end)
            .filter((i) => {
                switch (this.comparator) {
                    case 'lte':
                        return i.value <= this.value;
                    case 'le':
                        return i.value < this.value;
                    case 'gt':
                        return i.value > this.value;
                    case 'gte':
                        return i.value >= this.value;
                    default:
                        return true;
                }
            });
    }
}

export default ValueProcessing;
