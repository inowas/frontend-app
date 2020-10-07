import {ICalculation} from './Calculation.type';

export default class Calculation {

    get id() {
        return this._props.calculation_id;
    }

    set id(value) {
        this._props.calculation_id = value;
    }

    get state() {
        return this._props.state;
    }

    set state(value) {
        this._props.state = value;
    }

    get message() {
        return this._props.message;
    }

    set message(value) {
        this._props.message = value;
    }

    get files() {
        return this._props.files;
    }

    set files(value) {
        this._props.files = value;
    }

    get times() {
        return this._props.times;
    }

    set times(value) {
        this._props.times = value;
    }

    get layer_values() {
        return this._props.layer_values;
    }

    set layer_values(value) {
        this._props.layer_values = value;
    }

    public static fromCalculationIdAndState(calculationId: string, state: number) {
        const self = new this();
        self.id = calculationId;
        self.state = state;
        return self;
    }

    public static fromQuery(query: ICalculation) {
        return new this(query);
    }

    public static fromObject(obj: ICalculation) {
        return new this(obj);
    }

    private readonly _props: ICalculation = {
        calculation_id: '',
        state: 0,
        message: '',
        times: null,
        layer_values: [],
        files: []
    };

    public constructor(props?: ICalculation) {
        if (props) {
            this._props = props;
        }
    }

    public isValid = () => {
        return !!this.id;
    };

    public toObject = () => (this._props);
}
