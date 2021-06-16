import {Icon} from 'semantic-ui-react';
import {SemanticICONS} from 'semantic-ui-react/dist/commonjs/generic';
import {ToolNavigation} from '../../shared/complexTools';
import Qmra from '../../../core/model/qmra/Qmra';

interface IProps {
  hasResults: boolean;
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
              name: 'Inflow concentration of pathogens',
              property: 'inflow',
              icon: renderIcon('certificate', 'inflow')
            },
            {
              name: 'Treatment Steps',
              property: 'processes',
              icon: renderIcon('cogs', 'processes'),
              disabled: props.qmra.inflow.length < 1
            },
            {
              name: 'Treatment Train',
              property: 'schemes',
              icon: renderIcon('boxes', 'schemes'),
              disabled: props.qmra.inflow.length < 1
            },
            {
              name: 'Exposure Scenario',
              property: 'exposure',
              icon: renderIcon('bolt', 'exposure')
            },

            {
              name: 'Dose-Response',
              property: 'doseResponse',
              icon: renderIcon('syringe', 'doseResponse'),
              disabled: props.qmra.inflow.length < 1
            },
            {
              name: 'Health',
              property: 'health',
              icon: renderIcon('heartbeat', 'health'),
              disabled: props.qmra.inflow.length < 1
            },
            {
              name: 'Stochastic runs',
              property: 'setup',
              icon: renderIcon('wrench', 'setup')
            }
          ]
        },
        {
          header: 'Calculation',
          items: [
            {
              name: 'Calculation',
              property: 'calculation',
              icon: renderIcon('calculator', 'calculation'),
              disabled: props.qmra.inflow.length < 1
            }
          ]
        },
        {
          header: 'Results',
          items: [
            {
              name: 'Summary',
              property: 'stats_total',
              icon: renderIcon('bullhorn', 'events'),
              disabled: !props.hasResults
            }
          ]
        }
      ]}
    />
  );
};

export default Navigation;
