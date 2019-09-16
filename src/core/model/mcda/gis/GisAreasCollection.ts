import {Collection} from '../../collection/Collection';
import {IGisArea} from './GisArea.type';

class GisAreasCollection extends Collection<IGisArea> {
    public static fromObject(obj: IGisArea[]) {
        return new GisAreasCollection(obj);
    }

    public toObject() {
        return this.all;
    }
}

export default GisAreasCollection;
