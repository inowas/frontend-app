import { Grid, Segment } from 'semantic-ui-react';
import { ITool } from '../../../../core/marPro/Tool.type';
import { gameObjectTypes } from '../../../../core/marPro/GameObject.type';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ItemsList from './ItemList';
import Scenario from '../../../../core/marPro/Scenario';
import Tool from '../../../../core/marPro/Tool';
import ToolsDetails from './ToolsDetails';
import uuid from 'uuid';

interface IProps {
  onChange: (senario: Scenario) => void;
  scenario: Scenario;
}

const baseUrl = '/tools/T100';

const ToolsEditor = (props: IProps) => {
  const [selectedTool, setSelectedTool] = useState<ITool>();

  const history = useHistory();
  const { id, property, pid } = useParams<any>();

  useEffect(() => {
    if (pid) {
      const r = props.scenario.tools.filter((t) => t.id === pid);
      if (r.length > 0) {
        setSelectedTool(r[0]);
      } else {
        setSelectedTool(undefined);
        history.push(`${baseUrl}/${id}/${property}`);
      }
    }
  }, [history, id, pid, property, props.scenario.tools]);

  const handleAdd = (type?: string) => {
    if (!type) {
      return;
    }

    const cScenario = props.scenario.toObject();

    const newTool = Tool.fromType(type);
    cScenario.data.tools.push(newTool.toObject());

    props.onChange(Scenario.fromObject(cScenario));
  };

  const handleChange = (tool: Tool) => {
    const cScenario = props.scenario.toObject();

    const fTool = props.scenario.tools.filter((t) => t.id === tool.id);
    if (fTool.length > 0) {
      cScenario.data.tools = cScenario.data.tools.map((t) => {
        if (t.id === tool.id) {
          return tool.toObject();
        }
        return t;
      });
    }

    props.onChange(Scenario.fromObject(cScenario));
  };

  const handleClone = (id: string) => {
    const cScenario = props.scenario.toObject();

    const fTool = props.scenario.tools.filter((r) => r.id === id);
    if (fTool.length > 0) {
      const newTool = Tool.fromObject(fTool[0]).getClone();
      newTool.id = uuid.v4();
      cScenario.data.tools.push(newTool.toObject());
    }

    props.onChange(Scenario.fromObject(cScenario));
  };

  const handleDelete = (id: string) => {
    const cScenario = props.scenario.toObject();

    cScenario.data.tools = cScenario.data.tools.filter((r) => r.id !== id);

    props.onChange(Scenario.fromObject(cScenario));
    history.push(`${baseUrl}/${id}/${property}`);
  };

  return (
    <Segment color="black">
      <Grid>
        <Grid.Column width={4}>
          <ItemsList
            items={props.scenario.tools.map((r) => {
              return { id: r.id, name: r.name };
            })}
            onAdd={handleAdd}
            onClone={handleClone}
            onDelete={handleDelete}
            title="Tool"
            types={gameObjectTypes.map((g) => {
              return {
                disabled: false,
                text: g.type,
                value: g.type,
              };
            })}
          />
        </Grid.Column>
        <Grid.Column width={12}>
          {selectedTool ? (
            <ToolsDetails onChange={handleChange} scenario={props.scenario} tool={Tool.fromObject(selectedTool)} />
          ) : (
            'Select Tool'
          )}
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default ToolsEditor;
