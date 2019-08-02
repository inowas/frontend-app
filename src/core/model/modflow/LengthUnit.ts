import {ILengthUnit} from './LengthUnit.type';

export default class LengthUnit {

    public static feet() {
        return LengthUnit.fromInt(ILengthUnit.feet);
    }

    public static meters() {
        return LengthUnit.fromInt(ILengthUnit.meters);
    }

    public static centimeters() {
        return LengthUnit.fromInt(ILengthUnit.centimeters);
    }

    public static fromInt(value: ILengthUnit) {
        return new LengthUnit(value);
    }

    private readonly _value: ILengthUnit;

    constructor(value: ILengthUnit) {
        this._value = value;
    }

    public toInt = () => (this._value);

    public sameAs = (obj: LengthUnit) => {
        return (obj.toInt() === this.toInt());
    };
}
