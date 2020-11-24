import {cloneDeep} from 'lodash';

export class GenericObject<T> {

    public static cloneDeep(obj: any) {
        return cloneDeep(obj);
    }

    protected _props: T;

    constructor(data: T) {
        this._props = data;
    }

    public toObject(): T {
        return GenericObject.cloneDeep(this._props);
    }

    public getClone() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return new this.constructor(cloneDeep(this._props));
    }
}
