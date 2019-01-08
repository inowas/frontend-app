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
        property: 'soilmodel'
    },
    {
        name: 'Boundaries',
        property: 'boundaries',
        icon: <Icon name="map marker alternate"/>
    },
    {
        name: 'Observations',
        property: 'observations'
    },
    {
        name: 'Transport',
        property: 'transport'
    },
    {
        name: 'Run',
        property: 'run'
    },
    {
        name: 'Results',
        property: 'results'
    },
    {
        name: 'Optimization',
        property: 'optimization'
    }
];

export default menuItems;
