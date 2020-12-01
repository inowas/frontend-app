import {GenericObject} from '../genericObject/GenericObject';
import {IDataDropperFile} from '../../../services/dataDropper/DataDropper.type';
import {IDateTimeValue, IFileDataSource} from './Sensor.type';
import {cloneDeep} from 'lodash';
import {dropData, retrieveData} from '../../../services/dataDropper';
import uuid from 'uuid';

class FileDataSource extends GenericObject<IFileDataSource> {

    get id() {
        return this._props.id;
    }

    get url(): URL {
        return new URL(`${this.file.server}/${this.file.filename}`);
    }

    get file(): IDataDropperFile {
        return this._props.file;
    }

    get data() {
        return this._props.data;
    }

    get begin() {
        return this._props.begin || null;
    }

    set begin(value: number | null) {
        this._props.begin = value;
    }

    get end() {
        return this._props.end || null;
    }

    set end(value: number | null) {
        this._props.end = value;
    }

    get lte(): number | null {
        return this._props.lte || null;
    }

    set lte(value: number | null) {
        this._props.lte = value;
    }

    get max(): number | null {
        return this.lte;
    }

    set max(value: number | null) {
        this.lte = value;
    }

    get gte(): number | null {
        return this._props.gte || null;
    }

    set gte(value: number | null) {
        this._props.gte = value;
    }

    get min(): number | null {
        return this.gte;
    }

    set min(value: number | null) {
        this.gte = value;
    }

    public static fromFile(file: IDataDropperFile) {
        const fds = new this({
            id: uuid.v4(),
            file,
            data: null,
            fetching: false,
            fetched: false,
            error: null
        });

        fds.loadData().then().catch();
        return fds;
    }

    public static async fromData(data: IDateTimeValue[]) {
        const file: IDataDropperFile = await dropData(data);
        return new this({
            id: uuid.v4(),
            file,
            data,
            fetching: false,
            fetched: true,
            error: null
        });
    }

    public static fromObject(obj: IFileDataSource) {
        return new this(obj);
    }

    constructor(data: IFileDataSource) {
        super(data);
        if (this.data === undefined) {
            this.loadData().then().catch();
        }
    }

    public async saveData(data: IDateTimeValue[]) {
        this._props.file = await dropData(data);
        this._props.data = data;
        return this;
    }

    public async loadData() {
        if (!this.data) {
            try {
                this._props.fetching = true;
                this._props.data = await retrieveData(this.file);
                this._props.fetching = false;
                this._props.fetched = true;
            } catch (e) {
                this._props.data = null;
                this._props.fetching = false;
                this._props.error = e;
            }
        }

        return this.sortAndFilterData();
    }

    protected sortAndFilterData = () => {
        if (!this.data) {
            return null;
        }

        let data = cloneDeep(this.data);
        data.sort((a, b) => a.timeStamp - b.timeStamp);

        if (this.begin) {
            data = data.filter((dtv: IDateTimeValue) => {
                if (this.begin) {
                    return (dtv.timeStamp >= this.begin);
                }

                return true;
            });
        }

        if (this.end) {
            data = data.filter((dtv: IDateTimeValue) => {
                if (this.end) {
                    return (dtv.timeStamp <= this.end);
                }

                return true;
            });
        }

        if (this.gte) {
            data = data.filter((dtv: IDateTimeValue) => {
                if (this.gte) {
                    return (dtv.value >= this.gte);
                }

                return true;
            });
        }

        if (this.lte) {
            data = data.filter((dtv: IDateTimeValue) => {
                if (this.lte) {
                    return (dtv.value <= this.lte);
                }

                return true;
            });
        }

        return data;
    };
}

export default FileDataSource;
