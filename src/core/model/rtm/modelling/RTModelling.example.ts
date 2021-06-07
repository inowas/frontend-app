import {EMethodType, ETimeResolution, IRtModelling} from './RTModelling.type';

const rtm: IRtModelling = {
    id: 'cfc437d8-c3de-4d7b-91c3-dc5e967cb2bb',
    name: 'example_project',
    description: 'this is an example project',
    permissions: 'rwx',
    public: true,
    tool: 'T20',
    data: {
        model_id: '65a66f45-b6fd-4d38-a42e-484a2b7dc4e4',
        automatic_calculation: true,
        start_date_time: '2020-11-01',
        time_resolution: ETimeResolution.DAILY,
        simulated_times: [1, 2, 3, 4, 5],
        head: [
            {
                // WEL
                boundary_id: '6d0eeb77-3636-439b-a0cc-89fa885b4c77',
                data: [
                    {
                        method: EMethodType.CONSTANT,
                        values: [10.59483, 10.59483, 10.59483, 10.59483, 10.59483]
                    }
                ]
            },
            {
                // CHD
                boundary_id: 'e68896f9-e48f-453c-9344-ea68c1f951f4',
                data: {
                    'id_of_op1': [
                        // SHead
                        {
                            method: EMethodType.SENSOR,
                            monitoring_id: '8c95fd88-389f-40d6-bf4f-e387f553b378',
                            sensor_id: '5c4af919-6a94-43a2-a106-66f9d9d80814',
                            parameter_id: 'head',
                            values: [100.3, 100.2, 100.3, 100.2, 100.4]
                        },
                        // EHead
                        {
                            method: EMethodType.CONSTANT,
                            values: null
                        }
                    ],
                    'id_of_op2': [
                        // SHead
                        {
                            method: EMethodType.CONSTANT,
                            values: null
                        },
                        // EHead
                        {
                            method: EMethodType.FUNCTION,
                            function: 'x + t / 1000',
                            values: null
                        }
                    ]
                }
            }
        ]
    }
}