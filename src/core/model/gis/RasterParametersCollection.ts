import {Collection} from '../collection/Collection';
import {IRasterParameter} from './RasterParameter.type';

class RasterParametersCollection extends Collection<IRasterParameter> {
    public static fromObject(obj: IRasterParameter[]) {
        return new RasterParametersCollection(obj);
    }
}

export default RasterParametersCollection;
