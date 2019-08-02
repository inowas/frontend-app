import {Collection} from '../collection/Collection';
import {IRasterParameter} from './RasterParameter.type';

class RasterParametersCollection extends Collection<IRasterParameter> {
    public static fromArray(array: IRasterParameter[]) {
        const zc = new RasterParametersCollection();
        zc.items = array;
        return zc;
    }

    public toArray() {
        return this.items;
    }
}

export default RasterParametersCollection;
