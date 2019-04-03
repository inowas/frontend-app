import LineBoundary from './LineBoundary';

export default class RiverBoundary extends LineBoundary {

    constructor() {
        super('riv');
    }

    get valueProperties() {
        return [
            {
                name: 'Stage',
                description: 'River stage in m above sea level',
                unit: 'm',
                decimals: 1,
                default: 0
            },
            {
                name: 'Conductance',
                description: 'Riverbed conductance',
                unit: 'm/day',
                decimals: 1,
                default: 0
            },
            {
                name: 'Bottom',
                description: 'River bottom in m above sea level',
                unit: 'm',
                decimals: 1,
                default: 0
            }
        ]
    }
}
