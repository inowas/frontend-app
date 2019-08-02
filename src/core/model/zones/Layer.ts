import {cloneDeep} from 'lodash';
import uuidv4 from 'uuid/v4';
import {Array2D} from '../geometry/Array2D.type';
import {IGridSize} from '../geometry/GridSize.type';
import {isTypeOf} from '../types';
import {ILayer} from './Layer.type';
import {IRasterParameter} from './RasterParameter.type';
import {IZone} from './Zone.type';
import ZonesCollection from './ZonesCollection';

class Layer {
    public static fromObject(obj: ILayer) {
        return new Layer(obj);
    }

    private readonly _props: ILayer;

    constructor(props: ILayer) {
        this._props = props;
    }

    public clone() {
        const layer = Layer.fromObject(this.toObject());
        layer._props.id = uuidv4();
        return layer;
    }

    public toObject() {
        return this._props;
    }

    get parameters() {
        return this._props.parameters;
    }

    get zones() {
        return ZonesCollection.fromArray(this._props._meta.zones);
    }

    public updateZone(zone: IZone) {
        const zones = ZonesCollection.fromArray(this._props._meta.zones);
        zones.update(zone);
        this._props._meta.zones = zones.toArray();
    }

    public updateGeometry(model: IModflowModel) {
        const defaultZone = this.zones.findFirstBy('priority', 0);
        if (defaultZone) {
            defaultZone.geometry = model.geometry;
            defaultZone.cells = model.cells;
            this.updateZone(defaultZone);
        }
        return this;
    }

    public smoothParameter(gridSize: IGridSize, parameter: IRasterParameter, cycles: number = 1, distance: number = 1) {
        if (isTypeOf<Array2D<number>>(parameter.value)) {
            const cValue = cloneDeep(parameter.value);

            for (let cyc = 1; cyc <= cycles; cyc++) {
                for (let row = 0; row < gridSize.n_x; row++) {
                    for (let col = 0; col < gridSize.n_x; col++) {
                        let avg = parameter.value[row][col];
                        let div = 1;

                        parameter.value.forEach((r: number[], rowKey: number) => {
                            if (rowKey >= row - distance && rowKey <= row + distance &&
                                isTypeOf<Array2D<number>>(parameter.value)) {
                                parameter.value[rowKey].forEach((c: number, colKey: number) => {
                                    if (colKey >= col - distance && colKey <= col + distance &&
                                        isTypeOf<Array2D<number>>(parameter.value) && parameter.value[rowKey][colKey]) {
                                        avg += parameter.value[rowKey][colKey];
                                        div++;
                                    }
                                });
                            }
                        });
                        cValue[row][col] = avg / div;
                    }
                }
            }
        }
    }

    public zonesToParameters(gridSize: IGridSize) {
        const zones = this.zones.orderBy('priority');
        const cParameters = cloneDeep(this.parameters);

        // loop through all the zones
        zones.toArray().forEach((zone) => {
            // loop through all the parameters ...
            zone.parameters.forEach((parameter: IRasterParameter) => {
                const lParameter: IRasterParameter = cloneDeep(parameter);

                if (parameter.isActive) {
                    if (zone.priority === 0) {
                        // default zone parameter value is a number:
                        if (!isTypeOf<Array2D<number>>(parameter.value)) {
                            lParameter.value = new Array(gridSize.n_y).fill(0).map(() => new Array(gridSize.n_x)
                                .fill(parameter.value)) as Array2D<number>;
                        } else {
                            lParameter.value = cloneDeep(parameter.value);
                        }
                    }

                    // ... zone is not default:
                    if (zone.priority > 0) {
                        // update the values for the parameter in the cells given by the zone
                        zone.cells.forEach((cell) => {
                            // console.log(`set ${parameter} at ${cell[1]} ${cell[0]} with value ${zone[parameter]}`);
                            if (isTypeOf<Array2D<number>>(lParameter.value) && lParameter.value[cell[1]][cell[0]]) {
                                lParameter.value[cell[1]][cell[0]] = parameter.defaultValue;
                            }
                        });
                    }
                }
            });
        });

        this._props.parameters = cParameters;
        return this;
    }
}

export default Layer;
