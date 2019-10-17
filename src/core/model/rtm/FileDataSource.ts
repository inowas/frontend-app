import uuid from 'uuid';
import {dropData, retrieveData} from '../../../services/dataDropper';
import {IDataDropperObject} from '../../../services/dataDropper/DataDropper.type';
import {GenericObject} from '../genericObject/GenericObject';
import {IDateTimeValue, IFileDataSource} from './Sensor.type';

class FileDataSource extends GenericObject<IFileDataSource> {

    get id() {
        return this._props.id;
    }

    get url(): URL {
        return new URL(`${this.file.server}/${this.file.filename}`);
    }

    get file(): IDataDropperObject {
        return this._props.file;
    }

    get data() {
        return this._props.data;
    }

    get begin() {
        if (this.data && this.data.length > 0) {
            return this.data[0].timeStamp;
        }

        return null;
    }

    get end() {
        if (this.data && this.data.length > 0) {
            return this.data[this.data.length - 1].timeStamp;
        }

        return null;
    }

    public static fromFile(file: IDataDropperObject) {
        const fds = new this({
            id: uuid.v4(),
            file,
            data: null,
            fetching: false,
            fetched: false,
            error: null
        });

        fds.loadData();

        return fds;
    }

    public static async fromData(data: IDateTimeValue[]) {
        const file: IDataDropperObject = await dropData(data);
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
            this.loadData();
        }
    }

    public async saveData(data: IDateTimeValue[]) {
        this._props.file = await dropData(data);
        this._props.data = data;
        return this;
    }

    public async loadData() {
        if (this._props.data) {
            return;
        }

        this._props.data = null;
        this._props.fetching = true;
        try {
            this._props.data = await retrieveData(this.file);
            this.sortData();
            this._props.fetching = false;
            this._props.fetched = true;
        } catch (e) {
            this._props.data = null;
            this._props.fetching = false;
            this._props.error = e;
        }
    }

    protected sortData = () => {
        if (this._props.data) {
            this._props.data.sort((a, b) => a.timeStamp - b.timeStamp);
        }
    };
}

export default FileDataSource;
