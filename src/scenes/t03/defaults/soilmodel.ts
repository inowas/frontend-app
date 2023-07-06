import {ILayerParameter} from '../../../core/model/modflow/soilmodel/LayerParameter.type';
import {IRasterParameter} from '../../../core/model/modflow/soilmodel/RasterParameter.type';
import {ISoilmodelLayer} from '../../../core/model/modflow/soilmodel/SoilmodelLayer.type';
import uuidv4 from 'uuid/v4';

export interface IParameter {
    name: string;
    description: string;
    unit: string;
}

export const basParameters: IParameter[] = [
    {
        name: 'ibound',
        description: 'IBound',
        unit: '-'
    },
    {
        name: 'strt',
        description: 'Starting Head',
        unit: 'm a.s.l.'
    }
];

export const modpathParameters: IParameter[] = [
    {
        name: 'prsity',
        description: 'Porosity',
        unit: '-'
    },
    {
        name: 'retard',
        description: 'Retardation',
        unit: '-'
    },
    {
        name: 'stopzone',
        description: 'Zones',
        unit: '-'
    }
];

export const soilmodelParameters: IParameter[] = [
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
        unit: '1/m'
    },
    {
        name: 'sy',
        description: 'Specific yield',
        unit: '-'
    }
];

export const defaultSoilmodelLayerParameters: ILayerParameter[] = [
    // SOILMODEL:
    {id: 'top', data: {file: null}, value: 1},
    {id: 'botm', data: {file: null}, value: 0},
    {id: 'hk', data: {file: null}, value: 10},
    {id: 'hani', data: {file: null}, value: 1},
    {id: 'vka', data: {file: null}, value: 1},
    {id: 'ss', data: {file: null}, value: 0.00002},
    {id: 'sy', data: {file: null}, value: 0.15},
];

export const defaultSoilmodelParameters: IRasterParameter[] = [
    {
        defaultValue: 0,
        isActive: true,
        id: 'botm',
        title: 'Bottom elevation',
        unit: 'm a.s.l.'
    },
    {
        defaultValue: 1,
        isActive: true,
        id: 'hani',
        title: 'Horizontal hydraulic anisotropy',
        unit: '-'
    },
    {
        defaultValue: 10,
        isActive: true,
        id: 'hk',
        title: 'Horizontal conductivity along rows',
        unit: 'm/day'
    },
    {
        defaultValue: 1,
        isActive: true,
        id: 'vka',
        title: 'Vertical hydraulic conductivity',
        unit: 'm/day'
    },
    {
        defaultValue: 0.00002,
        isActive: true,
        id: 'ss',
        title: 'Specific storage',
        unit: '1/m'
    },
    {
        defaultValue: 0.15,
        isActive: true,
        id: 'sy',
        title: 'Specific yield',
        unit: '-'
    },
    {
        defaultValue: 1,
        isActive: true,
        id: 'top',
        title: 'Top elevation',
        unit: 'm a.s.l.'
    }
];

export const otherParameters: IRasterParameter[] = [
    // BAS:
    {
        defaultValue: 1,
        isActive: true,
        id: 'ibound',
        title: 'IBound',
        unit: '-'
    },
    {
        defaultValue: 1.0,
        isActive: true,
        id: 'strt',
        title: 'Starting Head',
        unit: '-'
    },
    // SEAWAT:
    {
        defaultValue: -1,
        isActive: true,
        id: 'visc',
        title: 'Viscosity',
        unit: '-'
    },
    // MODPATH:
    {
        defaultValue: 0.3,
        isActive: true,
        id: 'prsity',
        title: 'Porosity',
        unit: '-'
    },
    {
        defaultValue: 1,
        isActive: true,
        id: 'retard',
        title: 'Retardation factor',
        unit: '-'
    },
    {
        defaultValue: 0,
        isActive: true,
        id: 'stopzone',
        title: 'Stop zone',
        unit: '-'
    }
];

export const defaultSoilmodelLayer: ISoilmodelLayer = {
    id: uuidv4(),
    name: 'Default layer',
    description: '',
    number: 0,
    laytyp: 0,
    layavg: 0,
    laywet: 0,
    parameters: defaultSoilmodelLayerParameters,
    relations: []
};
