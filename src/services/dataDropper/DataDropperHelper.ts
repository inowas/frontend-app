import { DATADROPPER_URL } from '../api';
import { IDataDropperFile } from './DataDropper.type';

const readFromSessionStorage = (filename: string) => {
  const sessionStorageObj = sessionStorage.getItem(filename);
  if (sessionStorageObj) {
    return JSON.parse(sessionStorageObj);
  }
  return null;
};

const writeToSessionStorage = (filename: string, data: any) => {
  try {
    sessionStorage.setItem(filename, JSON.stringify(data));
  } catch (e) {
    if (e instanceof DOMException) {
      sessionStorage.clear();
      sessionStorage.setItem(filename, JSON.stringify(data));
    }
  }
};

export async function dropData(data: any) {
  const response = await fetch(
    DATADROPPER_URL, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });

  const filename = (await response.json()).filename;
  writeToSessionStorage(filename, data);

  return {
    filename,
    server: DATADROPPER_URL,
  } as IDataDropperFile;
}

export async function retrieveData(file: IDataDropperFile) {
  const sessionStorageObj = readFromSessionStorage(file.filename);
  if (sessionStorageObj) {
    return sessionStorageObj;
  }

  const url = new URL(`${file.server}/${file.filename}`);
  const response = await fetch(
    url.toString(), {
      method: 'get',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });

  try {
    const data = await response.json();
    writeToSessionStorage(file.filename, data);
    return data;
  } catch (e) {
    throw new Error('Datadropper file not found');
  }
}
