import AbstractCollection from '../../collection/AbstractCollection';
import SoilmodelZone from './SoilmodelZone';

class ZonesCollection extends AbstractCollection {
    static fromArray(array, parseParameters = true) {
        const zc = new ZonesCollection();
        zc.items = array.map(zone => {
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