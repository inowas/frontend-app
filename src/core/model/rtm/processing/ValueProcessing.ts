import {GenericObject} from '../../genericObject/GenericObject';
import {IDateTimeValue} from '../Sensor.type';
import {IValueProcessing} from './Processing.type';

class ValueProcessing extends GenericObject<IValueProcessing> {

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

    get comparison(): string {
        return this._props.comparison;
    }

    get value(): number {
        return this._props.value;
    }

    public apply(input: IDateTimeValue[]) {
        return input
            .filter((i) => i.timeStamp >= this.begin && i.timeStamp <= this.end)
            .filter((i) => {
                switch (this.comparison) {
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
