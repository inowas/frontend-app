import AbstractCollection from '../../../AbstractCollection';
import Zone from './SoilmodelZone';

class ZonesCollection extends AbstractCollection {
    static fromArray(array) {
        const zc = new ZonesCollection();
        zc.items = array.map(zone => Zone.fromObject(zone));
        return zc;
    }

    validateInput(zone) {
        if (!zone instanceof Zone) {
            throw new Error('Zone expected to be from Type Zone.');
        }
        return zone;
    }

    changeOrder(zone, order) {
        this.validateInput(zone);
        let zoneToSwitch = null;
        switch (order) {
            case 'up':
                zoneToSwitch = this.findBy('priority', zone.priority + 1, true);
                zoneToSwitch.priority = zoneToSwitch.priority - 1;
                zone.priority = zone.priority + 1;
                break;
            case 'down':
                zoneToSwitch = this.findBy('priority', zone.priority - 1, true);
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