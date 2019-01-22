import AbstractCollection from '../../AbstractCollection';
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
            if (tile.boundingBox.xMin < xMin) {
                xMin = tile.boundingBox.xMin;
            }
            if (tile.boundingBox.xMax > xMax) {
                xMax = tile.boundingBox.xMax;
            }
            if (tile.boundingBox.yMin < yMin) {
                yMin = tile.boundingBox.yMin;
            }
            if (tile.boundingBox.yMax > yMax) {
                yMax = tile.boundingBox.yMax;
            }
        });
        return BoundingBox.fromArray([[xMin, yMin], [xMax, yMax]]);
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