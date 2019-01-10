import {Icon} from 'semantic-ui-react';
import React from 'react';

const menuItems = [
    {
        name: 'Discretization',
        property: 'discretization',
        icon: <Icon name="calendar alternate outline"/>
    },
    {
        name: 'Soilmodel',
        property: 'soilmodel',
        icon: <Icon name="expand"/>
    },
    {
        name: 'Boundaries',
        property: 'boundaries',
        icon: <Icon name="map marker alternate"/>
    },
    {
        name: 'Observations',
        property: 'observations',
        icon: <Icon name="clipboard outline"/>
    },
    {
        name: 'Transport',
        property: 'transport',
        icon: <Icon name="exchange"/>
    },
    {
        name: 'Run',
        property: 'run',
        icon: <Icon name="calculator"/>
    },
    {
        name: 'Results',
        property: 'results',
        icon: <Icon name="chart bar outline"/>
    },
    {
        name: 'Optimization',
        property: 'optimization',
        icon: <Icon name="sliders horizontal"/>
    }
];

export default menuItems;
