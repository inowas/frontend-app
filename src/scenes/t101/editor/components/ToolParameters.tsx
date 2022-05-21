import { Button, Grid, Icon, Menu, Popup } from 'semantic-ui-react';
import { IParameter } from '../../../../core/marPro/Parameter.type';
import { MouseEvent, useEffect, useState } from 'react';
import Parameter from '../../../../core/marPro/Parameter';
import ParameterEditor from './ParameterEditor';
import Scenario from '../../../../core/marPro/Scenario';
import Tool from '../../../../core/marPro/Tool';
import uuid from 'uuid';

interface IProps {
  scenario: Scenario;
  tool: Tool;
  onChange: (tool: Tool) => any;
}

const ToolParameters = (props: IProps) => {
  const [selectedParameter, setSelectedParameter] = useState<IParameter>();

  useEffect(() => {
    if (props.tool.parameters.length === 0) {
      setSelectedParameter(undefined);
    }
    setSelectedParameter(props.tool.parameters[0]);
  }, [props.tool]);

  const handleAddParameter = () => {
    const cTool = props.tool.toObject();
    cTool.parameters.push(Parameter.fromDefaults().toObject());
    props.onChange(Tool.fromObject(cTool));
  };

  const handleChangeId = (id: string) => {
    if (!selectedParameter) {
      return;
    }
    const cParameter = Parameter.fromObject(selectedParameter);
    const cTool = props.tool.toObject();
    cTool.parameters = cTool.parameters.map((p) => {
      if (p.id === selectedParameter.id) {
        cParameter.id = id;
        return cParameter.toObject();
      }
      return p;
    });

    setSelectedParameter(cParameter.toObject());
    props.onChange(Tool.fromObject(cTool));
  };

  const handleChangeParameter = (parameter: Parameter) => {
    const cTool = props.tool.toObject();
    cTool.parameters = cTool.parameters.map((p) => {
      if (p.id === parameter.id) {
        return parameter.toObject();
      }
      return p;
    });

    setSelectedParameter(parameter.toObject());
    props.onChange(Tool.fromObject(cTool));
  };

  const handleCloneItem = (id: string) => () => {
    const cTool = props.tool.toObject();

    const fParameter = props.tool.parameters.filter((p) => p.id === id);
    if (fParameter.length > 0) {
      const newParameter = Parameter.fromObject(fParameter[0]).getClone();
      newParameter.id = uuid.v4();
      cTool.parameters.push(newParameter.toObject());
    }

    props.onChange(Tool.fromObject(cTool));
  };

  const handleDeleteItem = (id: string) => () => {
    const cTool = props.tool.toObject();
    cTool.parameters = cTool.parameters.filter((p) => p.id !== id);

    setSelectedParameter(undefined);
    props.onChange(Tool.fromObject(cTool));
  };

  const handleItemClick = (id: string) => (e: MouseEvent) => {
    if (e.currentTarget !== e.target) {
      return;
    }

    const fParameters = props.tool.parameters.filter((p) => p.id === id);
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
              Add Parameter
            </Button>
          </Menu.Item>
          {props.tool.parameters.map((p) => (
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
          <ParameterEditor
            scenario={props.scenario}
            parameter={Parameter.fromObject(selectedParameter)}
            onChange={handleChangeParameter}
            onChangeId={handleChangeId}
          />
        ) : (
          'Select Parameter'
        )}
      </Grid.Column>
    </Grid>
  );
};

export default ToolParameters;
