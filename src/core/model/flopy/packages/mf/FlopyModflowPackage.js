import FlopyModflowSerializable from './FlopyModflowSerializable';
import FlopyModflowMf from './FlopyModflowMf';

export default class FlopyModflowPackage extends FlopyModflowSerializable {

    static create(model, obj = {}) {
        const self = this.fromObject(obj);
        if (model instanceof FlopyModflowMf) {
            model.setPackage(self)
        }
        return self;
    }

    arrayToObject = (array) => {
        const obj = {};
        array.forEach((item, idx) => {
            obj[idx] = item;
        });
        return obj;
    }
}
