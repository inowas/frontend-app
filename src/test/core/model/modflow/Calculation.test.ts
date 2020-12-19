import {Calculation} from '../../../../core/model/modflow';

test('Calculation static fromCalculationIdAndState', () => {

    const calculationID = 'test123';
    const state = 200;

    const calculation = Calculation.fromCalculationIdAndState(calculationID, state);
    expect(calculation).toBeInstanceOf(Calculation);
    expect(calculation.id).toEqual(calculationID);
    expect(calculation.state).toEqual(state);
    expect(calculation.message).toEqual('');
    expect(calculation.times).toBeNull();
    expect(calculation.layer_values).toEqual([]);
    expect(calculation.files).toEqual([]);
});

test('Calculation static fromQuery', () => {

    const query = {
        calculation_id: '3b32605251083d26d027c95aecee9813',
        state: 200,
        message: 'MODFLOW-2005 \n ... \n  Normal termination of simulation',
        files: [
            'mf.ddn',
            'configuration.json',
            'mf.lpf',
            'mf.hds',
            'mf.list',
            'mf.oc',
            'mf.pcg',
            'mf.dis',
            'mf.nam',
            'mf.bas'
        ],
        times: {
            start_date_time: '2015-01-01',
            time_unit: 4,
            total_times: [
                153.0
            ]
        },
        layer_values: [
            [
                'head',
                'budget',
                'drawdown'
            ],
            [
                'head',
                'budget',
                'drawdown'
            ],
            [
                'head',
                'budget',
                'drawdown'
            ]
        ]
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const calculation = Calculation.fromQuery(query);
    expect(calculation).toBeInstanceOf(Calculation);
    expect(calculation.id).toEqual(query.calculation_id);
    expect(calculation.state).toEqual(query.state);
    expect(calculation.message).toEqual(query.message);
    expect(calculation.files).toEqual(query.files);
    expect(calculation.times).toEqual(query.times);
    expect(calculation.layer_values).toEqual(query.layer_values);
});

test('Calculation static fromObject, toObject', () => {

    const obj = {
        calculation_id: '3b32605251083d26d027c95aecee9813',
        state: 200,
        message: 'MODFLOW-2005 \n ... \n  Normal termination of simulation',
        files: [
            'mf.ddn',
            'configuration.json',
            'mf.lpf',
            'mf.hds',
            'mf.list',
            'mf.oc',
            'mf.pcg',
            'mf.dis',
            'mf.nam',
            'mf.bas'
        ],
        times: {
            start_date_time: '2015-01-01',
            time_unit: 4,
            total_times: [
                153.0
            ]
        },
        layer_values: [
            [
                'head',
                'budget',
                'drawdown'
            ],
            [
                'head',
                'budget',
                'drawdown'
            ],
            [
                'head',
                'budget',
                'drawdown'
            ]
        ]
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const calculation = Calculation.fromObject(obj);
    expect(calculation).toBeInstanceOf(Calculation);
    expect(calculation.id).toEqual(obj.calculation_id);
    expect(calculation.state).toEqual(obj.state);
    expect(calculation.message).toEqual(obj.message);
    expect(calculation.files).toEqual(obj.files);
    expect(calculation.times).toEqual(obj.times);
    expect(calculation.layer_values).toEqual(obj.layer_values);
    expect(obj).toEqual(calculation.toObject());
});
