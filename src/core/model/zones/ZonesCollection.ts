import {Collection} from '../collection/Collection';
import {ZonesOrderChange} from './types';
import {IZone} from './Zone.type';

class ZonesCollection extends Collection<IZone> {
    public static fromArray(array: IZone[]) {
        const zc = new ZonesCollection();
        zc.items = array;
        return zc;
    }

    public toArray() {
        return this.items;
    }

    public changeOrder(zone: IZone, order: ZonesOrderChange) {
        if (zone.priority === 0) {
            return;
        }

        let zoneToSwitch = null;
        switch (order) {
            case 'up':
                zoneToSwitch = this.findBy('priority', zone.priority + 1, true);
                if (zoneToSwitch.length === 1 && zoneToSwitch[0].priority !== 0) {
                    zoneToSwitch[0].priority = zoneToSwitch[0].priority - 1;
                    zone.priority = zone.priority + 1;
                }
                break;
            case 'down':
                zoneToSwitch = this.findBy('priority', zone.priority - 1, true);
                if (zoneToSwitch.length === 1 && zoneToSwitch[0].priority !== 0) {
                    zoneToSwitch[0].priority = zoneToSwitch[0].priority + 1;
                    zone.priority = zone.priority - 1;
                }
                break;
            default:
                return this;
        }
        return this;
    }
}

export default ZonesCollection;
