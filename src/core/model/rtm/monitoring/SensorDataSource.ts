import { GenericObject } from '../../genericObject/GenericObject';
import { IDateTimeValue, ISensorDataSource } from './Sensor.type';
import { cloneDeep, maxBy, minBy } from 'lodash';
import { getUrlPathRegex, pathIsValid, retrieveData } from './SensorDataHelper';
import uuid from 'uuid';

class SensorDataSource extends GenericObject<ISensorDataSource> {
  get id() {
    return this._props.id;
  }

  get url(): URL {
    return new URL(this._props.url);
  }

  set url(url: URL) {
    if (this.url.toString() === url.toString()) {
      return;
    }

    this._props.url = url.toString();
    this._props.data = null;
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
    return getUrlPathRegex(this.url.pathname)[1];
  }

  set project(value: string) {
    const url = this.url;
    url.pathname = `/sensors/project/${value}/sensor/${this.sensor}/property/${this.parameter}`;

    if (!(getUrlPathRegex(url.pathname)[1] === value)) {
      throw new Error('Invalid project name');
    }

    this.url = url;
  }

  get sensor(): string {
    return getUrlPathRegex(this.url.pathname)[2];
  }

  set sensor(value: string) {
    const url = this.url;
    url.pathname = `/sensors/project/${this.project}/sensor/${value}/property/${this.parameter}`;
    if (!(getUrlPathRegex(url.pathname)[2] === value)) {
      throw new Error('Invalid sensor name');
    }

    this.url = url;
  }

  get parameter(): string {
    return getUrlPathRegex(this.url.pathname)[3];
  }

  set parameter(value: string) {
    const url = this.url;
    url.pathname = `/sensors/project/${this.project}/sensor/${this.sensor}/property/${value}`;

    if (!(getUrlPathRegex(url.pathname)[3] === value)) {
      throw new Error('Invalid sensor name');
    }

    this.url = url;
  }

  get timeResolution(): string | null {
    return this.urlSearchParams.get('timeResolution');
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
    if (min === null) {
      const minDtValue: IDateTimeValue | undefined | null = this.data ? minBy(this.data, 'value') : null;
      return minDtValue ? minDtValue.value : null;
    }

    return parseFloat(min);
  }

  set min(value: number | null) {
    const url = this.url;
    url.searchParams.delete('min');
    if (value !== null) {
      url.searchParams.append('min', value.toString());
    }

    this.url = url;
  }

  get max(): number | null {
    const max = this.urlSearchParams.get('max');
    if (max === null) {
      const maxDtValue: IDateTimeValue | undefined | null = this.data ? maxBy(this.data, 'value') : null;
      return maxDtValue ? maxDtValue.value : null;
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
    if (begin === null) {
      return this.data ? this.data[0].timeStamp : null;
    }

    return parseInt(begin, 10);
  }

  set begin(value: number | null) {
    const url = this.url;
    url.searchParams.delete('begin');
    if (value !== null) {
      url.searchParams.append('begin', value.toString());
    }
    this.url = url;
  }

  get end(): number | null {
    const end = this.urlSearchParams.get('end');
    if (end === null) {
      return this.data && this.data.length > 0 ? this.data[this.data.length - 1].timeStamp : null;
    }

    return parseInt(end, 10);
  }

  set end(value: number | null) {
    const url = this.url;
    url.searchParams.delete('end');
    if (value !== null) {
      url.searchParams.append('end', value.toString());
    }
    this.url = url;
  }

  get gt(): number | null {
    const gt = this.urlSearchParams.get('gt');
    if (gt === null) {
      return null;
    }

    return parseFloat(gt);
  }

  set gt(value: number | null) {
    const url = this.url;
    url.searchParams.delete('gt');
    if (value !== null) {
      url.searchParams.append('gt', value.toString());
    }
    this.url = url;
  }

  get gte(): number | null {
    const gte = this.urlSearchParams.get('gte');
    if (gte === null) {
      return null;
    }

    return parseFloat(gte);
  }

  set gte(value: number | null) {
    const url = this.url;
    url.searchParams.delete('gte');
    if (value !== null) {
      url.searchParams.append('gte', value.toString());
    }
    this.url = url;
  }

  get lt(): number | null {
    const lt = this.urlSearchParams.get('lt');
    if (lt === null) {
      return null;
    }

    return parseFloat(lt);
  }

  set lt(value: number | null) {
    const url = this.url;
    url.searchParams.delete('lt');
    if (value !== null) {
      url.searchParams.append('lt', value.toString());
    }
    this.url = url;
  }

  get lte(): number | null {
    const lte = this.urlSearchParams.get('lte');
    if (lte === null) {
      return null;
    }

    return parseFloat(lte);
  }

  set lte(value: number | null) {
    const url = this.url;
    url.searchParams.delete('lte');
    if (value !== null) {
      url.searchParams.append('lte', value.toString());
    }
    this.url = url;
  }

  get excl(): number | null {
    const excl = this.urlSearchParams.get('excl');
    if (excl === null) {
      return null;
    }

    return parseFloat(excl);
  }

  set excl(value: number | null) {
    const url = this.url;
    url.searchParams.delete('excl');
    if (value !== null) {
      url.searchParams.append('excl', value.toString());
    }
    this.url = url;
  }

  get isIdempotent() {
    return this.end !== null;
  }

  get fetching() {
    return this._props.fetching;
  }

  get fetched() {
    return this._props.fetched;
  }

  get error() {
    return this._props.error;
  }

  set data(data: IDateTimeValue[] | undefined | null) {
    this._props.data = data;
  }

  get data() {
    return this._props.data;
  }

  public static fromParams(server: string, project: string, sensor: string, parameter: string) {
    const url = `https://${server}/sensors/project/${project}/sensor/${sensor}/property/${parameter}`;
    const ds = new this({
      id: uuid.v4(),
      url,
    });

    if (pathIsValid(ds.urlPathName)) {
      return ds;
    }

    return null;
  }

  public static fromObject(obj: ISensorDataSource) {
    return new this(obj);
  }

  constructor(data: ISensorDataSource) {
    super(data);
    if (this.data === undefined) {
      this.loadData().then().catch();
    }
  }

  public async loadData() {
    if (this._props.data) {
      return this._props.data;
    }

    this._props.fetching = true;
    this._props.data = null;
    try {
      const data = await retrieveData({ url: this.url.toString() }, this.isIdempotent);
      this._props.data = cloneDeep(data);
      this.sortData();
      this._props.fetching = false;
      this._props.fetched = true;
    } catch (e) {
      this._props.data = null;
      this._props.fetching = false;
      this._props.error = e;
    }

    return this._props.data;
  }

  protected sortData = () => {
    if (this._props.data) {
      this._props.data.sort((a, b) => a.timeStamp - b.timeStamp);
    }
  };
}

export default SensorDataSource;
