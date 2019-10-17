import moment from 'moment';
import {ISensorData, IServerSensorData} from './Sensor.type';

export async function retrieveData(sensorData: ISensorData, caching: boolean = false) {
    const url = new URL(`${sensorData.url}`);

    const localStorageObj = sessionStorage.getItem(url.toString());
    if (localStorageObj) {
        return JSON.parse(localStorageObj);
    }

    const response = await fetch(
        url.toString(), {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            }
        });

    try {
        const json = await response.json() as IServerSensorData[];
        const data = json.map((d) => {
            const timeStamp = moment.utc(d.date_time).unix();
            delete d.date_time;
            const value = Object.values(d)[0] as number;
            return {
                timeStamp,
                value
            };
        });

        if (caching) {
            sessionStorage.setItem(url.toString(), JSON.stringify(data));
        }

        return data;
    } catch (e) {
        return null;
    }
}

export function getUrlPathRegex(path: string) {
    const myRe = /^\/sensors\/project\/([A-Za-z0-9-]+)\/sensor\/([A-Za-z0-9-]+)\/property\/([A-Za-z0-9-_]+)$/;
    const matchObj = myRe.exec(path);

    if (!matchObj) {
        throw new Error('Invalid url-schema: ' + path);
    }

    return matchObj;
}

export function pathIsValid(path: string) {
    try {
        getUrlPathRegex(path);
    } catch (e) {
        return false;
    }

    return true;
}
