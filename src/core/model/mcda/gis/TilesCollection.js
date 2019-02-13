import AbstractCollection from '../../collection/AbstractCollection';
import Tile from './Tile';
import BoundingBox from '../../geometry/BoundingBox';

class TilesCollection extends AbstractCollection {
    static fromArray(array) {
        const tc = new TilesCollection();
        tc.items = array.map(t => Tile.fromObject(t));
        return tc;
    }

    get boundingBox() {
        let xMin = 180;
        let xMax = -180;
        let yMin = 90;
        let yMax = -90;
        this.all.forEach(tile => {
            xMin = tile.boundingBox.xMin < xMin ? tile.boundingBox.xMin : xMin;
            xMax = tile.boundingBox.xMax > xMax ? tile.boundingBox.xMax : xMax;
            yMin = tile.boundingBox.yMin < yMin ? tile.boundingBox.yMin : yMin;
            yMax = tile.boundingBox.yMax > yMax ? tile.boundingBox.yMax : yMax;
        });
        return BoundingBox.fromArray([[xMin, yMin], [xMax, yMax]]);
    }

    get uniqueValues() {
        const distinct = [];

        this.all.forEach(tile => {
            tile.data.forEach(row => {
                row.forEach(value => {
                    if (!distinct.includes(value)) {
                        distinct.push(value);
                    }
                })
            });
        });

        return distinct;
    }

    findByBoundingBox(boundingBox) {
        if (!(boundingBox instanceof BoundingBox)) {
            throw new Error('BoundingBox expected to be instance of BoundingBox');
        }

        return this.all.filter(tile => tile.boundingBox.intersects(boundingBox));
    }

    validateInput(tile) {
        if (!(tile instanceof Tile)) {
            throw new Error('Tile expected to be instance of Tile');
        }
        return tile;
    }
}

export default TilesCollection;