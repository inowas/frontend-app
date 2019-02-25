import LineBoundary from './LineBoundary';

export default class ConstantHeadBoundary extends LineBoundary {

    constructor() {
        super('chd');
    }

    get valueProperties() {
        return [
            {
                name: 'SHead',
                description:'Head at the start of the stress period',
                unit: 'm',
                decimals: 1
            },
            {
                name: 'Ehead',
                description: 'Head at the end of the stress period',
                unit: 'm',
                decimals: 1
            }
        ]
    }
}
