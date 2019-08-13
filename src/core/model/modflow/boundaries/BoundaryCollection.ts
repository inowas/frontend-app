import {sortBy} from 'lodash';
import {Collection} from '../../collection/Collection';
import BoundingBox from '../../geometry/BoundingBox';
import GridSize from '../../geometry/GridSize';
import {BoundaryType, IBoundary, IBoundaryImport} from './Boundary.type';
import {Boundary, BoundaryFactory} from './index';

class BoundaryCollection extends Collection<Boundary> {

    public static fromQuery(query: IBoundary[]) {
        const bc = new BoundaryCollection();
        query.forEach((b) => {
            bc.addBoundary(BoundaryFactory.fromObject(b));
        });
        return bc;
    }

    public static fromObject(query: IBoundary[]) {
        const bc = new BoundaryCollection();
        query.forEach((b) => {
            bc.addBoundary(BoundaryFactory.fromObject(b));
        });
        return bc;
    }

    public static fromImport(i: IBoundaryImport[], boundingBox: BoundingBox, gridSize: GridSize) {
        const bc = new BoundaryCollection();
        i.forEach((b) => bc.addBoundary(BoundaryFactory.fromImport(b, boundingBox, gridSize)));
        return bc;
    }

    public findById(value: string) {
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

    get boundaries() {
        return sortBy(this.all, [(b) => b.name && b.name.toUpperCase()]);
    }

    public toObject = () => {
        return this.boundaries.map((b) => b.toObject());
    };

    public toImport = () => {
        return this.all.map((b) => b.toImport());
    };

    public filter = (callable: (b: any) => boolean) => {
        this.items = this.all.filter(callable);
        return this;
    };
}

export default BoundaryCollection;
