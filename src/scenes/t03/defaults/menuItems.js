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
            }]
    }, {
        header: 'Calculation',
        items: [
            {
                name: 'Flow',
                property: 'flow',
                icon: <Icon name="retweet"/>
            },
            {
                name: 'Transport',
                property: 'transport',
                icon: <Icon name="exchange"/>
            },
            {
                name: 'Files',
                property: 'files',
                icon: <Icon name="save outline"/>,
                disabled: true
            },
            {
                name: 'Results',
                property: 'results',
                icon: <Icon name="chart bar outline"/>,
                disabled: true
            }
        ]
    }, {
        header: 'Calibration',
        items: [
            {
                name: 'Observations',
                property: 'observations',
                icon: <Icon name="clipboard outline"/>
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
