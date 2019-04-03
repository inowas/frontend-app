import {calculatePwcWeights} from 'core/model/mcda/calculations';

const isInRange = (valueToTest, valueToCompare, tolerance = 0.1) => {
    return valueToTest >= (valueToCompare - tolerance * valueToCompare)
        && valueToTest <= (valueToCompare + tolerance * valueToCompare);
};

const criteria = [
    'aafebb75-d0f1-4f88-9fab-9dc0493deb4b',
    'f415b8d3-00f8-4ef9-b37d-84b5c8ef0718',
    '17a192d6-7e94-4599-8abc-555d32ad18b2',
    'd61bbc90-afe7-4f14-88af-49c441bd14ff'
];

const relations = [
    {
        'id': '79ed47e3-0bc5-41e5-82d0-964b7292071a',
        'from': 'aafebb75-d0f1-4f88-9fab-9dc0493deb4b',
        'to': 'f415b8d3-00f8-4ef9-b37d-84b5c8ef0718',
        'value': 4
    },
    {
        'id': '2a8bfb9b-8c42-473c-ac3b-c9ac6edbf1b4',
        'from': 'aafebb75-d0f1-4f88-9fab-9dc0493deb4b',
        'to': '17a192d6-7e94-4599-8abc-555d32ad18b2',
        'value': 7
    }, {
        'id': '33eb8d4a-deda-42bd-a46a-da4da7adfd49',
        'from': 'aafebb75-d0f1-4f88-9fab-9dc0493deb4b',
        'to': 'd61bbc90-afe7-4f14-88af-49c441bd14ff',
        'value': 9
    }, {
        'id': 'c4dc7bcb-3d31-4eb2-bfb1-b1703e497548',
        'from': 'f415b8d3-00f8-4ef9-b37d-84b5c8ef0718',
        'to': '17a192d6-7e94-4599-8abc-555d32ad18b2',
        'value': 2
    }, {
        'id': '46d8c7e2-ff51-48fe-b13a-a7264d6d35d9',
        'from': 'f415b8d3-00f8-4ef9-b37d-84b5c8ef0718',
        'to': 'd61bbc90-afe7-4f14-88af-49c441bd14ff',
        'value': 6
    }, {
        'id': '4639fc71-cfa9-4680-9e70-ad0dcc914c53',
        'from': '17a192d6-7e94-4599-8abc-555d32ad18b2',
        'to': 'd61bbc90-afe7-4f14-88af-49c441bd14ff',
        'value': 2
    }
];

const data = calculatePwcWeights(criteria, relations);

test('Calculate cSum', () => {
    expect(isInRange(data['aafebb75-d0f1-4f88-9fab-9dc0493deb4b'].cSum, 1.504)).toBeTruthy();
    expect(isInRange(data['f415b8d3-00f8-4ef9-b37d-84b5c8ef0718'].cSum, 5.667)).toBeTruthy();
    expect(isInRange(data['17a192d6-7e94-4599-8abc-555d32ad18b2'].cSum, 10.500)).toBeTruthy();
    expect(isInRange(data['d61bbc90-afe7-4f14-88af-49c441bd14ff'].cSum, 18.000)).toBeTruthy();
});

test('Calculate rSum and weights', () => {
    expect(isInRange(data['aafebb75-d0f1-4f88-9fab-9dc0493deb4b'].rSum, 2.537)).toBeTruthy();
    expect(isInRange(data['f415b8d3-00f8-4ef9-b37d-84b5c8ef0718'].rSum, 0.867)).toBeTruthy();
    expect(isInRange(data['17a192d6-7e94-4599-8abc-555d32ad18b2'].rSum, 0.390)).toBeTruthy();
    expect(isInRange(data['d61bbc90-afe7-4f14-88af-49c441bd14ff'].rSum, 0.206)).toBeTruthy();
    expect(isInRange(data['aafebb75-d0f1-4f88-9fab-9dc0493deb4b'].w, 0.63)).toBeTruthy();
    expect(isInRange(data['f415b8d3-00f8-4ef9-b37d-84b5c8ef0718'].w, 0.22)).toBeTruthy();
    expect(isInRange(data['17a192d6-7e94-4599-8abc-555d32ad18b2'].w, 0.10)).toBeTruthy();
    expect(isInRange(data['d61bbc90-afe7-4f14-88af-49c441bd14ff'].w, 0.05)).toBeTruthy();
});

test('Calculate weighted sum vector', () => {
    expect(isInRange(data['aafebb75-d0f1-4f88-9fab-9dc0493deb4b'].ws, 2.647)).toBeTruthy();
    expect(isInRange(data['f415b8d3-00f8-4ef9-b37d-84b5c8ef0718'].ws, 0.880)).toBeTruthy();
    expect(isInRange(data['17a192d6-7e94-4599-8abc-555d32ad18b2'].ws, 0.400)).toBeTruthy();
    expect(isInRange(data['d61bbc90-afe7-4f14-88af-49c441bd14ff'].ws, 0.207)).toBeTruthy();
});

test('Calculate all the remaining parameters', () => {
    expect(isInRange(data.lambda, 4.086)).toBeTruthy();
    expect(isInRange(data.ci, 0.029)).toBeTruthy();
    expect(isInRange(data.cr, 0.032)).toBeTruthy();
});