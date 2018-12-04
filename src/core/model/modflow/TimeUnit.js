class TimeUnit {

    // Modflow TimeUnit
    // 0: undefined
    // 1: seconds
    // 2: minutes
    // 3: hours
    // 4: days
    // 5: years

    _value;

    static days() {
        return TimeUnit.fromInt(4)
    }

    static fromInt(value) {
        return new TimeUnit(value);
    }

    constructor(value) {
        this._value = value;
    }

    toInt = () => (this._value);

    sameAs = (obj) => {
        return (obj.toInt() === this.toInt());
    }
}

export default TimeUnit;
