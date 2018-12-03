import {Boundary, BoundaryFactory} from './index';

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

    addBoundary(boundary){
        if (!boundary instanceof Boundary) {
            throw new Error('Boundary expected to be from Type Boundary.');
        }

        this._boundaries.push(boundary);
    }

    findById(id){
        const boundary = this.boundaries.filter(b => b.id === id)[0];
        if (!boundary instanceof Boundary) {
            return null;
        }

        return boundary;
    }

    get boundaries() {
        return this._boundaries;
    }

    toObject = () => {
        return this.boundaries.map(b => b.toObject)
    }
}

export default BoundaryCollection;
