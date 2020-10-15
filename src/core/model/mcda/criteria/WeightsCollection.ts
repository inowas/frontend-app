import {Collection} from '../../collection/Collection';
import {IWeight} from './Weight.type';

class WeightsCollection extends Collection<IWeight> {
    public static fromObject(obj: IWeight[]) {
        return new WeightsCollection(obj);
    }

    get allCriteriaIds() {
        return this.all.map((weight) => weight.criterion ? weight.criterion.id : null);
    }

    get allRelations() {
        let relations: Array<{
            id: string;
            from: string;
            to: string;
            value: number;
        }> = [];

        this.all.forEach((weight) => {
            if (weight.relations.length > 0) {
                relations = relations.concat(
                    weight.relations.map((relation) => {
                        return {
                            id: relation.id,
                            from: weight.criterion ? weight.criterion.id : '',
                            to: relation.to,
                            value: relation.value
                        };
                    })
                );
            }
        });

        return relations;
    }

    public findByCriteriaId(id: string) {
        const c = this.all.filter((w) => w.criterion && w.criterion.id === id);
        if (c.length > 0) {
            return c[0];
        }
        return null;
    }

    public toObject() {
        return this.all;
    }
}

export default WeightsCollection;
