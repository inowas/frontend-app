import AbstractCollection from '../../AbstractCollection';
import GisArea from './GisArea';

class GisAreasCollection extends AbstractCollection {
    static fromArray(array) {
        const ac = new GisAreasCollection();
        ac.items = array.map(c => GisArea.fromObject(c));
        return ac;
    }

    validateInput (area) {
        if (!(area instanceof GisArea)) {
            throw new Error('Area expected to be instance of GisArea');
        }
        return area;
    }
}

export default GisAreasCollection;