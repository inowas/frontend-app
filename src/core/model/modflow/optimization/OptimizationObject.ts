import {Point} from 'geojson';
import moment, {Moment} from 'moment/moment';
import uuidv4 from 'uuid/v4';
import {calculateActiveCells} from '../../../../services/geoTools';
import BoundingBox from '../../geometry/BoundingBox';
import Geometry from '../../geometry/Geometry';
import GridSize from '../../geometry/GridSize';
import {BoundaryFactory} from '../boundaries';
import {IWellBoundary} from '../boundaries/WellBoundary.type';
import Stressperiods from '../Stressperiods';
import SubstanceCollection from '../transport/SubstanceCollection';
import OptimizationLocation from './OptimizationLocation';
import {EObjectType, IFluxObject, IMinMaxResult, IOptimizationObject} from './OptimizationObject.type';

class OptimizationObject {

    get id() {
        return this._props.id;
    }

    set id(value) {
        this._props.id = value ? value : uuidv4();
    }

    get name() {
        return this._props.meta.name;
    }

    set name(value) {
        this._props.meta.name = !value ? 'New Optimization Object' : value;
    }

    get type() {
        return this._props.type;
    }

    set type(value) {

        this._props.type = value;
    }

    get position() {
        return OptimizationLocation.fromObject(this._props.position);
    }

    set position(value) {
        this._props.position = value ? value.toObject() : OptimizationLocation.fromDefaults().toObject();
    }

    get flux() {
        return this._props.flux;
    }

    set flux(value) {
        this._props.flux = value ? value : {};
    }

    get concentration() {
        return this.calculateConcentration();
    }

    get numberOfStressPeriods() {
        return this._props.meta.numberOfStressPeriods;
    }

    set numberOfStressPeriods(value) {
        this._props.meta.numberOfStressPeriods = value ? value : 0;
    }

    get substances() {
        return SubstanceCollection.fromArray(this._props.meta.substances);
    }

    set substances(value: SubstanceCollection) {
        this._props.meta.substances = value ? value.toArray() : [];
    }

    public static createFromTypeAndStressPeriods(type: EObjectType, numberOfStressPeriods: number) {
        const flux: IFluxObject = {};

        for (let i = 0; i < numberOfStressPeriods; i++) {
            flux[i.toString()] = {
                min: 0,
                max: 0,
                result: null
            };
        }

        return new OptimizationObject({
            id: uuidv4(),
            type,
            position: OptimizationLocation.fromDefaults().toObject(),
            flux,
            meta: {
                name: 'New Optimization Object',
                numberOfStressPeriods,
                substances: []
            }
        });
    }

    public static fromObject(obj: IOptimizationObject) {
        return new this(obj);
    }
    private readonly _props: IOptimizationObject;

    constructor(props: IOptimizationObject) {
        this._props = props;
    }

    public updateFlux(rows: IMinMaxResult[]) {
        const flux: IFluxObject = {};
        for (let i = 0; i < this.numberOfStressPeriods; i++) {
            flux[i.toString()] = {
                min: rows[i] && rows[i].min ? rows[i].min : 0,
                max: rows[i] && rows[i].max ? rows[i].max : 0,
                result: rows[i] && rows[i].result ? rows[i].result : null
            };
        }
        this.flux = flux;
        return this;
    }

    public updateSubstances(substances: any[]) {
        this._props.meta.substances = substances;
        return this;
    }

    public calculateConcentration() {
        const substances = this._props.meta.substances;
        const concentration: {[index: string]: {[index: string]: IMinMaxResult}} = {};

        if (substances.length === 0) {
            return {};
        }

        for (let i = 0; i < this.numberOfStressPeriods; i++) {
            const obj: {[index: string]: IMinMaxResult} = {};
            substances.forEach((s) => {
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

    public toBoundary(bbox: BoundingBox, gridSize: GridSize, stressPeriods: Stressperiods) {
        const flux: Array<{date_time: Moment, values: number[]}> = [];

        if (this.flux && this.flux[0]) {
            for (let i = 0; i < this.numberOfStressPeriods; i++) {
                flux.push({
                    date_time: moment.utc(stressPeriods.dateTimes[i]),
                    values: [this.flux[i].result || NaN]
                });
            }
        }

        const bbXmin = bbox.xMin;
        const bbYmin = bbox.yMin;
        const bbXmax = bbox.xMax;
        const bbYmax = bbox.yMax;
        const dX = (bbXmax - bbXmin) / gridSize.nX;
        const dY = (bbYmax - bbYmin) / gridSize.nY;
        const cX = this._props.position.col.result ? bbXmin + this._props.position.col.result * dX : 0;
        const cY = this._props.position.row.result ? bbYmax - this._props.position.row.result * dY : 0;

        const geometry = Geometry.fromObject({
            coordinates: [cX, cY],
            type: 'Point'
        });

        const args: IWellBoundary = {
            id: uuidv4(),
            type: 'Feature',
            geometry: geometry.toObject() as Point,
            properties: {
                name: this.name,
                cells: calculateActiveCells(geometry, bbox, gridSize).toObject(),
                layers: this._props.position.lay.result ? [this._props.position.lay.result] : [],
                sp_values: flux.map((row) => row.values),
                type: 'wel',
                well_type: 'opw'
            }
        };

        return BoundaryFactory.fromObject(args);
    }

    public toObject() {
        return this._props;
    }
}

export default OptimizationObject;
