import moment, {Moment} from 'moment';
import {IStressPeriod} from './Stressperiod.type';

class Stressperiod {

    get startDateTime(): Moment {
        return moment(this._props.start_date_time);
    }

    set startDateTime(value: Moment) {
        this._props.start_date_time = value.toISOString();
    }

    get nstp() {
        return this._props.nstp;
    }

    set nstp(value) {
        this._props.nstp = value;
    }

    get tsmult() {
        return this._props.tsmult;
    }

    set tsmult(value) {
        this._props.tsmult = value;
    }

    get steady() {
        return this._props.steady;
    }

    set steady(value) {
        this._props.steady = value;
    }

    public static fromObject(obj: IStressPeriod) {
        return new Stressperiod(obj);
    }

    private readonly _props: IStressPeriod;

    constructor(props: IStressPeriod) {
        this._props = {...props};
    }

    public toObject = (): IStressPeriod => (this._props);

    public clone = () => (
        new Stressperiod(this._props)
    );

    public sameAs = (obj: Stressperiod): boolean => (
        this.toObject() === obj.toObject()
    );
}

export default Stressperiod;
