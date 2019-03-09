import FlopyModflowPackage from './FlopyModflowPackage';

export default class FlopyModflowBoundary extends FlopyModflowPackage {

    static arrayToObject = (array) => {
        const obj = {};
        array.forEach((item, idx) => {
            obj[idx] = item;
        });
        return obj;
    }
}
