import {ITimeUnit} from './TimeUnit.type';

export default class TimeUnit {

    public static seconds() {
        return TimeUnit.fromInt(ITimeUnit.seconds);
    }

    public static days() {
        return TimeUnit.fromInt(ITimeUnit.days);
    }

    public static minutes() {
        return TimeUnit.fromInt(ITimeUnit.minutes);
    }

    public static hours() {
        return TimeUnit.fromInt(ITimeUnit.hours);
    }

    public static years() {
        return TimeUnit.fromInt(ITimeUnit.years);
    }

    public static fromInt(value: ITimeUnit) {
        return new TimeUnit(value);
    }

    private readonly _value: ITimeUnit;

    constructor(value: ITimeUnit) {
        this._value = value;
    }

    public toInt = () => (this._value);

    public toString = () => {
        switch (this._value) {
            case 1:
                return 'seconds';
            case 2:
                return 'minutes';
            case 3:
                return 'hours';
            case 4:
                return 'days';
            case 5:
                return 'years';
            default:
                return undefined;
        }
    };

    public sameAs = (obj: TimeUnit) => {
        return obj.toInt() === this.toInt();
    };
}
