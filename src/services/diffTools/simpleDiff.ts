import {forEach, isArray, isEqual, isObject} from 'lodash';

const objDiff = (newObj: any, currObj: any) => {
    const r: any = {};
    forEach(newObj, (v, k) => {
        if (currObj[k] === v) {
            return;
        }

        if (isArray(currObj[k]) && isArray(v)) {
            if (isEqual(currObj[k], v)) {
                return;
            }

            r[k] = v;
        } else if (isObject(v)) {
            r[k] = objDiff(v, currObj[k]);
        } else {
            r[k] = v;
        }
    });

    for (const prop in r) {
        if (r.hasOwnProperty(prop) && isEqual(r[prop], {})) {
            delete r[prop];
        }
    }

    return r;
};

export default objDiff;
