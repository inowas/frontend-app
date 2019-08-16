import uuidv4 from 'uuid/v4';
import {IGridSize} from '../geometry/GridSize.type';
import {ILayer} from './Layer.type';
import {ILayerParameter} from './LayerParameter.type';
import {IRasterParameter} from './RasterParameter.type';
import { cloneDeep } from 'lodash';
import ZonesCollection from './ZonesCollection';
import LayerParameterZonesCollection from './LayerParameterZonesCollection';
import { Array2D } from '../geometry/Array2D.type';
import {ICell} from '../geometry/Cells.type';
import { GridSize } from '../geometry';

class Layer {
    public static fromObject(obj: ILayer) {
        return new Layer(obj);
    }

    protected _props: ILayer;

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

    get id() {
        return this._props.id;
    }

    set id(value: string) {
        this._props.id = value;
    }

    set name(value: string) {
        this._props.name = value;
    }

    get number() {
        return this._props.number;
    }

    set number(value) {
        this._props.number = value;
    }

    get parameters() {
        return this._props.parameters;
    }

    set parameters(value: ILayerParameter[]) {
        this._props.parameters = value;
    }

    public smoothParameter(gridSize: IGridSize, parameter: string, cycles: number = 1, distance: number = 1) {
        /*if (isTypeOf<Array2D<number>>(parameter)) {
            const cValue = cloneDeep(parameter);

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
        }*/
        return null;
    }

    public zonesToParameters(gridSize: GridSize, relations: LayerParameterZonesCollection, zones: ZonesCollection) {
        const cParameters = this.parameters.map((parameter) => {
            const lParameter: ILayerParameter = {
                id: parameter.id,
                value: parameter.value
            };
            const fRelations = LayerParameterZonesCollection.fromObject(relations.all.filter(
                (r) => r.layerId === this.id && r.parameter === parameter.id)).orderBy('priority');
            fRelations.all.forEach((relation) => {
                if (relation.priority === 0) {
                    if (!Array.isArray(relation.value)) {
                        lParameter.value = new Array(gridSize.nY).fill(0).map(() =>
                            new Array(gridSize.nX).fill(relation.value)) as Array2D<number>;
                    } else {
                        lParameter.value = cloneDeep(relation.value);
                    }
                } else {
                    const zone = zones.findById(relation.zoneId);
                    if (zone) {
                        zone.cells.forEach((cell: ICell) => {
                            if (Array.isArray(lParameter.value) && lParameter.value[cell[1]][cell[0]]) {
                                lParameter.value[cell[1]][cell[0]] = relation.value as number;
                            }
                        });
                    }
                }
            });
            return lParameter;
        });

        this.parameters = cloneDeep(cParameters);

        return this;
    }
}

export default Layer;
