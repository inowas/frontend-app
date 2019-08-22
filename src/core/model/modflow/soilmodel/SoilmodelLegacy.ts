import {cloneDeep} from 'lodash';
import {ISoilmodelLegacy} from './Soilmodel.type';

class SoilmodelLegacy {
    public static fromObject(obj: ISoilmodelLegacy) {
        return new SoilmodelLegacy(obj);
    }

    private readonly _props: ISoilmodelLegacy;

    constructor(props: ISoilmodelLegacy) {
        this._props = cloneDeep(props);
    }

    public toObject() {
        return this._props;
    }
}

export default SoilmodelLegacy;
