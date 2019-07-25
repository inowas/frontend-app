import LineBoundary from './LineBoundary';

export default class DrainageBoundary extends LineBoundary {

    constructor() {
        super('drn');
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
                unit: 'm^2/day',
                decimals: 1,
                default: 0
            }
        ];
    }
}
