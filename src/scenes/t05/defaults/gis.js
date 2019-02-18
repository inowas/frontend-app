const heatMapColors = {
    default: [
        '#d7191c',
        '#fdae61',
        '#ffffbf',
        '#a6d96a',
        '#1a9641'
    ],
    discrete: [
        '#393b89',
        '#5254a3',
        '#6b6ecf',
        '#9c9ede',
        '#637939',
        '#8ca252',
        '#b5cf6b',
        '#cedb9c',
        '#8c6d31',
        '#bd9e39',
        '#e7ba52',
        '#e7cb94',
        '#843c39',
        '#ad494a',
        '#d6616b',
        '#e7969c',
        '#7b4173',
        '#a55194',
        '#ce6dbd',
        '#de9ed6',
        '#222222',
        '#444444',
        '#666666',
        '#888888',
        '#aaaaaa',
        '#cccccc'
    ],
    colorBlind: [
        '#a6611a',
        '#dfc27d',
        '#f5f5f5',
        '#80cdc1',
        '#018571'
    ],
    terrain: [
        '#31a354',
        '#addd8e',
        '#d8b365'
    ]
};

const suitabilityRules = [
    {type: 'fixed', color: '#a6611a', name: 'Unsuitable', from: 0, to: 0, fromOperator: '>=', toOperator: '<=', value: 0},
    {type: 'fixed', color: '#dfc27d', name: 'Very low suitable', from: 0, to: 0.2, fromOperator: '>', toOperator: '<=', value: 1},
    {type: 'fixed', color: '#f5f5f5', name: 'Low suitable', from: 0.2, to: 0.4, fromOperator: '>', toOperator: '<=', value: 2},
    {type: 'fixed', color: '#b1cdc2', name: 'Moderately suitable', from: 0.4, to: 0.6, fromOperator: '>', toOperator: '<=', value: 3},
    {type: 'fixed', color: '#80cdc1', name: 'Suitable', from: 0.6, to: 0.8, fromOperator: '>', toOperator: '<=', value: 4},
    {type: 'fixed', color: '#018571', name: 'Very suitable', from: 0.8, to: 1, fromOperator: '>', toOperator: '<=', value: 5},
];

export {
    heatMapColors,
    suitabilityRules
};