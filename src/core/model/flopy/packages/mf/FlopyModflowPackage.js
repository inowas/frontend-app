import FlopyModflowSerializable from '../FlopyModflowSerializable';
import FlopyModflow from './FlopyModflow';

export default class FlopyModflowPackage extends FlopyModflowSerializable {

    static create(model, obj = {}) {
        const self = this.fromObject(obj);
        if (model instanceof FlopyModflow) {
            model.setPackage(self)
        }
        return self;
    }
}
