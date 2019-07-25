import FlopyModflowSerializable from '../FlopySerializable';
import FlopySeawat from './FlopySeawat';

export default class FlopySeawatPackage extends FlopyModflowSerializable {
    static create(swt, obj = {}) {
        const self = this.fromObject(obj);
        if (swt instanceof FlopySeawat) {
            swt.setPackage(self)
        }
        return self;
    }
}
