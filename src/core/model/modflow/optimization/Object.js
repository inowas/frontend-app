import WellPosition from './WellPosition';
import uuidv4 from 'uuid/v4';
import moment from "moment/moment";
import {calculateActiveCells} from "services/geoTools";

class OptimizationObject {
    _id = uuidv4();
    _type = 'wel';
    _position = new WellPosition();
    _flux = {};
    _meta = {
        _name: 'New Optimization Object',
        _numberOfStressPeriods: 0,
        _substances: []
    };

    static createFromTypeAndStressPeriods(type, numberOfStressPeriods) {
        const object = new OptimizationObject();
        object.type = type;
        object.numberOfStressPeriods = numberOfStressPeriods;

        let flux = {};
        for (let i = 0; i < numberOfStressPeriods; i++) {
            flux[i.toString()] = {
                min: 0,
                max: 0,
                result: null
            }
        }
        object.flux = flux;

        return object;
    }

    static fromObject(obj) {
        const object = new OptimizationObject();
        object.id = obj.id;
        object.name = obj.name;
        object.type = obj.type;
        object.position = WellPosition.fromObject(obj.position);
        object.substances = obj.substances;
        object.numberOfStressPeriods = obj.numberOfStressPeriods;
        object.updateFlux(obj.flux);

        return object;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value ? value : uuidv4();
    }

    get name() {
        return this._meta._name;
    }

    set name(value) {
        this._meta._name = !value ? 'New Optimization Object' : value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        if (value !== 'wel') {
            throw new Error('Type must be one of type: wel');
        }
        this._type = value;
    }

    get position() {
        return this._position;
    }

    set position(value) {
        this._position = value ? value : new WellPosition();
    }

    get flux() {
        return this._flux;
    }

    set flux(value) {
        this._flux = value ? value : {};
    }

    updateFlux(rows) {
        let flux = {};
        for (let i = 0; i < this.numberOfStressPeriods; i++) {
            flux[i.toString()] = {
                min: rows[i] && rows[i].min ? parseFloat(rows[i].min) : 0,
                max: rows[i] && rows[i].max ? parseFloat(rows[i].max) : 0,
                result: rows[i] && rows[i].result ? parseFloat(rows[i].result) : null
            }
        }
        this.flux = flux;
        return this;
    }

    get concentration() {
        return this.calculateConcentration();
    }

    get numberOfStressPeriods() {
        return this._meta._numberOfStressPeriods;
    }

    set numberOfStressPeriods(value) {
        this._meta._numberOfStressPeriods = value ? value : 0;
    }

    get substances() {
        return this._meta._substances;
    }

    set substances(value) {
        this._meta._substances = value ? value : [];
    }

    updateSubstances(substances) {
        this.substances = substances;
        return this;
    }

    calculateConcentration() {
        const substances = this.substances;
        const concentration = {};

        if (substances.length === 0) {
            return {};
        }

        for (let i = 0; i < this.numberOfStressPeriods; i++) {
            const obj = {};
            substances.forEach(s => {
                obj[s.name] = {
                    min: s.data[i].min,
                    max: s.data[i].max,
                    result: s.data[i].result ? s.data[i].result : null
                };
            });
            concentration[i.toString()] = obj;
        }

        return concentration;
    }

    toBoundary(bbox, gridSize, stressPeriods) {
        let flux = [];

        if (this.flux && this.flux[0]) {
            for (let i = 0; i < this.numberOfStressPeriods; i++) {
                flux.push({
                    'date_time': moment.utc(stressPeriods.dateTimes[i]),
                    'values': [this.flux[i].result]
                });
            }
        }

        const bbXmin = bbox[0][0];
        const bbYmin = bbox[0][1];
        const bbXmax = bbox[1][0];
        const bbYmax = bbox[1][1];
        const dX = (bbXmax - bbXmin) / gridSize.n_x;
        const dY = (bbYmax - bbYmin) / gridSize.n_y;
        const cX = bbXmin + this.position.col.result * dX;
        const cY = bbYmax - this.position.row.result * dY;

        const args = {
            name: this.name,
            type: this.type,
            geometry: {
                'coordinates': [cX, cY],
                'type': 'Point'
            },
            utcIsoStartDateTime: stressPeriods.dateTimes[0]
        };
// Todo:
        /*const boundary = BoundaryFactory.createByTypeAndStartDate(args);
        boundary.wellType = 'opw';
        boundary.setDateTimeValues(flux);
        boundary.activeCells = calculateActiveCells(args.geometry, bbox, gridSize);
        boundary.affectedLayers = [this.position.lay.result];

        return boundary;*/
    }

    get toObject() {
        return ({
            'id': this.id,
            'name': this.name,
            'type': this.type,
            'position': this.position.toObject,
            'flux': this.flux,
            'concentration': this.concentration,
            'substances': this.substances,
            'numberOfStressPeriods': this.numberOfStressPeriods
        });
    }
}

export default OptimizationObject;