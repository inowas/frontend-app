import {cloneDeep} from 'lodash';

export class GenericObject<T> {

    protected readonly _props: T;

    constructor(data: T) {
        this._props = data;
    }

    public toObject(): T {
        return cloneDeep(this._props);
    }
}
