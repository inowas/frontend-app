import {cloneDeep} from 'lodash';
import {URL} from 'url';
import uuid from 'uuid';
import {DATADROPPER_URL} from '../../../services/api';
import {IFileDataSource} from './Sensor.type';

class FileDataSource {

    get id() {
        return this._props.id;
    }

    get url(): URL {
        return new URL(`${DATADROPPER_URL}/${this._props.filename}`);
    }

    get filename() {
        return this._props.filename;
    }

    public static fromFilename(filename: string) {
        return new FileDataSource({
            id: uuid.v4(),
            filename
        });
    }

    public static async fromData(data: object) {
        const response = await fetch(
            DATADROPPER_URL, {
                method: 'post',
                body: JSON.stringify(data),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                }
            });

        return new FileDataSource({
            id: uuid.v4(),
            filename: (await response.json()).filename,
            data
        });
    }

    public static fromObject(obj: IFileDataSource) {
        return new this(obj);
    }

    private readonly _props: IFileDataSource;

    constructor(data: IFileDataSource) {
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
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                }
            }
        );

        return await res.json();
    }

    public toObject() {
        return cloneDeep(this._props);
    }
}

export default FileDataSource;
