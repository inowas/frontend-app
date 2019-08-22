import FlopyModflowSerializable from '../FlopySerializable';
import FlopyModflow from './FlopyModflow';

const isValue = (data) => {
    return !isNaN(data);
};

const min = (a) => {
    if (isValue(a)) {
        return a;
    }

    const values = a
        .map(row => row.filter(v => (!isNaN(v) && v !== null)))
        .map(arr => (Math.min.apply(null, arr)));

    return Math.min.apply(null, values);
};

const max = (a) => {
    if (isValue(a)) {
        return a;
    }

    const values = a
        .map(row => row.filter(v => (!isNaN(v) && v !== null)))
        .map(arr => (Math.max.apply(null, arr)));
    return Math.max.apply(null, values);
};

export default class FlopyModflowPackage extends FlopyModflowSerializable {

    static create(model, obj = {}) {
        const self = this.fromObject(obj);
        if (model instanceof FlopyModflow) {
            model.setPackage(self)
        }
        return self;
    }

    minify2dGridIfPossible = (data) => {
        const minValue = min(data);
        const maxValue = max(data);
        if (minValue === maxValue) {
            return minValue;
        }

        return data;
    }
}
