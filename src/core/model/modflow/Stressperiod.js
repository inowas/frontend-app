class Stressperiod {

    _totimStart;
    _perlen;
    _nstp;
    _tsmult;
    _steady;

    static fromObject(obj) {
        const stressPeriod = new Stressperiod();
        stressPeriod.totimStart = obj.totim_start;
        stressPeriod.perlen = obj.perlen;
        stressPeriod.nstp = obj.nstp;
        stressPeriod.tsmult = obj.tsmult;
        stressPeriod.steady = obj.steady;
        return stressPeriod;
    }

    constructor(totimStart, perlen, nstp, tsmult, steady) {
        this.totimStart = totimStart;
        this.perlen = perlen;
        this.nstp = nstp;
        this.tsmult = tsmult;
        this.steady = steady;
    }

    get totimStart() {
        return this._totimStart;
    }

    set totimStart(value) {
        this._totimStart = value;
    }

    get perlen() {
        return this._perlen;
    }

    set perlen(value) {
        this._perlen = value;
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

    toObject = () => {
        return {
            totim_start: this.totimStart,
            perlen: this.perlen,
            nstp: this.nstp,
            tsmult: this.tsmult,
            steady: this.steady
        };
    };

    clone = () => (
        new Stressperiod(this.totimStart, this.perlen, this.nstp, this.tsmult, this.steady)
    )
}

export default Stressperiod;
