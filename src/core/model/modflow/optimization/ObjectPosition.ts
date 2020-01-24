import {IObjectPosition} from './ObjectPosition.type';

class ObjectPosition {
    public static fromObject(obj: IObjectPosition) {
        return new this(obj);
    }

    public static fromDefaults() {
        return new this({
            lay: {
                min: 0,
                max: 0,
                result: null
            },
            row: {
                min: 0,
                max: 0,
                result: null
            },
            col: {
                min: 0,
                max: 0,
                result: null
            }
        });
    }
    private readonly _props: IObjectPosition;

    constructor(props: IObjectPosition) {
        this._props = props;
    }

    public toObject() {
        return this._props;
    }
}

export default ObjectPosition;
