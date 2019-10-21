import {cloneDeep} from 'lodash';
import {Collection} from '../../collection/Collection';
import BoundingBox from '../../geometry/BoundingBox';
import {ICriterion} from './Criterion.type';

class CriteriaCollection extends Collection<ICriterion> {
    public static fromObject(obj: ICriterion[]) {
        return new CriteriaCollection(obj);
    }

    public isFinished(withAhp = false) {
        if (withAhp) {
            return this.length > 0 && this.all.filter((c) =>
                c.parent && (!c.suitability || c.suitability.url === '')
            ).length === 0;
        }

        return this.length > 0 && this.all.filter(
            (c) => !c.suitability || c.suitability.url === ''
        ).length === 0;
    }

    public getBoundingBox(withAhp = false) {
        let xMin = 180;
        let xMax = -180;
        let yMin = 90;
        let yMax = -90;
        this.all.filter((criterion) => !withAhp || (withAhp && criterion.parent)).forEach((criterion) => {
            const bb = BoundingBox.fromObject(criterion.raster.boundingBox);
            xMin = bb.xMin < xMin ? bb.xMin : xMin;
            xMax = bb.xMax > xMax ? bb.xMax : xMax;
            yMin = bb.yMin < yMin ? bb.yMin : yMin;
            yMax = bb.yMax > yMax ? bb.yMax : yMax;
        });
        return BoundingBox.fromObject([[xMin, yMin], [xMax, yMax]]);
    }

    public getSubCriteria(id: string) {
        return this.all.filter((item) => item.parent === id);
    }

    public toObject() {
        return cloneDeep(this.all);
    }
}

export default CriteriaCollection;
