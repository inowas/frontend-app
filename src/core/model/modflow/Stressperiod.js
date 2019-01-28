class Stressperiod {

    _startDateTime;
    _nstp;
    _tsmult;
    _steady;

    static fromObject(obj) {
        const stressPeriod = new Stressperiod();
        stressPeriod._startDateTime = obj.start_date_time;
        //stressPeriod._totimStart = obj.totim_start;
        //stressPeriod._perlen = obj.perlen;
        stressPeriod._nstp = obj.nstp;
        stressPeriod._tsmult = obj.tsmult;
        stressPeriod._steady = obj.steady;
        return stressPeriod;
    }

    constructor(startDateTime, nstp, tsmult, steady) {
        this._startDateTime = startDateTime;
        this._nstp = nstp;
        this._tsmult = tsmult;
        this._steady = steady;
    }


    get startDateTime() {
        return this._startDateTime;
    }

    set startDateTime(value) {
        this._startDateTime = value;
    }

    get nstp() {
        return this._nstp;
    }

    set nstp(value) {
        this._nstp = value;
    }

    get tsmult() {
        return this._tsmult;
    }

    set tsmult(value) {
        this._tsmult = value;
    }

    get steady() {
        return this._steady;
    }

    set steady(value) {
        this._steady = value;
    }

    toObject = () => ({
        start_date_time: this._startDateTime,
        nstp: this._nstp,
        tsmult: this._tsmult,
        steady: this._steady
    });

    clone = () => (
        new Stressperiod(this._startDateTime, this._nstp, this._tsmult, this._steady)
    )
}

export default Stressperiod;
