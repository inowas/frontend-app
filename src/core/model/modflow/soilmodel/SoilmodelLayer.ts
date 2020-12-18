import {Array2D} from '../../geometry/Array2D.type';
import {GridSize} from '../../geometry';
import {ICell} from '../../geometry/Cells.type';
import {ILayerParameter} from './LayerParameter.type';
import {ILayerParameterZone} from './LayerParameterZone.type';
import {ISoilmodelLayer} from './SoilmodelLayer.type';
import {LayerParameterZonesCollection} from './index';
import {cloneDeep} from 'lodash';
import {defaultSoilmodelLayerParameters} from '../../../../scenes/t03/defaults/soilmodel';
import ZonesCollection from './ZonesCollection';
import uuidv4 from 'uuid/v4';

class SoilmodelLayer {

    public static fromDefault() {
        return new SoilmodelLayer({
            description: '',
            id: uuidv4(),
            layavg: 0,
            laytyp: 0,
            laywet: 0,
            name: 'Top Layer',
            number: 0,
            parameters: defaultSoilmodelLayerParameters,
            relations: []
        });
    }

    public static fromObject(obj: ISoilmodelLayer) {
        return new SoilmodelLayer(obj);
    }

    protected _props: ISoilmodelLayer;

    constructor(props: ISoilmodelLayer) {
        this._props = cloneDeep(props);
    }

    public getValueOfParameter(parameter: string) {
        const param = this.parameters.filter((p) => p.id === parameter);
        if (param.length > 0) {
            const v = param[0].value !== undefined ? param[0].value : param[0].data.data;
            return v || 0;
        }
        return undefined;
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

    get relations() {
        return LayerParameterZonesCollection.fromObject(this._props.relations);
    }

    set relations(value: LayerParameterZonesCollection) {
        this._props.relations = value.toObject();
    }

    public addRelation(relation: ILayerParameterZone) {
        this._props.relations.push(relation);
        return this;
    }

    public updateRelation(relation: ILayerParameterZone) {
        this._props.relations = this._props.relations.map((r) => {
            if (r.id === relation.id) {
                return relation;
            }
            return r;
        });
    }

    public getRelationsByParameter(paramId: string) {
        return LayerParameterZonesCollection.fromObject(this.relations.all.filter((r) => r.parameter === paramId));
    }

    public clone() {
        const layer = SoilmodelLayer.fromObject(this.toObject());
        layer._props.id = uuidv4();
        return layer;
    }

    public toObject(): ISoilmodelLayer {
        return cloneDeep(this._props);
    }

    public zonesToParameters(
        gridSize: GridSize,
        zones: ZonesCollection,
        parameters?: ILayerParameter | ILayerParameter[]
    ) {
        let fParameters = this.parameters;
        if (parameters && Array.isArray(parameters)) {
            fParameters = parameters;
        }
        if (parameters && !Array.isArray(parameters)) {
            fParameters = [parameters];
        }

        const cParameters = fParameters.map((parameter) => {
            const lParameter: ILayerParameter = {
                data: {
                    file: null
                },
                id: parameter.id,
                value: parameter.value
            };
            const fRelations = LayerParameterZonesCollection.fromObject(this.relations.all.filter(
                (r) => r.parameter === parameter.id)).orderBy('priority');

            // Only one relation (default) and value is a number:
            if (
                fRelations.length === 1 && !Array.isArray(fRelations.first.value) &&
                !Array.isArray(fRelations.first.data.data)
            ) {
                lParameter.value = fRelations.first.value;
                return lParameter;
            }

            // More than one relation (multiple zones):
            fRelations.all.forEach((relation) => {
                if (relation.priority === 0) {
                    if (!Array.isArray(relation.value) && !Array.isArray(relation.data.data)) {
                        lParameter.value = new Array(gridSize.nY).fill(0).map(() =>
                            new Array(gridSize.nX).fill(relation.value)) as Array2D<number>;
                    } else {
                        if (Array.isArray(relation.data.data) && !Array.isArray(relation.value)) {
                            lParameter.value = cloneDeep(relation.data.data);
                        }
                        if (Array.isArray(relation.value)) {
                            lParameter.value = cloneDeep(relation.value);
                        }
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

        if (parameters && fParameters.length === 1) {
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

    public smoothParameter(gridSize: GridSize, parameter: string, cycles = 1, distance = 1) {
        const lParameters = this.parameters.filter((p) => p.id === parameter);

        if (lParameters.length > 0) {
            let cValue: Array2D<number> = [];
            const lParameter: ILayerParameter = {
                data: {
                    file: null
                },
                id: lParameters[0].id
            };

            if (Array.isArray(lParameters[0].value)) {
                cValue = cloneDeep(lParameters[0].value);
                lParameter.value = cloneDeep(lParameters[0].value);
            }

            if (!Array.isArray(lParameters[0].value) && Array.isArray(lParameters[0].data.data)) {
                cValue = cloneDeep(lParameters[0].data.data);
                lParameter.value = cloneDeep(lParameters[0].data.data);
            }

            if (!Array.isArray(lParameter.value) || cValue.length === 0) {
                return;
            }

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
                    lParameter.value = cValue;
                    return lParameter;
                }
                return p;
            });
            this.parameters = cloneDeep(cParameters);
        }
        return this;
    }

    public calculateTransmissivity(top: number | Array2D<number>): number | Array2D<number> {
        const parameters = {
            hk: this.parameters.filter((p) => p.id === 'hk'),
            botm: this.parameters.filter((p) => p.id === 'botm')
        };

        if (parameters.hk.length > 0 && parameters.botm.length > 0) {
            const hk = parameters.hk[0].data.data || parameters.hk[0].value;
            const botm = parameters.botm[0].data.data || parameters.botm[0].value;

            let gridSize = null;

            if (Array.isArray(top)) {
                gridSize = GridSize.fromData(top);
            }

            if (Array.isArray(hk)) {
                gridSize = GridSize.fromData(hk);
            }

            if (Array.isArray(botm)) {
                gridSize = GridSize.fromData(botm);
            }

            // We have scalar values;
            if (gridSize === null) {
                if ((top instanceof Array) || (hk instanceof Array) || (botm instanceof Array)) {
                    return 0;
                }
                if (!botm || !hk) {
                    return 0;
                }

                return (top - botm) * hk;
            }

            const result: number[][] = [];
            for (let row = 0; row < gridSize.nY; row++) {
                result[row] = [];
                for (let col = 0; col < gridSize.nX; col++) {
                    const hkCell = Array.isArray(hk) ? hk[row][col] : hk;
                    const topCell = Array.isArray(top) ? top[row][col] : top;
                    const botmCell = Array.isArray(botm) ? botm[row][col] : botm;

                    if (botmCell === undefined || hkCell === undefined) {
                        continue;
                    }

                    result[row][col] = (topCell - botmCell) * hkCell;
                }
            }
            return result as Array2D<number>;
        }

        return 0;
    }
}

export default SoilmodelLayer;
