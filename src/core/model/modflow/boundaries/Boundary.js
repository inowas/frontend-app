/* eslint-disable camelcase */
import Uuid from 'uuid';
import AffectedCells from './AffectedCells';

export default class Boundary {
    _id;
    _name;
    _geometry;
    _affectedLayers = [0];
    _metadata = {};
    _activeCells = null;
    _defaultValues = [];

    constructor() {
        this._id = Uuid.v4();
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    get geometry() {
        return this._geometry;
    }

    set geometry(geometry) {
        this._geometry = geometry;
    }

    get affectedLayers() {
        return this._affectedLayers;
    }

    set affectedLayers(affectedLayers) {
        if(!Array.isArray(affectedLayers)) {
            this._affectedLayers = [affectedLayers];
            return;
        }

        this._affectedLayers = affectedLayers;
    }

    get metadata() {
        return this._metadata;
    }

    set metadata(metadata) {
        this._metadata = metadata;
    }

    get activeCells() {
        return this._activeCells;
    }

    set activeCells(activeCells) {
        this._activeCells = activeCells;
    }

    get type() {
        return this._type;
    }

    get subTypes() {
        return null;
    }

    get affectedCells() {
        return AffectedCells.fromLayersAndCells(this.affectedLayers, this.activeCells);
    }

    isValid() {
        if (!this._id) {
            throw new Error('The parameter id is not not valid.');
        }
        if (!this._name) {
            throw new Error('The parameter name is not not valid.');
        }
        if (!(this._geometry && this.geometry.type && this.geometry.coordinates && this.geometry.coordinates.length > 0)) {
            throw new Error('The parameter geometry is not not valid.');
        }

        if (!(Array.isArray(this._affectedLayers) && (this._affectedLayers.length > 0))) {
            throw new Error('The parameter affectedLayers is not not valid.');
        }

        // noinspection RedundantIfStatementJS
        if (typeof this._metadata !== 'object') {
            throw new Error('The parameter metadata is not not valid.');
        }

        return true;
    }

    get toObject() {
        return {
            id: this.id,
            name: this.name,
            geometry: this.geometry,
            type: this.type,
            affected_layers: this.affectedLayers,
            metadata: this.metadata,
            active_cells: this.activeCells
        };
    }

    get defaultValues() {
        return this._defaultValues;
    }

    get valueProperties() {
        return [];
    }

    get numberOfValues() {
        return this.defaultValues.length;
    }

    get clone() {
        this.name = this.name + ' (clone)';
        this.id = Uuid.v4();
        return this;
    }

    cloneInstance = () => {
        return Object.assign( Object.create( Object.getPrototypeOf(this)), this);
    }

}
