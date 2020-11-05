import uuidv4 from 'uuid';
import {ISensorParameter} from '../../../core/model/rtm/monitoring/Sensor.type';

export const defaultsWithSession = (session: any) => {
    const dws = defaults;
    if (session && !session.token) {
        dws.permissions = 'r--';
    }
    return dws;
};

const defaults = {
    id: uuidv4(),
    name: 'New real time monitoring tool',
    description: '',
    permissions: 'rwx',
    public: true,
    tool: 'T10',
    data: {
        sensors: [],
        model: null
    }
};

export const parameterList: ISensorParameter[] = [
    {id: 'do', type: 'do', unit: '', dataSources: [], processings: [], description: 'Dissolved oxygen'},
    {id: 'ec', type: 'ec', unit: '', dataSources: [], processings: [], description: 'Electrical conductivity'},
    {id: 'h', type: 'h', unit: 'm', dataSources: [], processings: [], description: 'Water level'},
    {id: 'ph', type: 'ph', unit: '', dataSources: [], processings: [], description: 'pH'},
    {id: 'prH', type: 'prH', unit: 'm', dataSources: [], processings: [], description: 'Pressure head'},
    {id: 'rp', type: 'rp', unit: '', dataSources: [], processings: [], description: 'Redox potential'},
    {id: 't', type: 't', unit: '°C', dataSources: [], processings: [], description: 'Temperature'},
    {id: 'wc', type: 'wc', unit: '', dataSources: [], processings: [], description: 'Water content'},
    {id: 'other', type: 'other', unit: '', dataSources: [], processings: [], description: 'Other'}
];

export const dataSourceList = ['file', 'online', 'prometheus'];
export const processingList = ['value', 'time'];

export const colors = ['red', 'green', 'brown', 'blue'];
