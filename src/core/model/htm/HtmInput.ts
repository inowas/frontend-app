import {IHeatTransportInput} from "./Htm.type";
import _ from "lodash";

export default class HtmInput {
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

    _props: IHeatTransportInput;

    constructor(props: IHeatTransportInput) {
        this._props = _.cloneDeep(props);
    }

    public static fromObject(props: IHeatTransportInput) {
        return new HtmInput(props)
    }

    public toObject() {
        return _.cloneDeep(this._props);
    }
}
