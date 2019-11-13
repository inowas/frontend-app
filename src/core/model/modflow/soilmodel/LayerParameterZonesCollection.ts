import {Collection} from '../../collection/Collection';
import {ILayerParameterZone} from './LayerParameterZone.type';
import {ZonesOrderChange} from './types';

class LayerParameterZonesCollection extends Collection<ILayerParameterZone> {
    public static fromObject(obj: ILayerParameterZone[]) {
        return new LayerParameterZonesCollection(obj);
    }

    public changeOrder(relation: ILayerParameterZone, order: ZonesOrderChange) {
        if (relation.priority === 0) {
            return null;
        }

        let zoneToSwitch = null;
        switch (order) {
            case 'up':
                zoneToSwitch = this.findBy('priority', relation.priority + 1, true);
                if (zoneToSwitch.length === 1 && zoneToSwitch[0].priority !== 0) {
                    zoneToSwitch[0].priority = zoneToSwitch[0].priority - 1;
                    relation.priority = relation.priority + 1;
                }
                break;
            case 'down':
                zoneToSwitch = this.findBy('priority', relation.priority - 1, true);
                if (zoneToSwitch.length === 1 && zoneToSwitch[0].priority !== 0) {
                    zoneToSwitch[0].priority = zoneToSwitch[0].priority + 1;
                    relation.priority = relation.priority - 1;
                }
                break;
            default:
                return this;
        }
        return this;
    }

    public reorderPriority(parameter: string) {
        let priority = 0;
        this.items = this.orderBy('priority').all.map((r) => {
            if (r.parameter === parameter) {
                r.priority = priority;
                priority++;
            }
            return r;
        });

        return this;
    }

    public toObject() {
        return this.all;
    }
}

export default LayerParameterZonesCollection;
