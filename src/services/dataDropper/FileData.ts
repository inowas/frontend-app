import { GenericObject } from '../../core/model/genericObject/GenericObject';
import { IDataDropperData, IDataDropperFile } from './DataDropper.type';
import { dropData, retrieveData } from './DataDropperHelper';

class FileData<T> extends GenericObject<IDataDropperData<T>> {

    public static async fromFile(file: IDataDropperFile) {
        const fds = new this({
            file,
            data: undefined,
            fetching: false,
            fetched: false,
            error: null
        });

        await fds.loadData().then().catch();
        return fds;
    }

    public static async fromData(data: any, automaticDrop = true) {
        let file = null;
        if (automaticDrop) {
            file = await dropData(data);
        }

        return new this({
            file,
            data,
            fetching: false,
            fetched: true,
            error: null
        });
    }

    public static fromObject(obj: any) {
        return new this(obj);
    }

    constructor(data: IDataDropperData<T>) {
        super(data);
        if (this.data === undefined) {
            this.loadData().then().catch();
        }
    }

    public get data() {
        return this._props.data;
    }

    public get file() {
        return this._props.file;
    }

    public set file(value) {
        this._props.file = value;
    }

    public async drop() {
        this.file = await dropData(this.data);
    }

    public async loadData() {
        if (this._props.data || this._props.fetching) {
            return null;
        }

        this._props.data = undefined;
        this._props.fetching = true;
        try {
            if (this.file) {
                this._props.data = await retrieveData(this.file);
            }

            this._props.fetching = false;
            this._props.fetched = true;
        } catch (e) {
            this._props.data = undefined;
            this._props.fetching = false;
            this._props.error = e;
        }
    }

    public toFile() {
        return this.file;
    }

    public toPayload() {
        return this.toFile();
    }
}

export default FileData;
