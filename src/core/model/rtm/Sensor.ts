import uuidv4 from 'uuid/v4';
import {ISensor} from './Sensor.type';

export default class Sensor {

    public static create(): Sensor {
        return new Sensor();
    }

    public static fromObject(obj: ISensor): Sensor {
        return new Sensor(obj);
    }

    private readonly _props: ISensor = {
        id: uuidv4(),
        name: '',
        description: '',
        geolocation: null,
        dataQuery: null
    };

    constructor(data?: ISensor) {
        if (data) {
            this._props = data;
        }
    }

    public toObject(): ISensor {
        return this._props;
    }

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

    get description(): string {
        return this._props.description;
    }

    set description(value: string) {
        this._props.description = value;
    }

    get geolocation(): [number, number] | null {
        return this._props.geolocation;
    }

    set geolocation(value: [number, number] | null) {
        this._props.geolocation = value;
    }

    get dataQuery(): string | null {
        return this._props.dataQuery;
    }

    set dataQuery(value: string | null) {
        this._props.dataQuery = value;
    }
}
