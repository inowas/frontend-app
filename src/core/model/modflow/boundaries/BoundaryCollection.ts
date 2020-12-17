import {Boundary, BoundaryFactory} from './index';
import {BoundaryType, IBoundary, IBoundaryExport} from './Boundary.type';
import {Collection} from '../../collection/Collection';
import {cloneDeep, isEqual, sortBy} from 'lodash';
import BoundingBox from '../../geometry/BoundingBox';
import GridSize from '../../geometry/GridSize';
import Stressperiods from '../Stressperiods';
import md5 from 'md5';
import simpleDiff from '../../../../services/diffTools/simpleDiff';

export interface IBoundaryComparisonItem {
    id: string;
    state: string | null;
    // Todo use Record?
    // eslint-disable-next-line @typescript-eslint/ban-types
    diff: object | null;
    type: BoundaryType;
    name: string;
}

class BoundaryCollection extends Collection<Boundary> {

    get boundaries() {
        return sortBy(this.all, [(b) => b.name && b.name.toUpperCase()]);
    }

    public static fromQuery(query: IBoundary[]) {
        return BoundaryCollection.fromObject(query);
    }

    public static fromObject(obj: IBoundary[]) {
        const bc = new BoundaryCollection();
        obj.forEach((b) => {
            bc.addBoundary(BoundaryFactory.fromObject(b));
        });
        return bc;
    }

    public static fromExport(i: IBoundaryExport[], boundingBox: BoundingBox, gridSize: GridSize) {
        const bc = new BoundaryCollection();
        i.forEach((b) => bc.addBoundary(BoundaryFactory.fromExport(b, boundingBox, gridSize)));
        return bc;
    }

    public findById(value: string): Boundary | null {
        return this.findFirstBy('id', value, true);
    }

    public addBoundary(boundary: Boundary) {
        return this.add(boundary);
    }

    public countByType(type: BoundaryType) {
        return this.boundaries.filter((b) => b.type === type).length;
    }

    public removeById(id: string) {
        this.removeBy('id', id);
        return this;
    }

    public toObject = (): IBoundary[] => {
        return this.all.map((b) => b.toObject());
    };

    public toExport = (stressPeriods: Stressperiods) => {
        return this.all.map((b) => b.toExport(stressPeriods));
    };

    public filter = (callable: (b: any) => boolean) => {
        return BoundaryCollection.fromObject(this.all.filter(callable).map((b) => b.toObject()));
    };

    public compareWith = (stressperiods: Stressperiods, nbc: BoundaryCollection): IBoundaryComparisonItem[] => {
        const currentBoundaries = BoundaryCollection.fromObject(cloneDeep(this.toObject()));
        const newBoundaries = nbc;

        let items: IBoundaryComparisonItem[] = currentBoundaries.all.map((b) => (
            {id: b.id, state: null, type: b.type, diff: null, name: b.name})
        );

        // DELETE
        items = items.map((i) => {
            if (newBoundaries.filter((b) => b.id === i.id).length === 0) {
                return {...i, state: 'delete', diff: {}};
            }
            return i;
        });

        // ADD
        // UPDATE
        newBoundaries.all.forEach((b) => {
            if (items.filter((i) => i.id === b.id).length === 0) {
                items.push({id: b.id, state: 'add', type: b.type, diff: {}, name: b.name});
                return;
            }

            const currentBoundary = currentBoundaries.findById(b.id);
            const newBoundary = newBoundaries.findById(b.id);

            if (!newBoundary || !currentBoundary) {
                return;
            }

            const diff = simpleDiff(newBoundary.toExport(stressperiods), currentBoundary.toExport(stressperiods));
            const state = (isEqual(diff, {})) ? 'noUpdate' : 'update';

            items = items.map((i) => {
                if (i.id === b.id) {
                    return {...i, state, diff, name: b.name};
                }
                return i;
            });
        });

        return items;
    };

    public getChecksum = () => {
        return md5(JSON.stringify(this.boundaries));
    };
}

export default BoundaryCollection;
