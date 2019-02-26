import Uuid from 'uuid';

export default class Boundary {

    _id = Uuid.v4();

    // noinspection JSMethodCanBeStatic
    get type() {
        throw new Error('You have to implement the getter for type!');
    }

    // noinspection JSMethodCanBeStatic
    get id() {
        throw new Error('You have to implement the getter for id!');
    }

    // noinspection JSMethodCanBeStatic
    get geometry() {
        throw new Error('You have to implement the getter for geometry!');
    }

    // noinspection JSMethodCanBeStatic
    get name() {
        throw new Error('You have to implement the getter for name!');
    }

    // noinspection JSMethodCanBeStatic
    get cells() {
        throw new Error('You have to implement the getter for cells!');
    }

    // noinspection JSMethodCanBeStatic
    get layers() {
        throw new Error('You have to implement the getter for layers!');
    }

    // noinspection JSMethodCanBeStatic
    get geometryType() {
        throw new Error('You have to implement the getter for geometryType!');
    }

    // noinspection JSMethodCanBeStatic
    get valueProperties() {
        throw new Error('You have to implement the getter for valueProperties!');
    }

    // noinspection JSMethodCanBeStatic
    get subType() {
        return null
    }

    // noinspection JSMethodCanBeStatic
    get subTypes() {
        return null
    }

    // noinspection JSMethodCanBeStatic
    toObject() {
        throw new Error('You have to implement the method toObject!');
    }

    clone() {
        this._id = Uuid.v4();
        return this;
    }
}
