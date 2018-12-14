import {Boundary, BoundaryFactory} from './index';
import {sortBy} from 'lodash';

class BoundaryCollection {

    _boundaries = [];

    static fromQuery(query) {
        if (!Array.isArray(query)) {
            throw new Error('Boundary-Query expected to be an Array.');
        }

        const bc = new BoundaryCollection();
        query.forEach(b => bc.addBoundary(BoundaryFactory.fromObjectData(b)));
        return bc;
    }

    static fromObject(query) {
        if (!Array.isArray(query)) {
            throw new Error('Boundary-Query expected to be an Array.');
        }

        const bc = new BoundaryCollection();
        query.forEach(b => bc.addBoundary(BoundaryFactory.fromObjectData(b)));
        return bc;
    }

    addBoundary(boundary) {
        if (!boundary instanceof Boundary) {
            throw new Error('Boundary expected to be from Type Boundary.');
        }

        this._boundaries.push(boundary);
        return this;
    }

    removeById(boundaryId) {
        this._boundaries = this._boundaries.filter(b => b.id !== boundaryId);
        return this;
    }

    findById(id) {
        const boundary = this.boundaries.filter(b => b.id === id)[0];
        if (!boundary instanceof Boundary) {
            return null;
        }

        return boundary;
    }

    get boundaries() {
        return sortBy(this._boundaries, [(b) => b.name.toUpperCase()]);
    }

    toObject = () => {
        return this.boundaries.map(b => b.toObject)
    };

    get length() {
        return this._boundaries.length;
    };

    get first() {
        return this._boundaries[0];
    }
}

export default BoundaryCollection;
