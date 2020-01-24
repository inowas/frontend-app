import uuidv4 from 'uuid/v4';
import {EConstraintType} from './OptimizationConstraint.type';
import OptimizationLocation from './OptimizationLocation';
import {ELocationType} from './OptimizationLocation.type';
import {ESummaryMethod, IOptimizationObjective} from './OptimizationObjective.type';

class OptimizationObjective {

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
        this._props.name = value !== '' ? value : 'New Optimization Objective';
    }

    get type() {
        return this._props.type;
    }

    set type(value) {
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

    get weight() {
        return this._props.weight;
    }

    set weight(value) {
        this._props.weight = value;
    }

    get penaltyValue() {
        return this._props.penaltyValue;
    }

    set penaltyValue(value) {
        this._props.penaltyValue = value;
    }

    get target() {
        return this._props.target;
    }

    set target(value) {
        this._props.target = value;
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

    public static fromObject(obj: IOptimizationObjective) {
        return new this(obj);
    }

    public static fromDefaults() {
        return new this({
            id: uuidv4(),
            name: 'New Optimization Objective',
            type: EConstraintType.NONE,
            concFileName: 'MT3D001.UCN',
            summaryMethod: ESummaryMethod.MEAN,
            weight: -1,
            penaltyValue: 999,
            target: null,
            location: OptimizationLocation.fromDefaults().toObject(),
            location1: OptimizationLocation.fromDefaults().toObject(),
            location2: OptimizationLocation.fromDefaults().toObject()
        });
    }
    private readonly _props: IOptimizationObjective;

    constructor(props: IOptimizationObjective) {
        this._props = props;
    }

    public toObject() {
        return this._props;
    }
}

export default OptimizationObjective;
