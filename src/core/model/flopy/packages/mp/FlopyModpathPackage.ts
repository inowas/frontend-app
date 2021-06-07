import {IPropertyValueObject} from '../../../types';
import {ModpathPackage} from './types';
import FlopyModpath from './FlopyModpath';
import FlopySerializable from '../FlopySerializable';

export default class FlopyModpathPackage extends FlopySerializable {
    public static create(mp: FlopyModpath, obj: IPropertyValueObject = {}) {
        const self = this.fromObject(obj) as ModpathPackage;
        mp.setPackage(self);
        return self;
    }
}
