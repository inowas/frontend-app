import uuidv4 from 'uuid/v4';
import {ILayerParameter} from '../../../core/model/gis/LayerParameter.type';
import {IRasterParameter} from '../../../core/model/gis/RasterParameter.type';
import {ISoilmodelLayer} from '../../../core/model/modflow/soilmodel/SoilmodelLayer.type';

export interface IParameter {
    name: string;
    description: string;
    unit: string;
}

export const modpathParameters: IParameter[] = [
    {
        name: 'porosity',
        description: 'Porosity',
        unit: '-'
    },
    {
        name: 'retardation',
        description: 'Retardation',
        unit: '-'
    },
    {
        name: 'zones',
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
        unit: '-'
    },
    {
        name: 'sy',
        description: 'Specific yield',
        unit: '1/m'
    }
];

export const defaultSoilmodelLayerParameters: ILayerParameter[] = [
    {id: 'top', value: 1},
    {id: 'botm', value: 0},
    {id: 'hk', value: 10},
    {id: 'hani', value: 1},
    {id: 'vka', value: 1},
    {id: 'ss', value: 0.00002},
    {id: 'sy', value: 0.15},
    // SEAWAT:
    {id: 'visc', value: -1},
    // MODPATH:
    {id: 'porosity', value: 0.3},
    {id: 'retardation', value: 1},
    {id: 'zones', value: 0}
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
        unit: '-'
    },
    {
        defaultValue: 0.15,
        isActive: true,
        id: 'sy',
        title: 'Specific yield',
        unit: '1/m'
    },
    {
        defaultValue: 1,
        isActive: true,
        id: 'top',
        title: 'Top elevation',
        unit: 'm a.s.l.'
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
        id: 'porosity',
        title: 'Porosity',
        unit: '-'
    },
    {
        defaultValue: 1,
        isActive: true,
        id: 'retardation',
        title: 'Retardation',
        unit: '-'
    },
    {
        defaultValue: 0,
        isActive: true,
        id: 'zones',
        title: 'Zones',
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
    parameters: defaultSoilmodelLayerParameters
};
