import SoilmodelLayer from './SoilmodelLayer';
import SoilmodelParameter from './SoilmodelParameter';
import SoilmodelZone from './SoilmodelZone';
import {defaultParameters} from '../../../../scenes/t03/defaults/soilmodel';

class DefaultZone extends SoilmodelZone {
    _name = 'Default';
    _cells = null;
    _geometry = null;
    _priority = 0;

    static fromDefault() {
        const zone = new DefaultZone();
        zone.top = SoilmodelParameter.fromObject(defaultParameters.top);
        zone.botm = SoilmodelParameter.fromObject(defaultParameters.botm);
        zone.hk = SoilmodelParameter.fromObject(defaultParameters.hk);
        zone.hani = SoilmodelParameter.fromObject(defaultParameters.hani);
        zone.vka = SoilmodelParameter.fromObject(defaultParameters.vka);
        zone.ss = SoilmodelParameter.fromObject(defaultParameters.ss);
        zone.sy = SoilmodelParameter.fromObject(defaultParameters.sy);
        return zone;
    }

    static fromLayer(layer) {
        if (!(layer instanceof SoilmodelLayer)) {
            throw new Error('Layer expects to be instance of SoilmodelLayer.');
        }

        const zone = new DefaultZone();
        zone.top = SoilmodelParameter.fromObject({...defaultParameters['top'], value: layer['top']});
        zone.botm = SoilmodelParameter.fromObject({...defaultParameters['botm'], value: layer['botm']});
        zone.hk = SoilmodelParameter.fromObject({...defaultParameters['hk'], value: layer['hk']});
        zone.hani = SoilmodelParameter.fromObject({...defaultParameters['hani'], value: layer['hani']});
        zone.vka = SoilmodelParameter.fromObject({...defaultParameters['vka'], value: layer['vka']});
        zone.ss = SoilmodelParameter.fromObject({...defaultParameters['ss'], value: layer['ss']});
        zone.sy = SoilmodelParameter.fromObject({...defaultParameters['sy'], value: layer['sy']});
        return zone;
    }
}

export default DefaultZone;