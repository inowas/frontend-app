import {BoundingBox, GridSize} from '../../geometry';
import {cloneDeep} from 'lodash';
import {distanceBetweenCoordinates} from '../../../../services/geoTools/distance';
import uuidv4 from 'uuid/v4';
import {max, min, rainbowFactory} from '../../../../scenes/shared/rasterData/helpers';
import {heatMapColors} from '../../../../scenes/t05/defaults/gis';
import {RulesCollection} from '../criteria';

class Raster {
    _boundingBox = new BoundingBox(0, 0, 0, 0);
    _gridSize = new GridSize(10, 10);
    _data = [];
    _id = uuidv4();
    _isFetching = false;
    _min = 0;
    _max = 0;
    _url = '';

    static fromObject(obj) {
        const raster = new Raster();
        raster.id = obj.id || uuidv4();
        raster.boundingBox = BoundingBox.fromArray(obj.boundingBox);
        raster.data = obj.data || [];
        raster.gridSize = GridSize.fromObject(obj.gridSize);
        raster.isFetching = !!obj.isFetching;
        raster.min = obj.min;
        raster.max = obj.max;
        raster.url = obj.url;
        return raster;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get boundingBox() {
        return this._boundingBox;
    }

    set boundingBox(value) {
        this._boundingBox = value;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

    get gridSize() {
        return this._gridSize;
    }

    set gridSize(value) {
        this._gridSize = value;
    }

    get isFetching() {
        return this._isFetching;
    }

    set isFetching(value) {
        this._isFetching = value;
    }

    get min() {
        return this._min;
    }

    set min(value) {
        this._min = value;
    }

    get max() {
        return this._max;
    }

    set max(value) {
        this._max = value;
    }

    get url() {
        return this._url;
    }

    set url(value) {
        this._url = value;
    }

    toObject() {
        return {
            boundingBox: this.boundingBox.toArray(),
            data: this.data,
            isFetching: this.isFetching,
            gridSize: this.gridSize.toObject(),
            id: this.id,
            max: this.max,
            min: this.min,
            url: this.url
        }
    }

    toPayload() {
        return {
            boundingBox: this.boundingBox.toArray(),
            gridSize: this.gridSize.toObject(),
            id: this.id,
            max: this.max,
            min: this.min,
            url: this.url
        }
    }

    get uniqueValues() {
        const distinct = [];

        this.data.forEach(row => {
            row.forEach(value => {
                if (!distinct.includes(value)) {
                    distinct.push(value);
                }
            })
        });

        return distinct;
    }

    calculateMinMax(constraintRules = null) {
        let data = this.data;
        if (constraintRules && constraintRules instanceof RulesCollection) {
            data = this.data.map(row => {
                return row.map(cell => {
                    const rules = constraintRules.findByValue(cell);
                    if (rules.length === 0) {
                        return cell;
                    }
                    return null;
                });
            });
        }

        this.max = max(data);
        this.min = min(data);
        return this;
    }

    generateRainbow(colors, fixedInterval = false) {
        return rainbowFactory({
            min: fixedInterval ? fixedInterval[0] : this.min,
            max: fixedInterval ? fixedInterval[1] : this.max
        }, colors);
    }

    generateLegend(rulesCollection, type = 'discrete', mode = 'unclassified') {
        const legend = [];
        let rainbow;
        if (type === 'discrete') {
            if (mode === 'unclassified' || rulesCollection.length === 0) {
                this.uniqueValues.sort((a, b) => a - b).forEach((v, key) => {
                        legend.push({
                            color: key < heatMapColors.discrete.length ? heatMapColors.discrete[key] : '#000000',
                            isContinuous: false,
                            label: v,
                            value: v
                        })
                    }
                );
                return legend;
            }
            rulesCollection.orderBy('from').all.forEach(rule => {
                legend.push({
                    color: rule.color,
                    isContinuous: false,
                    label: rule.name,
                    value: rule.from
                });
            });
            return legend;
        }
        if (type === 'continuous') {
            if (mode === 'unclassified' || rulesCollection.length === 0) {
                rainbow = rainbowFactory({
                    min: this.min,
                    max: this.max
                }, heatMapColors.terrain);
                return rainbow;
            }
            rulesCollection.orderBy('from').all.forEach(rule => {
                legend.push({
                    color: rule.color,
                    label: rule.name,
                    fromOperator: rule.fromOperator,
                    from: rule.from,
                    isContinuous: true,
                    toOperator: rule.toOperator,
                    to: rule.to
                });
            });
            legend.push({color: '#fff', label: 'Not Classified'});
            return legend;
        }
    }

    assignMinMax() {
        const offsetOld = min(this.data) < 0 ? Math.abs(min(this.data)) : 0;
        const offsetNew = this.min < 0 ? Math.abs(this.min) : 0;

        this.data = cloneDeep(this.data).map(row => {
            return row.map(value => {
                const factor = (value + offsetOld) / (max(this.data) + offsetOld);
                return (factor * (this.max + offsetNew)) - offsetNew;
            });
        });
    }

    sliceByBoundingBox(boundingBox) {
        if (!(boundingBox instanceof BoundingBox)) {
            throw new Error('Viewport expected to be of type BoundingBox.');
        }

        const dataBounds = this.boundingBox.getBoundsLatLng();
        const gridSize = this.gridSize.toObject();
        const viewport = boundingBox.getBoundsLatLng(); //this.leafletMap.current.leafletElement.getBounds();
        const data = cloneDeep(this.data);

        const southWest = {
            y1: dataBounds[0][0],
            x1: dataBounds[0][1],
            y2: viewport._southWest.lat,
            x2: viewport._southWest.lng
        };

        const northEast = {
            y1: dataBounds[1][0],
            x1: dataBounds[1][1],
            y2: viewport._northEast.lat,
            x2: viewport._northEast.lng,
        };

        const distanceX = distanceBetweenCoordinates(southWest.y1, southWest.x1, southWest.y1, northEast.x1);
        const cellSizeX = distanceX / gridSize.n_x;

        const distanceY = distanceBetweenCoordinates(southWest.y1, southWest.x1, northEast.y1, southWest.x1);
        const cellSizeY = distanceY / gridSize.n_y;

        let bounds = cloneDeep(dataBounds);
        let newGridSize = cloneDeep(gridSize);
        let cellsX1 = 0;
        let cellsX2 = gridSize.n_x;
        let cellsY1 = 0;
        let cellsY2 = gridSize.n_y;

        // BoundingBox is not in viewport:
        if (southWest.x2 > northEast.x1 || northEast.x2 < southWest.x1 || southWest.y2 > northEast.y1 || northEast.y2 < southWest.y1) {
            return;
        }

        // BoundingBox is completely in viewport:
        if (southWest.y2 < southWest.y1 && southWest.x2 < southWest.x1 && northEast.y2 > northEast.y1 && northEast.x2 > northEast.x1) {

        }

        // BoundingBox is partially in viewport:
        if (southWest.y2 > southWest.y1) {
            const distance = distanceBetweenCoordinates(southWest.y1, southWest.x1, southWest.y2, southWest.x1);
            cellsY2 = gridSize.n_y - Math.floor(distance / cellSizeY);
            bounds[0][0] = southWest.y2;
        }
        if (northEast.y2 < northEast.y1) {
            const distance = distanceBetweenCoordinates(northEast.y1, northEast.x1, northEast.y2, northEast.x1);
            cellsY1 = Math.floor(distance / cellSizeY);
            bounds[1][0] = northEast.y2;
        }
        if (southWest.x2 > southWest.x1) {
            const distance = distanceBetweenCoordinates(southWest.y1, southWest.x1, southWest.y1, southWest.x2);
            cellsX1 = Math.floor(distance / cellSizeX);
            bounds[0][1] = southWest.x2;
        }
        if (northEast.x2 < northEast.x1) {
            const distance = distanceBetweenCoordinates(northEast.y1, southWest.x1, northEast.y1, northEast.x2);
            cellsX2 = Math.floor(distance / cellSizeX);
            bounds[1][1] = northEast.x2;
        }

        const sliced = data.slice(cellsY1, cellsY2 + 1).map(i => i.slice(cellsX1, cellsX2 + 8));

        newGridSize.n_y = sliced.length;
        if (sliced.length === 0 || sliced[0].length === 0) {
            return;
        }
        newGridSize.n_x = sliced[0].length;

        this.data = sliced;
        this.boundingBox = boundingBox.fromArray(bounds);
        this.gridSize = GridSize.fromObject(newGridSize);
    }

}

export default Raster;