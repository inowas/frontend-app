import {Icon} from 'semantic-ui-react';
import React from 'react';

const menuItems = [
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
                name: 'Budget',
                property: 'budget',
                icon: <Icon name="chart bar outline"/>
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
                disabled: true
            },
            {
                name: 'Calibration',
                property: 'calibration',
                icon: <Icon name="calculator"/>,
                disabled: true
            }
        ]
    }, {
        header: 'Computation',
        items: [
            {
                name: 'Optimization',
                property: 'optimization',
                icon: <Icon name="sliders horizontal"/>,
                disabled: true
            }
        ]
    }
];

export default menuItems;

export const enableProperty = (name, menuItems) => {
    return menuItems.map(itemGroup => {
        itemGroup = itemGroup.map(item => {
            if (item.property === name) {
                item.disabled = false;
            }

            return item;
        });
        return itemGroup;
    })
};

export const disableProperty = (name, menuItems) => {
    return menuItems.map(itemGroup => {
        itemGroup = itemGroup.map(item => {
            if (item.property === name) {
                item.disabled = true;
            }

            return item;
        });
        return itemGroup;
    })
};
