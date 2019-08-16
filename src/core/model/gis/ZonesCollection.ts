import {Collection} from '../collection/Collection';
import {IZone} from './Zone.type';

class ZonesCollection extends Collection<IZone> {
    public static fromObject(obj: IZone[]) {
        return new ZonesCollection(obj);
    }

    public reorder() {
        return this;
    }
}

export default ZonesCollection;
