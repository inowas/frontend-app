import {EMethodType, IMethod, IMethodFunction, IMethodSensor} from './RTModelling.type';
import _ from 'lodash';

class RTModellingMethod {
    readonly _props: IMethod | IMethodSensor | IMethodFunction;

    get function(): string | undefined {
        if (this.type === EMethodType.FUNCTION) {
            return this._props.function;
        }
        return undefined;
    }

    set function(value: string | undefined) {
        if (this.type === EMethodType.FUNCTION) {
            this._props.function = value;
        }
    }

    get monitoringId() {
        if (this.type === EMethodType.SENSOR) {
            return this._props.monitoring_id;
        }
        return undefined;
    }

    get parameterId() {
        if (this.type === EMethodType.SENSOR) {
            return this._props.parameter_id;
        }
        return undefined;
    }

    get sensorId() {
        if (this.type === EMethodType.SENSOR) {
            return this._props.sensor_id;
        }
        return undefined;
    }

    get type() {
        return this._props.method;
    }

    constructor(value: IMethod | IMethodSensor | IMethodFunction) {
        this._props = _.cloneDeep(value);
    }

    public static fromObject(value: IMethod | IMethodSensor | IMethodFunction) {
        return new RTModellingMethod(value);
    }

    public toObject() {
        return _.cloneDeep(this._props);
    }
}

export default RTModellingMethod;
