class LengthUnit {

    // Modflow LengthUnit
    // 0: undefined
    // 1: feet
    // 2: meters
    // 3: centimeters

    _value;

    static meters() {
        return LengthUnit.fromInt(2);
    }

    static fromInt(value) {
        return LengthUnit(value);
    }

    constructor(value) {
        this._value = value;
    }

    toInt = () => (this._value);

    sameAs = (obj) => {
        return (obj.toInt() === this.toInt());
    }
}

export default LengthUnit;
