import {Icon} from 'semantic-ui-react';
import {SemanticICONS} from 'semantic-ui-react/dist/commonjs/generic';
import {ToolNavigation} from '../../shared/complexTools';
import React from 'react';

interface IProps {
  isFetching: boolean;
  property: string;
}

const Navigation = (props: IProps) => {

  const renderIcon = (name: SemanticICONS, property: string) => {
    if (props.isFetching && property === props.property) {
      return <Icon loading={true} color="green" name="save outline"/>;
    }
    return <Icon name={name}/>;
  };

  return (
    <ToolNavigation
      navigationItems={[
        {
          header: 'Input',
          items: [
            {
              name: 'Setup',
              property: 'setup',
              icon: renderIcon('map', 'setup')
            },
            {
              name: 'Inflow',
              property: 'inflow',
              icon: renderIcon('map', 'inflow')
            },
            {
              name: 'Dose response',
              property: 'doseResponse',
              icon: renderIcon('map', 'doseResponse')
            },
            {
              name: 'Health',
              property: 'health',
              icon: renderIcon('map', 'health')
            }
          ]
        },
        {
          header: 'Treatment',
          items: [
            {
              name: 'Processes',
              property: 'processes',
              icon: renderIcon('map', 'processes')
            },
            {
              name: 'Schemes',
              property: 'schemes',
              icon: renderIcon('map', 'schemes')
            }
          ]
        },
        {
          header: 'Results',
          items: [
            {
              name: 'Events',
              property: 'events',
              icon: renderIcon('map', 'events'),
            },
            {
              name: 'Total',
              property: 'total',
              icon: renderIcon('map', 'total')
            }
          ]
        }
      ]}
    />
  );
};

export default Navigation;
