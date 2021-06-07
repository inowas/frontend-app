import {ISoilmodel1v0, ISoilmodel2v0} from './Soilmodel.type';
import {cloneDeep} from 'lodash';

class SoilmodelLegacy {
    public static fromObject(obj: ISoilmodel1v0 | ISoilmodel2v0) {
        return new SoilmodelLegacy(obj);
    }

    private readonly _props: ISoilmodel1v0 | ISoilmodel2v0;

    constructor(props: ISoilmodel1v0 | ISoilmodel2v0) {
        this._props = cloneDeep(props);
    }

    public toObject() {
        return this._props;
    }
}

export default SoilmodelLegacy;
