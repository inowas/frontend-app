import {cloneDeep} from 'lodash';
import uuidv4 from 'uuid/v4';
import {GridSize} from '../geometry';
import {Array2D} from '../geometry/Array2D.type';
import {ICell} from '../geometry/Cells.type';
import {ILayer} from './Layer.type';
import {ILayerParameter} from './LayerParameter.type';
import LayerParameterZonesCollection from './LayerParameterZonesCollection';
import ZonesCollection from './ZonesCollection';

class Layer {
    public static fromObject(obj: ILayer) {
        return new Layer(obj);
    }

    protected _props: ILayer;

    constructor(props: ILayer) {
        this._props = cloneDeep(props);
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

    get name() {
        return this._props.name;
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

    public smoothParameter(gridSize: GridSize, parameter: string, cycles: number = 1, distance: number = 1) {
        const lParameters = this.parameters.filter((p) => p.id === parameter);

        if (lParameters.length > 0) {
            const lParameter = lParameters[0];
            if (Array.isArray(lParameter.value)) {
                const cValue: Array2D<number> = cloneDeep(lParameter.value);
                for (let cyc = 1; cyc <= cycles; cyc++) {
                    for (let row = 0; row < gridSize.nY; row++) {
                        for (let col = 0; col < gridSize.nX; col++) {
                            let avg = lParameter.value[row][col];
                            let div = 1;

                            lParameter.value.forEach((r: number[], rowKey: number) => {
                                if (rowKey >= row - distance && rowKey <= row + distance &&
                                    Array.isArray(lParameter.value)) {
                                    lParameter.value[rowKey].forEach((c: number, colKey: number) => {
                                        if (colKey >= col - distance && colKey <= col + distance &&
                                            Array.isArray(lParameter.value) &&
                                            !isNaN(lParameter.value[rowKey][colKey])) {
                                            avg += lParameter.value[rowKey][colKey];
                                            div++;
                                        }
                                    });
                                }
                            });
                            cValue[row][col] = avg / div;
                        }
                    }
                }
                const cParameters = this.parameters.map((p) => {
                    if (p.id === lParameter.id) {
                        p.value = cValue;
                    }
                    return p;
                });
                this.parameters = cloneDeep(cParameters);
            }
        }
        return this;
    }

    public zonesToParameters(
        gridSize: GridSize,
        relations: LayerParameterZonesCollection,
        zones: ZonesCollection,
        parameterId?: string
    ) {
        const fParameters = parameterId ? this.parameters.filter((p) => p.id === parameterId) : this.parameters;
        const cParameters = fParameters.map((parameter) => {
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
                            if (Array.isArray(lParameter.value) && !isNaN(lParameter.value[cell[1]][cell[0]])) {
                                lParameter.value[cell[1]][cell[0]] = relation.value as number;
                            }
                        });
                    }
                }
            });
            return lParameter;
        });

        if (parameterId && fParameters.length === 1) {
            const changedParameter = cParameters[0];
            this.parameters = cloneDeep(this.parameters).map((p) => {
                if (p.id === changedParameter.id) {
                    return changedParameter;
                }
                return p;
            });
            return this;
        }

        this.parameters = cloneDeep(cParameters);

        return this;
    }
}

export default Layer;
