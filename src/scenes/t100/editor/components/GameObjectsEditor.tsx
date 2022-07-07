import { BoundaryCollection } from '../../../../core/model/modflow';
import { Grid, Segment } from 'semantic-ui-react';
import { IGameObject } from '../../../../core/marPro/GameObject.type';
import { IRootReducer } from '../../../../reducers';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import GameObject from '../../../../core/marPro/GameObject';
import GameObjectsDetails from './GameObjectsDetails';
import ItemsList from './ItemList';
import Scenario from '../../../../core/marPro/Scenario';
import uuid from 'uuid';

interface IProps {
  onChange: (senario: Scenario) => void;
  scenario: Scenario;
}

const baseUrl = '/tools/T100';

const GameObjectsEditor = (props: IProps) => {
  const [selectedObject, setSelectedObject] = useState<IGameObject>();

  const MarPro = useSelector((state: IRootReducer) => state.MarProEditorReducer);
  const boundaries = MarPro.boundaries ? BoundaryCollection.fromObject(MarPro.boundaries) : null;

  const history = useHistory();
  const { id, property, pid } = useParams<any>();

  useEffect(() => {
    if (pid) {
      const r = props.scenario.objects.filter((r) => r.id === pid);
      if (r.length > 0) {
        setSelectedObject(r[0]);
      } else {
        setSelectedObject(undefined);
        history.push(`${baseUrl}/${id}/${property}`);
      }
    }
  }, [history, id, pid, property, props.scenario.objects]);

  const handleAdd = () => {
    const cScenario = props.scenario.toObject();

    const newObject = GameObject.createInfiltrationPond();
    cScenario.data.objects.push(newObject.toObject());

    props.onChange(Scenario.fromObject(cScenario));
  };

  const handleChange = (object: GameObject) => {
    const cScenario = props.scenario.toObject();

    const fObject = props.scenario.objects.filter((o) => o.id === object.id);
    if (fObject.length > 0) {
      cScenario.data.objects = cScenario.data.objects.map((obj) => {
        if (obj.id === object.id) {
          return object.toObject();
        }
        return obj;
      });
    }

    props.onChange(Scenario.fromObject(cScenario));
  };

  const handleClone = (id: string) => {
    const cScenario = props.scenario.toObject();

    const fObject = props.scenario.objects.filter((o) => o.id === id);
    if (fObject.length > 0) {
      const newObject = GameObject.fromObject(fObject[0]).getClone();
      newObject.id = uuid.v4();
      cScenario.data.objects.push(newObject.toObject());
    }

    props.onChange(Scenario.fromObject(cScenario));
  };

  const handleDelete = (id: string) => {
    const cScenario = props.scenario.toObject();

    cScenario.data.objects = cScenario.data.objects.filter((o) => o.id !== id);

    props.onChange(Scenario.fromObject(cScenario));
    history.push(`${baseUrl}/${id}/${property}`);
  };

  return (
    <Segment color="black">
      <Grid>
        <Grid.Column width={4}>
          <ItemsList
            items={props.scenario.objects.map((r) => {
              return { id: r.id, name: r.type };
            })}
            onAdd={handleAdd}
            onClone={handleClone}
            onDelete={handleDelete}
            title="Object"
          />
        </Grid.Column>
        <Grid.Column width={12}>
          {selectedObject && boundaries ? (
            <GameObjectsDetails
              onChange={handleChange}
              object={GameObject.fromObject(selectedObject)}
              scenario={props.scenario}
              boundaries={boundaries}
            />
          ) : (
            'Select Game Object'
          )}
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default GameObjectsEditor;
