export default class DeepDiff {

    public static map(obj1: any, obj2: any) {
        const ddm = new DeepDiff();
        return ddm.compare(obj1, obj2);
    }

    private static isFunction(obj: any) {
        return {}.toString.apply(obj) === '[object Function]';
    }

    private static isArray(obj: any) {
        return {}.toString.apply(obj) === '[object Array]';
    }

    private static isDate(obj: any) {
        return {}.toString.apply(obj) === '[object Date]';
    }

    private static isObject(obj: any) {
        return {}.toString.apply(obj) === '[object Object]';
    }

    private static isValue(obj: any) {
        return !DeepDiff.isObject(obj) && !DeepDiff.isArray(obj);
    }

    private VALUE_CREATED = 'created';
    private VALUE_UPDATED = 'updated';
    private VALUE_DELETED = 'deleted';
    private VALUE_UNCHANGED = 'unchanged';

    private compare(obj1: any, obj2: any) {
        if (DeepDiff.isFunction(obj1) || DeepDiff.isFunction(obj2)) {
            throw new Error('Invalid argument. Function given, object expected.');
        }
        if (DeepDiff.isValue(obj1) || DeepDiff.isValue(obj2)) {
            return {
                type: this.compareValues(obj1, obj2),
                data: (obj1 === undefined) ? obj2 : obj1
            };
        }

        const diff: any = {};
        for (const k1 in obj1) {
            if (!obj1.hasOwnProperty(k1)) {
                continue;
            }

            if (DeepDiff.isFunction(obj1[k1])) {
                continue;
            }

            let value2;
            if ('undefined' !== typeof (obj2[k1])) {
                value2 = obj2[k1];
            }

            diff[k1] = this.compare(obj1[k1], value2);
        }

        for (const k2 in obj2) {
            if (obj2.hasOwnProperty(k2)) {
                if (DeepDiff.isFunction(obj2[k2]) || ('undefined' !== typeof (diff[k2]))) {
                    continue;
                }

                diff[k2] = this.compare(undefined, obj2[k2]);
            }
        }

        return diff;
    }

    private compareValues(v1: any, v2: any) {
        if (v1 === v2) {
            return this.VALUE_UNCHANGED;
        }
        if (DeepDiff.isDate(v1) && DeepDiff.isDate(v2) && v1.getTime() === v2.getTime()) {
            return this.VALUE_UNCHANGED;
        }
        if ('undefined' === typeof (v1)) {
            return this.VALUE_CREATED;
        }
        if ('undefined' === typeof (v2)) {
            return this.VALUE_DELETED;
        }

        return this.VALUE_UPDATED;
    }
}
