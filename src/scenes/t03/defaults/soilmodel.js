export const layerParameters = [
    {
        name: 'top',
        description: 'Top elevation',
        unit: 'm a.s.l.'
    },
    {
        name: 'botm',
        description: 'Bottom elevation',
        unit: 'm a.s.l.'
    },
    {
        name: 'hk',
        description: 'Horizontal conductivity along rows',
        unit: 'm/day'
    },
    {
        name: 'hani',
        description: 'Horizontal hydraulic anisotropy',
        unit: '-'
    },
    {
        name: 'vka',
        description: 'Vertical hydraulic conductivity',
        unit: 'm/day'
    },
    {
        name: 'ss',
        description: 'Specific storage',
        unit: '-'
    },
    {
        name: 'sy',
        description: 'Specific yield',
        unit: '1/m'
    }
];

export const defaultParameters = {
    botm: {
        defaultValue: 0,
        isActive: true,
        label: 'botm',
        name: 'Bottom elevation',
        unit: 'm a.s.l.',
        value: 0
    },
    hani: {
        defaultValue: 1,
        isActive: true,
        label: 'hani',
        name: 'Horizontal hydraulic anisotropy',
        unit: '-',
        value: 1
    },
    hk: {
        defaultValue: 10,
        isActive: true,
        label: 'hk',
        name: 'Horizontal conductivity along rows',
        unit: 'm/day',
        value: 10
    },
    vka: {
        defaultValue: 1,
        isActive: true,
        label: 'vka',
        name: 'Vertical hydraulic conductivity',
        unit: 'm/day',
        value: 1
    },
    ss: {
        defaultValue: 0.00002,
        isActive: true,
        label: 'ss',
        name: 'Specific storage',
        unit: '-',
        value: 0.00002
    },
    sy: {
        defaultValue: 0.15,
        isActive: true,
        label: 'sy',
        name: 'Specific yield',
        unit: '1/m',
        value: 0.15
    },
    top: {
        defaultValue: 1,
        isActive: true,
        label: 'top',
        name: 'Top elevation',
        unit: 'm a.s.l.',
        value: 1
    }
};