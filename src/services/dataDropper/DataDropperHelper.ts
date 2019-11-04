import {DATADROPPER_URL} from '../api';
import {IDataDropperFile} from './DataDropper.type';

export async function dropData(data: any) {
    const response = await fetch(
        DATADROPPER_URL, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            }
        });

    const filename = (await response.json()).filename;
    sessionStorage.setItem(filename, JSON.stringify(data));

    return {
        filename,
        server: DATADROPPER_URL
    } as IDataDropperFile;
}

export async function retrieveData(file: IDataDropperFile) {
    const url = new URL(`${file.server}/${file.filename}`);

    const localStorageObj = sessionStorage.getItem(file.filename);
    if (localStorageObj) {
        return JSON.parse(localStorageObj);
    }

    const response = await fetch(
        url.toString(), {
            method: 'get',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            }
        });

    try {
        return await response.json();
    } catch (e) {
        throw new Error('Datadropper file not found');
    }
}
