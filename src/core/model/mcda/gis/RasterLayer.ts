import uuidv4 from 'uuid/v4';
import {rainbowFactory} from '../../../../scenes/shared/rasterData/helpers';
import {heatMapColors} from '../../../../scenes/t05/defaults/gis';
import {ILegendItemContinuous, ILegendItemDiscrete} from '../../../../services/rainbowvis/types';
import {BoundingBox, GridSize} from '../../geometry';
import {Array2D} from '../../geometry/Array2D.type';
import {RulesCollection} from '../criteria';
import {IRasterLayer} from './RasterLayer.type';

class RasterLayer {

    get id() {
        return this._props.id;
    }

    set id(value) {
        this._props.id = value;
    }

    get boundingBox(): BoundingBox {
        return BoundingBox.fromObject(this._props.boundingBox);
    }

    set boundingBox(value: BoundingBox) {
        this._props.boundingBox = value.toObject();
    }

    get data(): Array2D<number> {
        return this._props.data;
    }

    set data(value: Array2D<number>) {
        this._props.data = value;
    }

    get gridSize(): GridSize {
        return GridSize.fromObject(this._props.gridSize);
    }

    set gridSize(value: GridSize) {
        this._props.gridSize = value.toObject();
    }

    get min() {
        return this._props.min;
    }

    set min(value) {
        this._props.min = value;
    }

    get max() {
        return this._props.max;
    }

    set max(value) {
        this._props.max = value;
    }

    get url() {
        return this._props.url;
    }

    set url(value) {
        this._props.url = value;
    }

    get uniqueValues() {
        const distinct: number[] = [];

        this.data.forEach((row) => {
            row.forEach((value) => {
                if (!distinct.includes(value)) {
                    distinct.push(value);
                }
            });
        });

        return distinct;
    }

    public static fromObject(obj: IRasterLayer) {
        return new RasterLayer(obj);
    }

    public static fromDefaults() {
        return new RasterLayer({
            boundingBox: [[0, 0], [0, 0]],
            gridSize: {
                n_x: 10,
                n_y: 10
            },
            data: [],
            id: uuidv4(),
            isFetching: false,
            min: 0,
            max: 0,
            url: ''
        });
    }

    protected _props: IRasterLayer;

    constructor(obj: IRasterLayer) {
        this._props = obj;
    }

    public toObject() {
        return this._props;
    }

    public toPayload() {
        return {
            boundingBox: this.boundingBox,
            gridSize: this.gridSize,
            id: this.id,
            max: this.max,
            min: this.min,
            url: this.url
        };
    }

    public calculateMinMax(constraintRules: RulesCollection | null = null) {
        if (constraintRules) {
            this.data.forEach((row) => {
                return row.forEach((cell) => {
                    const rules = constraintRules.findByValue(cell);
                    if (rules.length === 0) {
                        if (cell > this.max) {
                            this.max = cell;
                        }
                        if (cell < this.min) {
                            this.min = cell;
                        }
                    }
                    return NaN;
                });
            });
        }

        return this;
    }

    public clean() {
        if (!this.data || !this.data[0]) {
            return this;
        }
        const dimCol = this.data[0].length;
        const dimRow = this.data.length;

        for (let row = 0; row <= dimRow - 1; row++) {
            for (let col = 0; col <= dimCol - 1; col++) {
                if (!this.data[row][col]) {
                    this.data[row][col] = NaN;
                }
            }
        }

        return this;
    }

    public generateRainbow(colors: string[], fixedInterval: number[] | null = null) {
        return rainbowFactory({
            min: fixedInterval ? fixedInterval[0] : this.min,
            max: fixedInterval ? fixedInterval[1] : this.max
        }, colors);
    }

    public generateLegend(rulesCollection: RulesCollection, type = 'discrete', mode = 'unclassified') {
        if (type === 'discrete') {
            const dLegend: ILegendItemDiscrete[] = [];
            if (mode === 'unclassified' || rulesCollection.length === 0) {
                this.uniqueValues.sort((a, b) => a - b).forEach((v, key) => {
                    dLegend.push({
                            color: key < heatMapColors.discrete.length ? heatMapColors.discrete[key] : '#000000',
                            isContinuous: false,
                            label: v.toFixed(2),
                            value: v
                        });
                    }
                );
                return dLegend;
            }
            rulesCollection.orderBy('from').all.forEach((rule) => {
                dLegend.push({
                    color: rule.color,
                    isContinuous: false,
                    label: rule.name,
                    value: rule.from
                });
            });
            return dLegend;
        }
        if (type === 'continuous') {
            if (mode === 'unclassified' || rulesCollection.length === 0) {
                return rainbowFactory({
                    min: this.min,
                    max: this.max
                }, heatMapColors.terrain);
            }
            const cLegend: ILegendItemContinuous[] = [];
            rulesCollection.orderBy('from').all.forEach((rule) => {
                cLegend.push({
                    color: rule.color,
                    label: rule.name,
                    fromOperator: rule.fromOperator,
                    from: rule.from,
                    isContinuous: true,
                    toOperator: rule.toOperator,
                    to: rule.to
                });
            });
            cLegend.push({
                color: '#fff',
                label: 'Not Classified',
                isContinuous: true,
                from: NaN,
                fromOperator: '>',
                to: NaN,
                toOperator: '<'
            });
            return cLegend;
        }
    }
}

export default RasterLayer;
