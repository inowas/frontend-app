import {Icon} from 'semantic-ui-react';
import React from 'react';

export interface IMenuItem {
    name: string;
    property: string;
    icon: React.ReactNode;
    disabled?: boolean;
    state?: string;
    type?: string;
}

export interface IMenuSection {
    header: string;
    items: IMenuItem[];
}

export type IMenu = IMenuSection[];

export const menuItems: IMenu = [
    {
        header: 'Model Setup',
        items: [
            {
                name: 'Discretization',
                property: 'discretization',
                icon: <Icon name="calendar alternate outline"/>
            },
            {
                name: 'Soil Layers',
                property: 'soilmodel',
                type: 'layers',
                icon: <Icon name="expand"/>
            },
            {
                name: 'Boundaries',
                property: 'boundaries',
                icon: <Icon name="map marker alternate"/>
            },
            {
                name: 'Head Observations',
                property: 'head_observations',
                icon: <Icon name="eye"/>
            },
            {
                name: 'Transport',
                property: 'transport',
                icon: <Icon name="cube"/>
            },
            {
                name: 'Variable Density',
                property: 'variable_density',
                icon: <Icon name="gem"/>
            }]
    }, {
        header: 'Calculation',
        items: [
            {
                name: 'Mf packages',
                property: 'modflow',
                icon: <Icon name="retweet"/>
            },
            {
                name: 'Mt packages',
                property: 'mt3d',
                icon: <Icon name="exchange"/>
            },
            {
                name: 'Swt package',
                property: 'seawat',
                icon: <Icon name="eyedropper"/>
            },
            {
                name: 'Run calculation',
                property: 'calculation',
                icon: <Icon name="save outline"/>
            }
        ]
    }, {
        header: 'Results',
        items: [
            {
                name: 'Flow',
                property: 'flow',
                icon: <Icon name="chart bar outline"/>,
            },
            {
                name: 'Concentration',
                property: 'concentration',
                icon: <Icon name="chart bar outline"/>
            }
        ]
    }, {
        header: 'Calibration',
        items: [
            {
                name: 'Observations',
                property: 'observations',
                icon: <Icon name="clipboard outline"/>,
            },
            {
                name: 'Calibration',
                property: 'calibration',
                icon: <Icon name="calculator"/>,
                disabled: true
            }
        ]
    }, {
        header: '',
        items: [
            {
                name: 'Export',
                property: 'export',
                icon: <Icon name="download"/>,
                disabled: false
            }
        ]
    }
];
