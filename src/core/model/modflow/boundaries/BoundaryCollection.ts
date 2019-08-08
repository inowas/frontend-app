import {sortBy} from 'lodash';
import {Collection} from '../../collection/Collection';
import BoundingBox from '../../geometry/BoundingBox';
import GridSize from '../../geometry/GridSize';
import {Boundary, BoundaryFactory} from './index';
import {BoundaryType, IBoundary, IBoundaryImport} from './types';

class BoundaryCollection extends Collection<Boundary> {

    public static fromQuery(query: IBoundary[]) {
        const bc = new BoundaryCollection();
        query.forEach((b) => {
            const boundary = BoundaryFactory.fromObject(b);
            if (boundary) {
                bc.addBoundary(boundary);
            }
        });
        return bc;
    }

    public static fromObject(query: IBoundary[]) {
        const bc = new BoundaryCollection();
        query.forEach((b) => {
            const boundary = BoundaryFactory.fromObject(b);
            if (boundary) {
                bc.addBoundary(boundary);
            }
        });
        return bc;
    }

    public static fromImport(i: IBoundaryImport[], boundingBox: BoundingBox, gridSize: GridSize) {
        const bc = new BoundaryCollection();
        i.forEach((b) => bc.addBoundary(BoundaryFactory.fromImport(b, boundingBox, gridSize)));
        return bc;
    }

    public addBoundary(boundary: Boundary) {
        return this.add(boundary);
    }

    public countByType(type: BoundaryType) {
        return this.boundaries.filter((b) => b.type === type).length;
    }

    get boundaries() {
        return sortBy(this.all, [(b) => b.name && b.name.toUpperCase()]);
    }

    public toObject = () => {
        return this.boundaries.map((b) => b.toObject());
    };

    public toImport = (): IBoundaryImport[] => {
        return [];
    };
}

export default BoundaryCollection;
