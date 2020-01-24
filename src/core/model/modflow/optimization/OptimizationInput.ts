import uuidv4 from 'uuid/v4';
import OptimizationConstraintsCollection from './ConstraintsCollection';
import OptimizationObjectivesCollection from './ObjectivesCollection';
import OptimizationObjectsCollection from './ObjectsCollection';
import {IOptimizationInput} from './OptimizationInput.type';
import OptimizationParameters from './OptimizationParameters';

class OptimizationInput {

    get id() {
        return this._props.id;
    }

    set id(value) {
        this._props.id = value ? value : uuidv4();
    }

    get parameters() {
        return OptimizationParameters.fromObject(this._props.parameters);
    }

    set parameters(value: OptimizationParameters) {
        this._props.parameters = value.toObject();
    }

    get constraintsCollection() {
        return OptimizationConstraintsCollection.fromObject(this._props.constraints);
    }

    set constraintsCollection(value: OptimizationConstraintsCollection) {
        this._props.constraints = value.toObject();
    }

    get objectivesCollection() {
        return OptimizationObjectivesCollection.fromObject(this._props.objectives);
    }

    set objectivesCollection(value: OptimizationObjectivesCollection) {
        this._props.objectives = value.toObject();
    }

    get objectsCollection() {
        return OptimizationObjectsCollection.fromObject(this._props.objects);
    }

    set objectsCollection(value: OptimizationObjectsCollection) {
        this._props.objects = value.toObject();
    }

    public static fromDefaults() {
        return new this({
            id: uuidv4(),
            parameters: OptimizationParameters.fromDefaults().toObject(),
            objectives: [],
            constraints: [],
            objects: []
        });
    }

    public static fromObject(obj: IOptimizationInput) {
        return new this(obj);
    }
    private readonly _props: IOptimizationInput;

    constructor(props: IOptimizationInput) {
        this._props = props;
    }

    public toObject() {
        return this._props;
    }
}

export default OptimizationInput;
