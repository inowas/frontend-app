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

    toObject = () => {
        return {
            layers: this.zones.map(zone => zone.toObject())
        }
    };

    validateInput(zone) {
        if(!zone instanceof Zone) {
            throw new Error('Zone expected to be from Type Zone.');
        }
    }
}

export default ZonesCollection;