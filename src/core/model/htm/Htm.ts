import {GenericObject} from '../genericObject/GenericObject';
import {IHtm} from './Htm.type';
import {cloneDeep, includes} from 'lodash';
import HtmInput from './HtmInput';
import uuid from 'uuid';

export default class Htm extends GenericObject<IHtm> {

    get id(): string {
        return this._props.id;
    }

    set id(value: string) {
        this._props.id = value;
    }

    get inputGw(): HtmInput {
        const input = this._props.data.input.filter((i) => i.type === 'gw');
        if (input.length > 0) {
            return HtmInput.fromObject(input[0]);
        }
        return HtmInput.fromObject({type: 'gw'});
    }

    get inputSw(): HtmInput {
        const input = this._props.data.input.filter((i) => i.type === 'sw');
        if (input.length > 0) {
            return HtmInput.fromObject(input[0]);
        }
        return HtmInput.fromObject({type: 'sw'});
    }

    get options() {
        return this._props.data.options;
    }

    get results() {
        return this._props.data.results;
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

    public static fromDefaults() {
        return new Htm({
            id: uuid.v4(),
            name: 'New Heat Transport Model',
            data: {
                input: [{type: 'gw'}, {type: 'sw'}],
                options: {
                    retardation_factor: 1.8,
                    sw_monitoring_id: 'id1',
                    gw_monitoring_id: 'id2',
                    limits: [100, 500],
                    tolerance: 0.001,
                    debug: false
                }
            },
            description: '',
            permissions: 'rwx',
            public: true,
            tool: 'T19'
        });
    }

    public static fromObject(obj: IHtm) {
        return new Htm(obj);
    }

    public toObject(): IHtm {
        return cloneDeep(this._props);
    }

    public updateInput(value: HtmInput) {
        this._props.data.input = this._props.data.input.map((i) => {
            if (i.type === value.type) {
                return value.toObject();
            }
            return i;
        });
        return this;
    }
}
