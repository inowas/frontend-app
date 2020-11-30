import {IRootReducer} from '../../../reducers';
import {ISimpleTool} from '../../../core/model/types';
import uuidv4 from 'uuid';

export const defaultsWithSession = (session: IRootReducer['session']): IT02 => {
    if (session && !session.token) {
        return {...defaults, permissions: 'r--'};
    }
    return defaults;
};

export type IT02 = ISimpleTool<IT02Data>

export interface IT02Data {
    settings: {
        variable: string
    },
    parameters: Array<{
        order: number,
        id: string,
        name: string,
        min: number,
        validMin?: (x: number) => boolean,
        max: number,
        validMax?: (x: number) => boolean,
        value: number,
        stepSize: number,
        type: string,
        decimals: number
    }>
}

const defaults: IT02 = {
    id: uuidv4(),
    name: 'New simple tool',
    description: 'Simple tool description',
    permissions: 'rwx',
    public: false,
    tool: 'T02',
    data: {
        settings: {
            variable: 'x'
        },
        parameters: [{
            order: 0,
            id: 'w',
            name: 'Percolation rate<br/>w (m/d)',
            min: 0,
            validMin: (x: number) => x >= 0,
            max: 10,
            value: 0.045,
            stepSize: 0.001,
            type: 'float',
            decimals: 3
        }, {
            order: 1,
            id: 'L',
            name: 'Basin length<br/>L (m)',
            min: 0,
            validMin: (x: number) => x > 0,
            max: 1000,
            value: 40,
            stepSize: 1,
            type: 'float',
            decimals: 0
        }, {
            order: 2,
            id: 'W',
            name: 'Basin width<br/>W (m)',
            min: 0,
            validMin: (x: number) => x > 0,
            max: 100,
            value: 20,
            stepSize: 1,
            type: 'float',
            decimals: 0
        }, {
            order: 3,
            id: 'hi',
            name: 'Initial groundwater Level<br/>h<sub>i</sub> (m)',
            min: 0,
            validMin: (x: number) => x >= 0,
            max: 100,
            value: 35,
            stepSize: 1,
            type: 'float',
            decimals: 0
        }, {
            order: 4,
            id: 'Sy',
            name: 'Specific yield<br/>S<sub>y</sub> (-)',
            min: 0.000,
            validMin: (x: number) => x > 0,
            max: 0.5,
            validMax: (x: number) => x <= 0.5,
            value: 0.085,
            stepSize: 0.001,
            type: 'float',
            decimals: 3
        }, {
            order: 5,
            id: 'K',
            name: 'Hydraulic conductivity<br/>K (m/d)',
            min: 0.1,
            validMin: (x: number) => x > 0,
            max: 10,
            validMax: (x: number) => x <= 100000,
            value: 1.83,
            stepSize: 0.01,
            type: 'float',
            decimals: 2
        }, {
            order: 6,
            id: 't',
            name: 'Infiltration time<br/>t (d)',
            min: 0,
            validMin: (x: number) => x > 0,
            max: 100,
            value: 1.5,
            stepSize: 0.1,
            type: 'float',
            decimals: 1
        }]
    }
};
