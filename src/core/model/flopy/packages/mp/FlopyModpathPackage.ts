import {IPropertyValueObject} from '../../../types';
import FlopySerializable from '../FlopySerializable';
import FlopyModpath from './FlopyModpath';
import {ModpathPackage} from './types';

export default class FlopyModpathPackage extends FlopySerializable {
    public static create(mp: FlopyModpath, obj: IPropertyValueObject = {}) {
        const self = this.fromObject(obj) as ModpathPackage;
        mp.setPackage(self);
        return self;
    }
}
