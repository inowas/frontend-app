import {Sensor} from './index';
import {IRtm} from './Rtm.type';
import {SensorCollection} from './SensorCollection';

export default class Rtm {

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

    get permissions(): string {
        return this._props.permissions;
    }

    set permissions(value: string) {
        this._props.permissions = value;
    }

    get public(): boolean {
        return this._props.public;
    }

    set public(value: boolean) {
        this._props.public = value;
    }

    get tool(): string {
        return this._props.tool;
    }

    get sensors(): SensorCollection {
        return SensorCollection.fromObject(this._props.data.sensors);
    }

    set sensors(value: SensorCollection) {
        this._props.data.sensors = value.toObject();
    }

    get model(): string | null {
        return this._props.data.model;
    }

    set model(value: string | null) {
        this._props.data.model = value;
    }

    public static fromObject(obj: IRtm): Rtm {
        return new Rtm(obj);
    }

    private readonly _props: IRtm;

    constructor(data: IRtm) {
        this._props = data;
    }

    public addSensor(sensor: Sensor) {
        this.sensors = (this.sensors).add(sensor);
    }

    public findSensor(id: string): null | Sensor {
        return this.sensors.findById(id);
    }

    public toObject(): IRtm {
        return this._props;
    }
}
