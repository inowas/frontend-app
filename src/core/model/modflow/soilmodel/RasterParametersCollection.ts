import {defaultSoilmodelParameters} from '../../../../scenes/t03/defaults/soilmodel';
import {Collection} from '../../collection/Collection';
import {IRasterParameter} from './RasterParameter.type';

class RasterParametersCollection extends Collection<IRasterParameter> {
    public static fromObject(obj: IRasterParameter[]) {
        return new RasterParametersCollection(obj);
    }

    public findOrCreateById = (value: string) => {
        let item = this.findFirstBy('id', value, true);
        const param = defaultSoilmodelParameters.filter((p) => p.id === value);
        if (!item && param.length > 0) {
            item = param[0];
            this.add(param[0]);
        }
        return item;
    };

    public toObject() {
        return this.all;
    }
}

export default RasterParametersCollection;
