import {cloneDeep} from 'lodash';
import {URL} from 'url';
import uuid from 'uuid';
import {IDateTimeValue, ISensorDataSource} from './Sensor.type';

class SensorDataSource {

    get id() {
        return this._props.id;
    }

    get url(): URL {
        return new URL(this._props.url);
    }

    set url(url: URL) {
        this._props.url = url.toString();
    }

    get urlProtocol(): string {
        return this.url.protocol;
    }

    get urlHostName(): string {
        return this.url.hostname;
    }

    get urlPathName(): string {
        return this.url.pathname;
    }

    get urlSearchParams(): URLSearchParams {
        return this.url.searchParams;
    }

    get server(): string {
        return this.url.hostname;
    }

    set server(value: string) {
        const url = this.url;
        url.hostname = value;
        this.url = url;
    }

    get project(): string {
        return this.getUrlPathRegex(this.url.pathname)[1];
    }

    set project(value: string) {
        const url = this.url;
        url.pathname = `/sensors/project/${value}/sensor/${this.sensor}/property/${this.parameter}`;

        if (!(this.getUrlPathRegex(url.pathname)[1] === value)) {
            throw new Error('Invalid project name');
        }

        this.url = url;
    }

    get sensor(): string {
        return this.getUrlPathRegex(this.url.pathname)[2];
    }

    set sensor(value: string) {
        const url = this.url;
        url.pathname = `/sensors/project/${this.project}/sensor/${value}/property/${this.parameter}`;

        if (!(this.getUrlPathRegex(url.pathname)[2] === value)) {
            throw new Error('Invalid sensor name');
        }

        this.url = url;
    }

    get parameter(): string {
        return this.getUrlPathRegex(this.url.pathname)[3];
    }

    set parameter(value: string) {
        const url = this.url;
        url.pathname = `/sensors/project/${this.project}/sensor/${this.sensor}/property/${value}`;

        if (!(this.getUrlPathRegex(url.pathname)[3] === value)) {
            throw new Error('Invalid sensor name');
        }

        this.url = url;
    }

    get timeResolution(): string | null {
        return this.urlSearchParams.get(`timeResolution`);
    }

    set timeResolution(value: string | null) {
        const url = this.url;
        url.searchParams.delete('timeResolution');
        if (value) {
            url.searchParams.append('timeResolution', value);
        }
        this.url = url;
    }

    get min(): number | null {
        const min = this.urlSearchParams.get('min');
        if (!min) {
            return null;
        }

        return parseFloat(min);
    }

    set min(value: number | null) {
        const url = this.url;
        url.searchParams.delete('min');
        if (value) {
            url.searchParams.append('min', value.toString());
        }
        this.url = url;
    }

    get max(): number | null {
        const max = this.urlSearchParams.get('max');
        if (!max) {
            return null;
        }

        return parseFloat(max);
    }

    set max(value: number | null) {
        const url = this.url;
        url.searchParams.delete('max');
        if (value) {
            url.searchParams.append('max', value.toString());
        }
        this.url = url;
    }

    get begin(): number | null {
        const begin = this.urlSearchParams.get('begin');
        if (!begin) {
            return null;
        }

        return parseInt(begin, 10);
    }

    set begin(value: number | null) {
        const url = this.url;
        url.searchParams.delete('begin');
        if (value) {
            url.searchParams.append('begin', value.toString());
        }
        this.url = url;
    }

    get end(): number | null {
        const end = this.urlSearchParams.get('end');
        if (!end) {
            return null;
        }

        return parseInt(end, 10);
    }

    set end(value: number | null) {
        const url = this.url;
        url.searchParams.delete('end');
        if (value) {
            url.searchParams.append('end', value.toString());
        }
        this.url = url;
    }

    set data(data: IDateTimeValue[]) {
        this._props.data = data;
    }

    public static fromParams(server: string, project: string, sensor: string, parameter: string) {
        const url = `https://${server}/sensors/project/${project}/sensor/${sensor}/property/${parameter}`;
        const ds = new this({
            id: uuid.v4(),
            url
        });

        if (ds.getUrlPathRegex(ds.urlPathName)) {
            return ds;
        }
    }

    public static fromObject(obj: ISensorDataSource) {
        return new this(obj);
    }

    private readonly _props: ISensorDataSource;

    constructor(data: ISensorDataSource) {
        this._props = data;
    }

    public async getData() {
        if (this._props.data) {
            return this._props.data;
        }

        const res = await fetch(
            this.url.toString(),
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        return await res.json();
    }

    public toObject() {
        return cloneDeep(this._props);
    }

    private getUrlPathRegex(path: string) {
        const myRe = /^\/sensors\/project\/([A-Za-z0-9-]+)\/sensor\/([A-Za-z0-9-]+)\/property\/([A-Za-z0-9-]+)$/;
        const matchObj = myRe.exec(path);

        if (!matchObj) {
            throw new Error('Invalid url-schema: ' + this.url.toString());
        }

        return matchObj;
    }
}

export default SensorDataSource;
