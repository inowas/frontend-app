import { Button, Grid, Icon, Menu, Popup } from 'semantic-ui-react';
import { IParameter } from '../../../../core/marPro/Parameter.type';
import { MouseEvent, useState } from 'react';
import GameObject from '../../../../core/marPro/GameObject';
import Parameter from '../../../../core/marPro/Parameter';
import ParameterEditor from './ParameterEditor';
import uuid from 'uuid';

interface IProps {
  gameObject: GameObject;
  onChange: (gameObject: GameObject) => any;
}

const Parameters = (props: IProps) => {
  const [selectedParameter, setSelectedParameter] = useState<IParameter>();

  const handleAddParameter = () => {
    const cGameObject = props.gameObject.toObject();
    cGameObject.parameters.push(Parameter.fromDefaults().toObject());
    props.onChange(GameObject.fromObject(cGameObject));
  };

  const handleChangeParameter = (parameter: Parameter) => {
    const cObject = props.gameObject.toObject();
    cObject.parameters = cObject.parameters.map((p) => {
      if (p.id === parameter.id) {
        return parameter.toObject();
      }
      return p;
    });

    setSelectedParameter(parameter.toObject());
    props.onChange(GameObject.fromObject(cObject));
  };

  const handleCloneItem = (id: string) => () => {
    const cObject = props.gameObject.toObject();

    const fParameter = props.gameObject.parameters.filter((p) => p.id === id);
    if (fParameter.length > 0) {
      const newParameter = Parameter.fromObject(fParameter[0]).getClone();
      newParameter.id = uuid.v4();
      cObject.parameters.push(newParameter.toObject());
    }

    props.onChange(GameObject.fromObject(cObject));
  };

  const handleDeleteItem = (id: string) => () => {
    const cObject = props.gameObject.toObject();
    cObject.parameters = cObject.parameters.filter((p) => p.id !== id);

    setSelectedParameter(undefined);
    props.onChange(GameObject.fromObject(cObject));
  };

  const handleItemClick = (id: string) => (e: MouseEvent) => {
    if (e.currentTarget !== e.target) {
      return;
    }

    const fParameters = props.gameObject.parameters.filter((p) => p.id === id);
    if (fParameters.length > 0) {
      setSelectedParameter(fParameters[0]);
    }
  };

  return (
    <Grid>
      <Grid.Column width={5}>
        <Menu fluid vertical secondary>
          <Menu.Item>
            <Button fluid positive icon labelPosition="left" onClick={handleAddParameter}>
              <Icon name="add" />
              Add new Parameter
            </Button>
          </Menu.Item>
          {props.gameObject.parameters.map((p) => (
            <Menu.Item
              active={selectedParameter && selectedParameter.id === p.id}
              key={p.id}
              onClick={handleItemClick(p.id)}
            >
              {p.name}
              <Popup
                trigger={<Icon name="ellipsis horizontal" />}
                content={
                  <Button.Group floated="right" size="small">
                    <Popup
                      trigger={<Button icon={'clone'} onClick={handleCloneItem(p.id)} />}
                      content="Clone"
                      position="top center"
                      size="mini"
                    />
                    <Popup
                      trigger={<Button icon={'trash'} onClick={handleDeleteItem(p.id)} />}
                      content="Delete"
                      position="top center"
                      size="mini"
                    />
                  </Button.Group>
                }
                on={'click'}
                position={'right center'}
              />
            </Menu.Item>
          ))}
        </Menu>
      </Grid.Column>
      <Grid.Column width={11}>
        {selectedParameter ? (
          <ParameterEditor parameter={Parameter.fromObject(selectedParameter)} onChange={handleChangeParameter} />
        ) : (
          'Select Parameter'
        )}
      </Grid.Column>
    </Grid>
  );
};

export default Parameters;
