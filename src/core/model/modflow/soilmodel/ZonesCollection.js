import AbstractCollection from '../../AbstractCollection';
import Zone from './SoilmodelZone';

class ZonesCollection extends AbstractCollection {

    static fromObject(zones) {
        const zc = new ZonesCollection();
        zones.forEach(zone => zc.add(Zone.fromObject(zone)));
        return zc;
    }

    get zones() {
        return this._items;
    }

    set zones(value) {
        this._items = value;
    }

    toArray = () => {
        return this.zones.map(zone => zone.toObject());
    };

    toObject = () => {
        return {
            zones: this.zones.map(zone => zone.toObject())
        }
    };

    validateInput(zone) {
        if(!zone instanceof Zone) {
            throw new Error('Zone expected to be from Type Zone.');
        }
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