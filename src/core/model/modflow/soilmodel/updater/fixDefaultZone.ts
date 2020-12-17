import {ISoilmodel} from '../Soilmodel.type';
import {LayersCollection, ZonesCollection} from '../index';

const fixDefaultZone = (soilmodel: ISoilmodel) => {
    const zc = ZonesCollection.fromObject(soilmodel.properties.zones);

    let dZone = zc.findById('default') || zc.findFirstBy('name', 'Default Zone') || zc.findFirstBy('name', 'Default');

    const layer = LayersCollection.fromObject(soilmodel.layers).findFirstBy('number', 0);
    if (!dZone && layer && layer.relations.filter((r) => r.parameter === 'top').length === 1) {
        dZone = zc.findById(layer.relations[0].zoneId);
    }

    if (dZone) {
        dZone.isDefault = true;
        zc.update(dZone);
    }

    soilmodel.properties.zones = zc.toObject();
    return soilmodel;
};

export default fixDefaultZone;
