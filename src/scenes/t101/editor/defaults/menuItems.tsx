import { Icon } from 'semantic-ui-react';
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
    header: 'Setup',
    items: [
      {
        name: 'Scenario',
        property: 'scenario',
        icon: <Icon name="file alternate" />,
      },
      {
        name: 'Model',
        property: 'model',
        icon: <Icon name="globe" />,
      },
    ],
  },
  {
    header: 'Settings',
    items: [
      {
        name: 'Resources',
        property: 'resources',
        icon: <Icon name="money bill alternate" />,
      },
      {
        name: 'Tools',
        property: 'tools',
        icon: <Icon name="wrench" />,
      },
      {
        name: 'Game Objects',
        property: 'objects',
        icon: <Icon name="industry" />,
      },
      {
        name: 'Objectives',
        property: 'objectives',
        icon: <Icon name="clipboard" />,
      },
      {
        name: 'Zones',
        disabled: true,
        property: 'zones',
        icon: <Icon name="expand" />,
      },
    ],
  },
  {
    header: 'Test',
    items: [
      {
        name: 'Play',
        property: 'play',
        icon: <Icon name="play" />,
      },
      {
        name: 'Download',
        property: 'download',
        icon: <Icon name="download" />,
      },
    ],
  },
];
