import uuidv4 from 'uuid/v4';
import {IMetaData, ISimpleTool} from '../types';
import {ISensor} from './Sensor.type';
import {SensorCollection} from './SensorCollection';

interface IRtm extends ISimpleTool<IRtmData> {
    data: IRtmData;
}

// tslint:disable-next-line:no-empty-interface
interface IModel extends IMetaData {
}

interface IRtmData {
    sensors: ISensor[];
    model: IModel | null;
}

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

    set tool(value: string) {
        this._props.tool = value;
    }

    get sensors(): SensorCollection {
        return SensorCollection.fromArray(this._props.data.sensors);
    }

    set sensors(value: SensorCollection) {
        this._props.data.sensors = value.toArray();
    }

    get model(): IModel | null {
        return this._props.data.model;
    }

    set model(value: IModel | null) {
        this._props.data.model = value;
    }

    public static create(): Rtm {
        return new Rtm();
    }

    public static fromObject(obj: IRtm): Rtm {
        return new Rtm(obj);
    }

    private readonly _props: IRtm = {
        id: uuidv4(),
        name: '',
        description: '',
        public: true,
        permissions: 'r--',
        tool: 'T10',
        data: {
            sensors: [],
            model: null
        }

    };

    constructor(data?: IRtm) {
        if (data) {
            this._props = data;
        }
    }

    public toObject(): IRtm {
        return this._props;
    }
}
