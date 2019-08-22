import {IRasterParameter} from './RasterParameter.type';

class RasterParameter {

    get defaultValue() {
        return this._props.defaultValue;
    }

    get isActive() {
        return this._props.isActive;
    }

    get id() {
        return this._props.id;
    }

    get unit() {
        return this._props.unit;
    }

    get title() {
        return this._props.title;
    }

    public static fromObject(obj: IRasterParameter) {
        return new RasterParameter(obj);
    }

    private readonly _props: IRasterParameter = {
        defaultValue: 0,
        isActive: true,
        id: '',
        unit: '',
        title: 'New Parameter',
    };

    constructor(obj: IRasterParameter) {
        this._props = {...obj};
    }

    public toObject() {
        return this._props;
    }
}

export default RasterParameter;
