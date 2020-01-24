import uuidv4 from 'uuid/v4';
import {EConstraintType, EOperator, IOptimizationConstraint} from './OptimizationConstraint.type';
import OptimizationLocation from './OptimizationLocation';
import {ELocationType} from './OptimizationLocation.type';
import {ESummaryMethod} from './OptimizationObjective.type';

class OptimizationConstraint {

    get id() {
        return this._props.id;
    }

    set id(value) {
        this._props.id = value ? value : uuidv4();
    }

    get name() {
        return this._props.name;
    }

    set name(value) {
        this._props.name = value ? value : 'New Optimization Constraint';
    }

    get type() {
        return this._props.type;
    }

    set type(value: EConstraintType) {
        this._props.type = value ? value : EConstraintType.NONE;

        if (value === EConstraintType.FLUX || value === EConstraintType.INPUT_CONC) {
            this._props.location.type = ELocationType.OBJECT;
        }
    }

    get concFileName() {
        return this._props.concFileName;
    }

    set concFileName(value) {
        this._props.concFileName = value;
    }

    get summaryMethod() {
        return this._props.summaryMethod;
    }

    set summaryMethod(value) {
        this._props.summaryMethod = value ? value : ESummaryMethod.MEAN;
    }

    get value() {
        return this._props.value;
    }

    set value(value) {
        this._props.value = value;
    }

    get operator() {
        return this._props.operator;
    }

    set operator(value) {
        this._props.operator = value;
    }

    get location() {
        return OptimizationLocation.fromObject(this._props.location);
    }

    set location(value: OptimizationLocation) {
        this._props.location = value.toObject();
    }

    get location1() {
        return OptimizationLocation.fromObject(this._props.location1);
    }

    set location1(value: OptimizationLocation) {
        this._props.location1 = value.toObject();
    }

    get location2() {
        return OptimizationLocation.fromObject(this._props.location2);
    }

    set location2(value: OptimizationLocation) {
        this._props.location2 = value.toObject();
    }

    public static fromObject(obj: IOptimizationConstraint) {
        return new this(obj);
    }

    public static fromDefaults() {
        return new this({
           id: uuidv4(),
           name: 'New Optimization Constraint',
           type: EConstraintType.NONE,
           concFileName: 'MT3D001.UCN',
           summaryMethod: ESummaryMethod.MEAN,
           value: 0,
           operator: EOperator.MORE,
           location: OptimizationLocation.fromDefaults().toObject(),
           location1: OptimizationLocation.fromDefaults().toObject(),
           location2: OptimizationLocation.fromDefaults().toObject()
        });
    }
    private readonly _props: IOptimizationConstraint;

    constructor(props: IOptimizationConstraint) {
        this._props = props;
    }

    public toObject() {
        return this._props;
    }
}

export default OptimizationConstraint;
