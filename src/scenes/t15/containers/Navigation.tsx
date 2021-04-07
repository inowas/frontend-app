import {Icon} from 'semantic-ui-react';
import {SemanticICONS} from 'semantic-ui-react/dist/commonjs/generic';
import {ToolNavigation} from '../../shared/complexTools';
import Qmra from '../../../core/model/qmra/Qmra';

interface IProps {
  isFetching: boolean;
  property: string;
  qmra: Qmra;
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
              name: 'Exposure',
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
              icon: renderIcon('map', 'doseResponse'),
              disabled: props.qmra.inflow.length < 1
            },
            {
              name: 'Health',
              property: 'health',
              icon: renderIcon('map', 'health'),
              disabled: props.qmra.inflow.length < 1
            }
          ]
        },
        {
          header: 'Treatment',
          items: [
            {
              name: 'Processes',
              property: 'processes',
              icon: renderIcon('map', 'processes'),
              disabled: props.qmra.inflow.length < 1
            },
            {
              name: 'Schemes',
              property: 'schemes',
              icon: renderIcon('map', 'schemes'),
              disabled: props.qmra.inflow.length < 1
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
