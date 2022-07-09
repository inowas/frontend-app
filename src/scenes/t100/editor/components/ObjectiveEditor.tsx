import {
  EObjectiveType,
  IObjectiveByParameter,
  IObjectiveByResource,
  TObjective,
} from '../../../../core/marPro/Objective.type';
import { EResultType } from '../../../modflow/components/content/results/flowResults';
import { Grid, Segment } from 'semantic-ui-react';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ItemsList, { IType } from './ItemList';
import Objective from '../../../../core/marPro/Objective';
import ObjectiveDetails from './ObjectiveDetails';
import Scenario from '../../../../core/marPro/Scenario';
import uuid from 'uuid';

interface IProps {
  onChange: (senario: Scenario) => void;
  scenario: Scenario;
}

const baseUrl = '/tools/T100';

const getTypes = (scenario: Scenario): IType[] => {
  const parameters = scenario.parameters;
  return [
    {
      disabled: scenario.resources.length === 0,
      items: scenario.resources.map((resource) => {
        return {
          disabled: false,
          text: resource.name,
          value: resource.id,
        };
      }),
      text: 'Depending on Resource',
      value: EObjectiveType.BY_RESOURCE,
    },
    {
      disabled: parameters.length === 0,
      items: parameters.map((parameter) => {
        return {
          disabled: false,
          text: parameter.name || '',
          value: parameter.id,
        };
      }),
      text: 'Depending on Parameter',
      value: EObjectiveType.BY_PARAMETER,
    },
    {
      disabled: !scenario.modelId,
      items: [
        {
          disabled: false,
          text: 'Drawdown',
          value: EResultType.DRAWDOWN,
        },
        {
          disabled: false,
          text: 'Head',
          value: EResultType.HEAD,
        },
      ],
      text: 'Depending on Observation',
      value: EObjectiveType.BY_OBSERVATION,
    },
  ];
};

const ObjectiveEditor = (props: IProps) => {
  const [selectedObjective, setSelectedObjective] = useState<TObjective>();
  const [types, setTypes] = useState<IType[]>(getTypes(props.scenario));

  const history = useHistory();
  const { id, property, pid } = useParams<any>();

  useEffect(() => {
    setTypes(getTypes(props.scenario));
  }, [props.scenario]);

  useEffect(() => {
    if (pid) {
      const r = props.scenario.objectives.filter((r) => r.id === pid);
      if (r.length > 0) {
        setSelectedObjective(r[0]);
      } else {
        setSelectedObjective(undefined);
        history.push(`${baseUrl}/${id}/${property}`);
      }
    }
  }, [history, id, pid, property, props.scenario.objectives]);

  const handleAdd = (type?: string, id?: string) => {
    if (!type || !id) {
      return;
    }
    const cScenario = props.scenario.toObject();

    const newObjective = Objective.fromType(type, id);
    cScenario.data.objectives.push(newObjective.toObject());

    props.onChange(Scenario.fromObject(cScenario));
  };

  const handleChange = (objective: Objective) => {
    const cScenario = props.scenario.toObject();

    const fObjective = props.scenario.objectives.filter((o) => o.id === objective.id);
    if (fObjective.length > 0) {
      cScenario.data.objectives = cScenario.data.objectives.map((obj) => {
        if (obj.id === objective.id) {
          return objective.toObject();
        }
        return obj;
      });
    }

    props.onChange(Scenario.fromObject(cScenario));
  };

  const handleClone = (id: string) => {
    const cScenario = props.scenario.toObject();

    const fObjective = props.scenario.objectives.filter((o) => o.id === id);
    if (fObjective.length > 0) {
      const newObjective = Objective.fromObject(fObjective[0]).getClone();
      newObjective.id = uuid.v4();
      cScenario.data.objectives.push(newObjective.toObject());
    }

    props.onChange(Scenario.fromObject(cScenario));
  };

  const handleDelete = (id: string) => {
    const cScenario = props.scenario.toObject();

    cScenario.data.objectives = cScenario.data.objectives.filter((o) => o.id !== id);

    props.onChange(Scenario.fromObject(cScenario));
    history.push(`${baseUrl}/${id}/${property}`);
  };

  const renderResource = (obj: IObjectiveByResource | IObjectiveByParameter) => {
    if (obj.type === EObjectiveType.BY_RESOURCE) {
      const resource = props.scenario.resources.find((r) => r.id === obj.resourceId);
      if (resource) {
        return `resource ${resource.name}`;
      }
    }
    if (obj.type === EObjectiveType.BY_PARAMETER) {
      const parameter = props.scenario.parameters.find((p) => p.id === obj.parameterId);
      if (parameter) {
        return `parameter ${parameter.name}`;
      }
    }

    return `${obj.type} ${obj.id}`;
  };

  return (
    <Segment color="black">
      <Grid>
        <Grid.Column width={4}>
          <ItemsList
            items={props.scenario.objectives.map((r) => {
              return {
                id: r.id,
                name: r.type === EObjectiveType.BY_OBSERVATION ? `${r.type} ${r.parameter}` : renderResource(r),
              };
            })}
            onAdd={handleAdd}
            onClone={handleClone}
            onDelete={handleDelete}
            title="Objective"
            types={types}
          />
        </Grid.Column>
        <Grid.Column width={12}>
          {selectedObjective ? (
            <ObjectiveDetails
              onChange={handleChange}
              objective={Objective.fromObject(selectedObjective)}
              scenario={props.scenario}
            />
          ) : (
            'Select Objective'
          )}
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default ObjectiveEditor;
