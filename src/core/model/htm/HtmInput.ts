import {GenericObject} from '../genericObject/GenericObject';
import {IHeatTransportInput} from './Htm.type';

export default class HtmInput extends GenericObject<IHeatTransportInput> {
    get data() {
        return this._props.data;
    }

    get rtmId() {
        return this._props.rtmId;
    }

    get sensorId() {
        return this._props.sensorId;
    }

    get timePeriod() {
        return this._props.timePeriod;
    }

    get type() {
        return this._props.type;
    }

    public static fromObject(props: IHeatTransportInput) {
        return new HtmInput(props);
    }
}
