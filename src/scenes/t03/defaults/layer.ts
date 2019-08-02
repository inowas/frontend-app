import {IRasterParameter} from '../../../core/model/zones/RasterParameter.type';

export const defaultParameters: IRasterParameter[] = [
    {
        defaultValue: 0,
        isActive: true,
        name: 'botm',
        title: 'Bottom elevation',
        unit: 'm a.s.l.',
        value: 0
    },
    {
        defaultValue: 1,
        isActive: true,
        name: 'hani',
        title: 'Horizontal hydraulic anisotropy',
        unit: '-',
        value: 1
    },
    {
        defaultValue: 10,
        isActive: true,
        name: 'hk',
        title: 'Horizontal conductivity along rows',
        unit: 'm/day',
        value: 10
    },
    {
        defaultValue: 1,
        isActive: true,
        name: 'vka',
        title: 'Vertical hydraulic conductivity',
        unit: 'm/day',
        value: 1
    },
    {
        defaultValue: 0.00002,
        isActive: true,
        name: 'ss',
        title: 'Specific storage',
        unit: '-',
        value: 0.00002
    },
    {
        defaultValue: 0.15,
        isActive: true,
        name: 'sy',
        title: 'Specific yield',
        unit: '1/m',
        value: 0.15
    },
    {
        defaultValue: 1,
        isActive: true,
        name: 'top',
        title: 'Top elevation',
        unit: 'm a.s.l.',
        value: 1
    }
];
