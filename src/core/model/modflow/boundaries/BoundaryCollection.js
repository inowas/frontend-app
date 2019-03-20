import {Boundary, BoundaryFactory} from './index';
import {sortBy} from 'lodash';
import AbstractCollection from '../../collection/AbstractCollection';

class BoundaryCollection extends AbstractCollection {

    static fromQuery(query) {
        if (!Array.isArray(query)) {
            throw new Error('Boundary-Query expected to be an Array.');
        }

        const bc = new BoundaryCollection();
        query.forEach(b => {
            const boundary = BoundaryFactory.fromObject(b);
            bc.addBoundary(boundary);
        });
        return bc;
    }

    static fromObject(query) {
        if (!Array.isArray(query)) {
            throw new Error('Boundary-Query expected to be an Array.');
        }

        const bc = new BoundaryCollection();
        query.forEach(b => bc.addBoundary(BoundaryFactory.fromObject(b)));
        return bc;
    }

    static fromImport(i, boundingBox, gridSize) {
        if (!Array.isArray(i)) {
            throw new Error('Boundary-Import expected to be an Array.');
        }

        const bc = new BoundaryCollection();
        i.forEach(b => bc.addBoundary(BoundaryFactory.fromImport(b, boundingBox, gridSize)));
        return bc;
    }

    addBoundary(boundary) {
        return this.add(boundary);
    }

    removeById(boundaryId) {
        return this.remove(boundaryId);
    }

    validateInput(boundary) {
        if (!boundary instanceof Boundary) {
            return null;
        }
        return boundary;
    }

    countByType(type) {
        return this.boundaries.filter(b => b.type === type).length;
    }

    get boundaries() {
        return sortBy(this._items, [(b) => b.name.toUpperCase()]);
    }

    toObject = () => {
        return this.boundaries.map(b => b.toObject())
    };
}

export default BoundaryCollection;
