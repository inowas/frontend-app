import AbstractPosition from './AbstractPosition';

class Location extends AbstractPosition {
    _type = 'bbox';
    _ts = {
        min: 0,
        max: 0
    };
    _objects = [];

    static fromObject(obj) {
        const location = new Location();
        location.type = obj.type;
        location.ts = obj.ts;
        location.lay = obj.lay;
        location.row = obj.row;
        location.col = obj.col;
        location.objects = obj.objects;
        return location;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value ? value : 'bbox';
    }

    get ts() {
        return this._ts;
    }

    set ts(value) {
        this._ts = value ? value : {min: 0, max: 0, result: null};
    }

    get objects() {
        return this._objects;
    }

    set objects(value) {
        this._objects = value ? value : [];
    }

    toObject() {
        return ({
            'type': this.type,
            'ts': this.ts,
            'lay': this.lay,
            'row': this.row,
            'col': this.col,
            'objects': this.objects
        });
    }
}

export default Location;