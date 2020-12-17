import {ISensor} from './Sensor.type';
import {ParameterCollection} from './ParameterCollection';
import {Point} from 'geojson';
import {cloneDeep} from 'lodash';

export default class Sensor {

    get id(): string {
        return this._props.id;
    }

    set id(value: string) {
        this._props.id = value;
    }

    get name(): string {
        return this._props.name;
    }

    set name(value: string) {
        this._props.name = value;
    }

    get geolocation(): Point {
        return this._props.geolocation;
    }

    set geolocation(value) {
        this._props.geolocation = value;
    }

    get parameters(): ParameterCollection {
        return ParameterCollection.fromObject(this._props.parameters);
    }

    set parameters(value) {
        this._props.parameters = value.toObject();
    }

    public static fromObject(obj: ISensor): Sensor {
        return new Sensor(obj);
    }

    private readonly _props: ISensor;

    constructor(data: ISensor) {
        this._props = cloneDeep(data);
    }

    public toObject(): ISensor {
        return this._props;
    }

    public clone(id: string): Sensor {
        const data = cloneDeep(this.toObject());
        data.id = id;
        return Sensor.fromObject(data);
    }
}
