import OptimizationObjectsCollection from './ObjectsCollection';
import {ELocationType, IOptimizationLocation} from './OptimizationLocation.type';

class OptimizationLocation {

    get type() {
        return this._props.type;
    }

    set type(value) {
        this._props.type = value ? value : ELocationType.BBOX;
    }

    get ts() {
        return this._props.ts;
    }

    set ts(value) {
        this._props.ts = value ? value : {min: 0, max: 0, result: null};
    }

    get objectsCollection() {
        return OptimizationObjectsCollection.fromObject(this._props.objects);
    }

    set objectsCollection(value: OptimizationObjectsCollection) {
        this._props.objects = value.toObject();
    }

    public static fromObject(obj: IOptimizationLocation) {
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
            },
            type: ELocationType.BBOX,
            ts: {
                min: 0,
                max: 0,
                result: null
            },
            objects: []
        });
    }

    private readonly _props: IOptimizationLocation;

    constructor(props: IOptimizationLocation) {
        this._props = props;
    }

    public toObject() {
        return this._props;
    }
}

export default OptimizationLocation;
