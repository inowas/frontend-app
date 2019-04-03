import AbstractCollection from '../../collection/AbstractCollection';
import SoilmodelZone from './SoilmodelZone';
import DefaultZone from './DefaultZone';

class ZonesCollection extends AbstractCollection {
    static fromArray(array, parseParameters = true) {
        const zc = new ZonesCollection();

        if (array.filter(z => z.priority === 0).length === 0) {
            const defaultZone = DefaultZone.fromDefault();
            zc.add(defaultZone);
        }

        zc.items = array.map(zone => {
            if (zone.priority === 0) {
                return DefaultZone.fromObject(zone, parseParameters);
            }
            return SoilmodelZone.fromObject(zone, parseParameters);
        });
        return zc;
    }

    validateInput(zone) {
        if (!zone instanceof SoilmodelZone) {
            throw new Error('Zone expected to be from Type Zone.');
        }
        return zone;
    }

    changeOrder(zone, order) {
        this.validateInput(zone);
        let zoneToSwitch = null;
        switch (order) {
            case 'up':
                zoneToSwitch = this.findBy('priority', zone.priority + 1, {first: true});
                zoneToSwitch.priority = zoneToSwitch.priority - 1;
                zone.priority = zone.priority + 1;
                break;
            case 'down':
                zoneToSwitch = this.findBy('priority', zone.priority - 1, {first: true});
                zoneToSwitch.priority = zoneToSwitch.priority + 1;
                zone.priority = zone.priority - 1;
                break;
            default:
                return this;
        }
        return this;
    }
}

export default ZonesCollection;