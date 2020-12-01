import {GenericObject} from '../genericObject/GenericObject';
import {IDateTimeValue, IPrometheusDataSource} from './Sensor.type';
import {retrievePrometheusData} from './SensorDataHelper';
import moment from 'moment';

class PrometheusDataSource extends GenericObject<IPrometheusDataSource> {

    get id(): string {
        return this._props.id;
    }

    get data(): IDateTimeValue[] | null | undefined {
        return this._props.data;
    }

    set data(value) {
        this._props.data = value;
    }

    get protocol(): string {
        return this._props.protocol;
    }

    get hostname(): string {
        return this._props.hostname;
    }

    set hostname(value) {
        this._props.hostname = value;
    }

    get start(): number {
        return this._props.start;
    }

    set start(value) {
        this._props.start = value;
    }

    get begin(): number {
        return this._props.start;
    }

    set begin(value) {
        this._props.start = value;
    }

    get end(): number | undefined {
        return this._props.end;
    }

    set end(value) {
        this._props.end = value;
    }

    get step(): number {
        return this._props.step;
    }

    set step(value) {
        this._props.step = value;
    }

    get error(): any {
        return this._props.error;
    }

    get url() {
        return `${this.protocol}://${this.hostname}/api/v1/query_range?` +
            `query=${encodeURIComponent(this.query)}&` +
            `start=${this.start}&` +
            `end=${this.end ? this.end : moment.utc().startOf('minute').unix()}&` +
            `step=${this.step}`;
    }

    get query(): string {
        return this._props.query;
    }

    set query(value) {
        this._props.query = value;
    }

    public static fromObject(obj: IPrometheusDataSource): PrometheusDataSource {
        return new PrometheusDataSource(obj);
    }

    constructor(obj: IPrometheusDataSource) {
        super(obj);
        if (this.data === undefined) {
            this.loadData().then().catch();
        }
    }

    public async loadData() {
        if (this._props.data) {
            return await this._props.data;
        }

        this._props.fetching = true;
        this._props.data = null;
        this._props.error = undefined;
        try {
            const data = await retrievePrometheusData(this.url.toString());
            if (data && data.status && data.status === 'success') {
                this.data = null;
                if (data.data.result.length > 0 && data.data.result[0].values) {
                    this.data = data.data.result[0].values.map((v) => ({
                        timeStamp: v[0],
                        value: parseFloat(v[1])
                    }));
                }
                this._props.fetching = false;
                this._props.fetched = true;
                return;
            }

            if (data && data.status && data.status === 'error') {
                this._props.data = null;
                this._props.fetching = false;
                this._props.error = data.error;
                return;
            }

        } catch (e) {
            this._props.data = null;
            this._props.fetching = false;
            this._props.error = e;
        }

        return await this._props.data;
    }
}

export default PrometheusDataSource;
