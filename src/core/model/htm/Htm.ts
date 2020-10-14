import {cloneDeep, includes} from 'lodash';
import {IHeatTransportInput, IHtm} from './Htm.type';

export default class Htm {

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

    get readOnly() {
        return !includes(this.permissions, 'w');
    }

    public static fromObject(obj: IHtm) {
        return new Htm(obj);
    }

    private readonly _props: IHtm;

    constructor(data: IHtm) {
        this._props = cloneDeep(data);
    }

    public toObject(): IHtm {
        return cloneDeep(this._props);
    }
}
