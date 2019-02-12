import Criterion from './Criterion';
import AbstractCollection from '../../collection/AbstractCollection';
import BoundingBox from "../../geometry/BoundingBox";

class CriteriaCollection extends AbstractCollection {
    static fromArray(array) {
        const cc = new CriteriaCollection();
        cc.items = array.map(c => Criterion.fromObject(c));
        return cc;
    }

    validateInput(criterion) {
        if (!(criterion instanceof Criterion)) {
            throw new Error('Criterion expected to be instance of Criterion');
        }
        return criterion;
    }

    isFinished(withAhp = false) {
        if (withAhp) {
            return this.length > 0 && this.all.filter(c =>
                c.parent && (!c.suitability || c.suitability.data.length === 0)
            ).length === 0;
        }

        return this.length > 0 && this.all.filter(c => !c.suitability || c.suitability.data.length === 0).length === 0;
    }

    getBoundingBox() {
        let xMin = 180;
        let xMax = -180;
        let yMin = 90;
        let yMax = -90;
        this.all.forEach(criterion => {
            if (criterion.tilesCollection.length > 0) {
                const bb = criterion.tilesCollection.boundingBox;
                xMin = bb.xMin < xMin ? bb.xMin : xMin;
                xMax = bb.xMax > xMax ? bb.xMax : xMax;
                yMin = bb.yMin < yMin ? bb.yMin : yMin;
                yMax = bb.yMax > yMax ? bb.yMax : yMax;
            }
        });
        return BoundingBox.fromArray([[xMin, yMin], [xMax, yMax]]);
    }
}

export default CriteriaCollection;