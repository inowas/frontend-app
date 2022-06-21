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
    header: 'Model',
    items: [
      {
        name: 'Discretization',
        property: 'discretization',
        icon: <Icon name="calendar alternate outline" />,
      },
    ],
  },
  {
    header: 'Settings',
    items: [
      {
        name: 'Game Objects',
        property: 'modflow',
        icon: <Icon name="retweet" />,
      },
      {
        name: 'Objectives',
        property: 'mt3d',
        icon: <Icon name="exchange" />,
      },
      {
        name: 'Resources',
        property: 'seawat',
        icon: <Icon name="eyedropper" />,
      },
    ],
  },
];
