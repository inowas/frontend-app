import {ISoilmodel} from '../Soilmodel.type';
import {defaultSoilmodelParameters, otherParameters} from '../../../../../scenes/t03/defaults/soilmodel';

const fixLayerParameters = (soilmodel: ISoilmodel) => {
    const defaultParameters = defaultSoilmodelParameters.concat(otherParameters);

    soilmodel.layers = soilmodel.layers.map((l) => {
        l.parameters = l.parameters.map((p) => {
            if (!p.value && !p.data.file) {
                p.data = {file: null};
                p.value = defaultParameters.filter((dp) => dp.id === p.id).length > 0 ?
                    defaultParameters.filter((dp) => dp.id === p.id)[0].defaultValue : 0;
            }
            return p;
        });
        return l;
    });
    return soilmodel;
};

export default fixLayerParameters;
