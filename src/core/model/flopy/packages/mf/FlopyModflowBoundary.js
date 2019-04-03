import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowBoundary extends FlopyModflowPackage {

    static calculateSpData = () => {
        throw new Error('Static method calculateSpData has to be implemented.')
    };

    static arrayToObject = (array) => {
        const obj = {};
        array.forEach((item, idx) => {
            obj[idx] = item;
        });
        return obj;
    }
}
