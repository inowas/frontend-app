import {IPrometheusResponseData, ISensorData, IServerSensorData} from './Sensor.type';
import moment from 'moment';

export async function retrieveData(sensorData: ISensorData, caching = false) {
    const url = new URL(`${sensorData.url}`);

    const localStorageObj = sessionStorage.getItem(url.toString());
    if (localStorageObj) {
        const obj = JSON.parse(localStorageObj);
        if (obj.TTL && obj.TTL > moment.utc().unix()) {
            return obj.data;
        }
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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            delete d.date_time;
            const value = Object.values(d)[0] as number;
            return {
                timeStamp,
                value
            };
        });

        let TTL = moment.utc().unix() + (10 * 60); // 10 minutes

        if (caching) {
            TTL = moment.utc().unix() + (60 * 60 * 24); // 24 hours
        }

        sessionStorage.setItem(url.toString(), JSON.stringify({data, TTL}));

        return data;
    } catch (e) {
        return null;
    }
}

export async function retrievePrometheusData(url: string) {
    const response = await fetch(
        url.toString(), {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            }
        });

    try {
        return await response.json() as IPrometheusResponseData;
    } catch (e) {
        return null;
    }
}

export function getUrlPathRegex(path: string) {
    const myRe = /^\/sensors\/project\/([A-Za-z0-9-_ ]+)\/sensor\/([A-Za-z0-9-_ ]+)\/property\/([A-Za-z0-9-_ ]+)$/;
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
