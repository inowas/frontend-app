import {Grid, Segment} from 'semantic-ui-react';
import {useEffect, useState} from 'react';
import ElementsList from '../ElementsList';
import Health from '../../../../core/model/qmra/Health';
import HealthForm from './HealthForm';
import IHealth from '../../../../core/model/qmra/Health.type';
import InfoBox from '../InfoBox';
import Qmra from '../../../../core/model/qmra/Qmra';
import descriptions from '../defaults/descriptions.json';

interface IProps {
  onChange: (qmra: Qmra) => void;
  qmra: Qmra;
}

const HealthEditor = ({qmra, onChange}: IProps) => {
  const [selectedElement, setSelectedElement] = useState<IHealth>();

  useEffect(() => {
    if (!selectedElement && qmra.health.length > 0) {
      setSelectedElement(qmra.health[0].toObject());
    }
    if (selectedElement && qmra.health.length === 0) {
      setSelectedElement(undefined);
    }
  }, [qmra, selectedElement]);

  const handleDispatch = (e: IHealth[]) => {
    const cQmra = qmra.toObject();
    cQmra.data.health = e;
    onChange(Qmra.fromObject(cQmra));
  };

  const handleChangeSelected = (ce: Health) => {
    setSelectedElement(ce.toObject());
    const cHealth = qmra.health.map((e) => {
      if (e.id === ce.id) {
        return ce.toObject();
      }
      return e.toObject();
    });
    handleDispatch(cHealth);
  };

  const handleSelectElement = (id: number | string) => {
    const item = qmra.health.filter((e) => e.id === id);
    if (item.length > 0) {
      setSelectedElement(item[0].toObject());
    }
  };

  return (
    <Segment color={'grey'}>  
      <Grid>
        <Grid.Row>
          <Grid.Column width={16} />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={4}>
          <ElementsList
              items={qmra.health.map((e) => ({ id: e.id, name: e.pathogenName }))}
              onClick={handleSelectElement}
              readOnly={qmra.readOnly}
              selected={selectedElement ? selectedElement.id : undefined}
            />
          </Grid.Column>
          <Grid.Column width={12}>
            {selectedElement &&
            <HealthForm
              onChange={handleChangeSelected}
              readOnly={qmra.readOnly}
              selectedHealth={Health.fromObject(selectedElement)}
            />
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <InfoBox header="Health" description={descriptions.health} />
    </Segment>
  );
};

export default HealthEditor;
