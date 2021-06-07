import { Grid, Segment } from 'semantic-ui-react';
import { useEffect, useState } from 'react';
import DoseResponse from '../../../../core/model/qmra/DoseResponse';
import DoseResponseForm from './DoseResponseForm';
import ElementsList from '../ElementsList';
import IDoseResponse from '../../../../core/model/qmra/DoseResponse.type';
import InfoBox from '../InfoBox';
import Qmra from '../../../../core/model/qmra/Qmra';
import descriptions from '../defaults/descriptions';

interface IProps {
  onChange: (qmra: Qmra) => void;
  qmra: Qmra;
}

const DoseResponseEditor = ({ qmra, onChange }: IProps) => {
  const [selectedElement, setSelectedElement] = useState<IDoseResponse>();

  useEffect(() => {
    if (!selectedElement && qmra.doseResponse.length > 0) {
      setSelectedElement(qmra.doseResponse[0].toObject());
    }
    if (selectedElement && qmra.doseResponse.length === 0) {
      setSelectedElement(undefined);
    }
  }, [qmra, selectedElement]);

  const handleDispatch = (e: IDoseResponse[]) => {
    const cQmra = qmra.toObject();
    cQmra.data.doseResponse = e;
    onChange(Qmra.fromObject(cQmra));
  };

  const handleChangeSelected = (p: DoseResponse) => {
    setSelectedElement(p.toObject());
    const cDoseResponse = qmra.doseResponse.map((e) => {
      if (e.id === p.id) {
        return p.toObject();
      }
      return e.toObject();
    });
    handleDispatch(cDoseResponse);
  };

  const handleSelectElement = (id: number | string) => {
    const element = qmra.doseResponse.filter((e) => e.id === id);
    if (element.length > 0) {
      setSelectedElement(element[0].toObject());
    }
  };

  return (
    <Segment color={'grey'}>
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={4}>
            <ElementsList
              items={qmra.doseResponse.map((e) => ({ id: e.id, name: e.pathogenName }))}
              onClick={handleSelectElement}
              readOnly={qmra.readOnly}
              selected={selectedElement ? selectedElement.id : undefined}
            />
          </Grid.Column>
          <Grid.Column width={12}>
          {selectedElement && (
              <DoseResponseForm
                onChange={handleChangeSelected}
                readOnly={qmra.readOnly}
                selectedDoseResponse={DoseResponse.fromObject(selectedElement)}
              />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <InfoBox header="Dose-Response" description={descriptions.dose_response} />
    </Segment>
  );
};

export default DoseResponseEditor;
