import {cloneDeep, includes} from 'lodash';
import Uuid from 'uuid';
import {Geometry} from '../geometry';
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

    get readOnly() {
        return !includes(this.permissions, 'w');
    }

    get geometry() {
        if (!this.sensors.getBoundingBoxPolygon()) {
            return null;
        }
        return Geometry.fromGeoJson(this.sensors.getBoundingBoxPolygon());
    }

    public static fromObject(obj: IRtm): Rtm {
        return new Rtm(obj);
    }

    private readonly _props: IRtm;

    constructor(data: IRtm) {
        this._props = cloneDeep(data);
    }

    public addSensor(sensor: Sensor) {
        this.sensors = (this.sensors).add(sensor);
        return this;
    }

    public cloneSensor(id: string) {
        const sensor = this.findSensor(id);

        if (!(sensor instanceof Sensor)) {
            return;
        }

        const clonedSensor = sensor.clone(Uuid.v4());
        this.addSensor(clonedSensor);
    }

    public findSensor(id: string): null | Sensor {
        return this.sensors.findById(id);
    }

    public removeSensor(id: string) {
        this.sensors = (this.sensors).removeById(id);
        return this;
    }

    public updateSensor(sensor: Sensor) {
        this.sensors = this.sensors.update(sensor);
    }

    public toObject(): IRtm {
        return cloneDeep(this._props);
    }
}
