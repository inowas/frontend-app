import { Grid, Segment } from 'semantic-ui-react';
import { IResourceSettings } from '../../../../core/marPro/Resource.type';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ItemsList from './ItemList';
import ResourceSettings from '../../../../core/marPro/ResourceSettings';
import ResourcesDetails from './ResourcesDetails';
import Scenario from '../../../../core/marPro/Scenario';
import uuid from 'uuid';

interface IProps {
  onChange: (senario: Scenario) => void;
  scenario: Scenario;
}

const baseUrl = '/tools/T100';

const ResourcesEditor = (props: IProps) => {
  const [selectedResource, setSelectedResource] = useState<IResourceSettings>();

  const history = useHistory();
  const { id, property, pid } = useParams<any>();

  useEffect(() => {
    if (pid) {
      const r = props.scenario.resources.filter((r) => r.id === pid);
      if (r.length > 0) {
        setSelectedResource(r[0]);
      } else {
        setSelectedResource(undefined);
        history.push(`${baseUrl}/${id}/${property}`);
      }
    }
  }, [history, id, pid, property, props.scenario.resources]);

  const handleAdd = () => {
    const cScenario = props.scenario.toObject();

    const newResource = ResourceSettings.fromDefaults();
    cScenario.data.resources.push(newResource.toObject());

    props.onChange(Scenario.fromObject(cScenario));
  };

  const handleChange = (resource: ResourceSettings) => {
    const cScenario = props.scenario.toObject();

    const fResource = props.scenario.resources.filter((r) => r.id === resource.id);
    if (fResource.length > 0) {
      cScenario.data.resources = cScenario.data.resources.map((res) => {
        if (res.id === resource.id) {
          return resource.toObject();
        }
        return res;
      });
    }

    props.onChange(Scenario.fromObject(cScenario));
  };

  const handleClone = (id: string) => {
    const cScenario = props.scenario.toObject();

    const fResource = props.scenario.resources.filter((r) => r.id === id);
    if (fResource.length > 0) {
      const newResource = ResourceSettings.fromObject(fResource[0]).getClone();
      newResource.id = uuid.v4();
      cScenario.data.resources.push(newResource.toObject());
    }

    props.onChange(Scenario.fromObject(cScenario));
  };

  const handleDelete = (id: string) => {
    const cScenario = props.scenario.toObject();

    cScenario.data.resources = cScenario.data.resources.filter((r) => r.id !== id);

    props.onChange(Scenario.fromObject(cScenario));
    history.push(`${baseUrl}/${id}/${property}`);
  };

  return (
    <Segment color="black">
      <Grid>
        <Grid.Column width={4}>
          <ItemsList
            items={props.scenario.resources.map((r) => {
              return { id: r.id, name: r.name };
            })}
            onAdd={handleAdd}
            onClone={handleClone}
            onDelete={handleDelete}
            title="Resource"
          />
        </Grid.Column>
        <Grid.Column width={12}>
          {selectedResource ? (
            <ResourcesDetails onChange={handleChange} resource={ResourceSettings.fromObject(selectedResource)} />
          ) : (
            'Select Resource'
          )}
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default ResourcesEditor;
