import LineBoundary from './LineBoundary';

export default class GeneralHeadBoundary extends LineBoundary {

    constructor() {
        super('ghb');
    }

    get valueProperties() {
        return [
            {
                name: 'Head',
                description:'Groundwater Head',
                unit: 'm',
                decimals: 2
            },
            {
                name: 'Conductance',
                description: 'Hydraulic conductance',
                unit: 'm/day',
                decimals: 2
            }
        ]
    }
}
