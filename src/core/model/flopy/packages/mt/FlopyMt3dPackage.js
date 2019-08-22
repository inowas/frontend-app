import FlopyModflowSerializable from '../FlopySerializable';
import {FlopyMt3d} from './index';

export default class FlopyMt3dPackage extends FlopyModflowSerializable {
    static create(mt, obj = {}) {
        const self = this.fromObject(obj);
        if (mt instanceof FlopyMt3d) {
            mt.setPackage(self)
        }
        return self;
    }
}