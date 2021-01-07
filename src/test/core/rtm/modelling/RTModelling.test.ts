import {EMethodType, ETimeResolution} from '../../../../core/model/rtm/modelling/RTModelling.type';
import RTModelling from '../../../../core/model/rtm/modelling/RTModelling';

const rtm = {
    id: '01cc984e-8c43-4a24-be22-f6608ca3c20f',
    name: 'Helgoland RTM 2',
    description: '',
    permissions: 'rwx',
    public: true,
    created_at: '2020-12-08T10:31:51+00:00',
    tool: 'T20',
    data: {
        model_id: '8227c23a-de89-4d3b-a347-ef4d01a0e38d',
        automatic_calculation: true,
        simulated_times: [],
        start_date_time: 'Tue Dec 31 2019',
        time_resolution: ETimeResolution.DAILY,
        head: [{
            boundary_id: '08e899c6-93c9-4e09-9bb9-8173b8cc93bb', 'data': {
                '243e0522-5e29-4d97-932b-2e608b0d50d6': [
                    {
                        method: EMethodType.SENSOR,
                        values: [8.5125, 4.2129, 1.7062, 7.3217, 6.58, 3.2404, 8.0829, 5.0333, 9.2788, 11.5479, 13.4929,
                            8.6833, 7.3075, 8.6913, 9.8483, 13.9829, 10.3042, 7.9692, 8.3596, 7.2483, 4.2646, 5.49, 7.6054,
                            6.5612, 4.5137, 4.5642, 3.5525, 7.5729, 9.5379, 8.1475, 8.7696, 12.665, 13.8713, 10.4104,
                            10.4567, 8.4654, 7.7771, 7.9371, 8.835, 9.2192, 13.0554, 10.6217, 8.2267, 7.7117, 6.6733, 6.965,
                            9.3908, 14.3654, 13.6054, 10.2058, 9.2858, 8.0033, 9.1735, 11.945, 10.2108, 8.795, 11.4417,
                            6.2317, 7.4208, 7.6075, 10.2508, 10.6092, 10.3975, 8.095, 7.7767, 9.4325, 8.9417, 7.9633,
                            8.11, 10.7675, 8.9683, 13.8375, 13.4658, 9.5358, 7.7125, 10.0392, 13.6642, 12.5925, 14.8425,
                            14.935, 11.4283, 8.7842, 6.5608, 5.6883, 6.8383, 8.5583, 10.4625, 14.365, 12.5142, 6.4808,
                            3.6508, 6.0442, 8.48, 11.19, 12.1958, 13.2925, 13.8225, 17.9883, 17.4075, 16.7583, 17.195,
                            14.895, 14.1408, 18.4933, 13.0292, 11.8775, 14.4967, 16.9033, 17.0492, 16.7333, 15.0267,
                            15.185, 16.72, 17.54, 18.8492, 18.9542, 16.27, 17.4067, 19.2333, 21.5342, 17.9767, 17.4192,
                            18.0025, 15.5692, 15.5175, 13.1483, 12.1958, 16.3492, 15.41, 19.325, 21.0708, 21.7333,
                            11.4942, 11.2958, 15.0792, 13.9417, 14.59, 17.1017, 19.35, 20.9, 19.55, 20.3175, 20.0917],
                        monitoring_id: '83ee6f70-8239-4b65-ae09-91dc65f65fc7',
                        sensor_id: 'cad8dfc6-b642-4dd5-a09f-e40fbaf1faec',
                        parameter_id: '5ac99fc4-43d7-4182-8429-1adeec12bf8e'
                    },
                    {method: EMethodType.FUNCTION, values: null, function: 'x'}
                ]
            }
        }]
    }
};

test('Test toQuery', () => {
    const iRtm = RTModelling.fromObject(rtm);


    expect(iRtm.toQuery()).toEqual({
        id: '01cc984e-8c43-4a24-be22-f6608ca3c20f',
        name: 'Helgoland RTM 2',
        description: '',
        permissions: 'rwx',
        public: true,
        created_at: '2020-12-08T10:31:51+00:00',
        tool: 'T20',
        data: {
            model_id: '8227c23a-de89-4d3b-a347-ef4d01a0e38d',
            automatic_calculation: true,
            simulated_times: [],
            start_date_time: 'Tue Dec 31 2019',
            time_resolution: ETimeResolution.DAILY,
            head: [{
                boundary_id: '08e899c6-93c9-4e09-9bb9-8173b8cc93bb', 'data': {
                    '243e0522-5e29-4d97-932b-2e608b0d50d6': [
                        {
                            method: EMethodType.SENSOR,
                            monitoring_id: '83ee6f70-8239-4b65-ae09-91dc65f65fc7',
                            sensor_id: 'cad8dfc6-b642-4dd5-a09f-e40fbaf1faec',
                            parameter_id: '5ac99fc4-43d7-4182-8429-1adeec12bf8e',
                            values: null
                        },
                        {method: EMethodType.FUNCTION, values: null, function: 'x'}
                    ]
                }
            }]
        }
    });
});