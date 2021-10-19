import { Icon } from 'semantic-ui-react';
import { SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic';
import { ToolNavigation } from '../../shared/complexTools';

interface IProps {
  isSaving: boolean;
  property: string;
}

const Navigation = (props: IProps) => {
  const renderIcon = (name: SemanticICONS, property: string) => {
    if (props.isSaving && property === props.property) {
      return <Icon loading={true} color="green" name="save outline" />;
    }
    return <Icon name={name} />;
  };

  return (
    <ToolNavigation
      navigationItems={[
        {
          header: 'Sensors',
          items: [
            {
              name: 'Setup',
              property: 'sensor-setup',
              icon: renderIcon('calendar alternate outline', 'sensor-setup'),
            },
            {
              name: 'Processing',
              property: 'sensor-processing',
              icon: renderIcon('cube', 'sensor-processing'),
            },
            {
              name: 'Visualization',
              property: 'sensor-visualization',
              icon: renderIcon('expand', 'sensor-visualization'),
            },
          ],
        },
      ]}
    />
  );
};

export default Navigation;
