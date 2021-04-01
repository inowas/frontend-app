import { Button, Grid, Modal, Segment} from 'semantic-ui-react';
import { doseResponseDefaults } from '../defaults/doseResponse';
import { useEffect, useState } from 'react';
import DoseResponse from '../../../../core/model/qmra/DoseResponse';
import DoseResponseForm from '../DoseResponse/DoseResponseForm';
import ElementsList from '../ElementsList';
import IDoseResponse from '../../../../core/model/qmra/DoseResponse.type';
import IPathogen from '../../../../core/model/qmra/Pathogen.type';
import Pathogen from '../../../../core/model/qmra/Pathogen';
import PathogenForm from './PathogenForm';
import Qmra from '../../../../core/model/qmra/Qmra';
import _ from 'lodash';

interface IProps {
  onChange: (qmra: Qmra) => void;
  qmra: Qmra;
}

const defaultGroups = ['Bacteria', 'Protozoa', 'Virus'];

const PathogenEditor = ({ qmra, onChange }: IProps) => {
  const [defaultDoseResponse, setDefaultDoseResponse] = useState<IDoseResponse>();
  const [selectedDoseResponse, setSelectedDoseResponse] = useState<IDoseResponse>();
  const [selectedElement, setSelectedElement] = useState<IPathogen>();

  useEffect(() => {
    if (!selectedElement && qmra.inflow.length > 0) {
      setSelectedElement(qmra.inflow[0].toObject());
    }
    if (selectedElement && qmra.inflow.length === 0) {
      setSelectedElement(undefined);
    }
  }, [qmra, selectedElement]);

  const handleChangeSelected = (p: Pathogen) => {
    const cQmra = qmra.toObject();
    const doseResponses = cQmra.data.doseResponse.filter((d) => d.pathogenId === p.id);
    if (doseResponses.length < 1 || !selectedElement) {
      return;
    }
    let cDoseResponse = doseResponses[0];
    cDoseResponse.pathogenName = p.name;
    cDoseResponse.pathogenGroup = p.group;

    setSelectedDoseResponse(DoseResponse.fromObject(cDoseResponse).toObject());

    if (p.name !== selectedElement.name) {
      const filterFromDefaults = doseResponseDefaults.filter((d) => d.pathogenName === p.name);
      if (filterFromDefaults.length > 0) {
        cDoseResponse = {
          ...filterFromDefaults[0],
          id: cDoseResponse.id,
          pathogenId: p.id,
        };
        setSelectedElement(p.toObject());
        return setDefaultDoseResponse(cDoseResponse);
      }
    }

    handleDispatch(p, DoseResponse.fromObject(cDoseResponse));
  };

  const handleSelectElement = (id: number | string) => {
    const element = qmra.inflow.filter((e) => e.id === id);
    if (element.length > 0) {
      setSelectedElement(element[0].toObject());
    }
  };

  const handleAddElement = () => {
    const newElement = Pathogen.fromDefaults();
    newElement.id = qmra.inflow.length > 0 ? 1 + Math.max(...qmra.inflow.map((p) => p.id)) : 1;

    const newDoseResponse = DoseResponse.fromDefaults(newElement.id);
    newDoseResponse.pathogenName = newElement.name;
    newDoseResponse.pathogenGroup = newElement.group;

    const cQmra = Qmra.fromObject(qmra.toObject()).addElement(newElement).addElement(newDoseResponse);

    setSelectedElement(newElement.toObject());
    onChange(cQmra);
  };

  const handleCloneElement = (key: string | number) => {
    const elementToClone = qmra.toObject().data.inflow.filter((e) => e.id === key);
    if (elementToClone.length > 0) {
      const newElement = _.cloneDeep(elementToClone[0]);
      newElement.id = qmra.inflow.length > 0 ? 1 + Math.max(...qmra.inflow.map((p) => p.id)) : 1;
      const newDoseResponse = DoseResponse.fromDefaults(newElement.id);
      newDoseResponse.pathogenName = newElement.name;
      newDoseResponse.pathogenGroup = newElement.group;
      const cQmra = Qmra.fromObject(qmra.toObject()).addElement(Pathogen.fromObject(newElement)).addElement(newDoseResponse);
      setSelectedElement(newElement);
      onChange(cQmra);
    }
  };

  const handleRemoveElement = (key: string | number) => {
    const elementToClone = qmra.toObject().data.inflow.filter((e) => e.id === key);
    if (elementToClone.length > 0) {
      const cQmra = qmra.removeElement(Pathogen.fromObject(elementToClone[0]));
      onChange(cQmra);
    }
  };

  const handleDispatch = (p: Pathogen, dr: DoseResponse) => {
    setSelectedElement(p.toObject());
    onChange(qmra.updateElement(p).updateElement(dr));
    setSelectedDoseResponse(undefined);
    setDefaultDoseResponse(undefined);
  };

  const handleAcceptModal = () => {
    setDefaultDoseResponse(undefined);
    if (!selectedElement || !defaultDoseResponse) {
      return;
    }
    handleDispatch(Pathogen.fromObject(selectedElement), DoseResponse.fromObject(defaultDoseResponse));
  };

  const handleCloseModal = () => {
    setDefaultDoseResponse(undefined);
    if (!selectedElement || !selectedDoseResponse) {
      return;
    }
    handleDispatch(Pathogen.fromObject(selectedElement), DoseResponse.fromObject(selectedDoseResponse));
  };

  return (
    <Segment color={'grey'}>
      <Grid>
        <Grid.Row>
          <Grid.Column width={4}>
            <Button
              fluid={true}
              positive={true}
              icon="plus"
              labelPosition="left"
              onClick={handleAddElement}
              content="Add Pathogen"
              disabled={qmra.readOnly}
            />
          </Grid.Column>
          <Grid.Column width={12} />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={4}>
            <ElementsList
              items={qmra.inflow.map((e) => ({ id: e.id, name: e.name }))}
              onClick={handleSelectElement}
              onClone={handleCloneElement}
              onRemove={handleRemoveElement}
              readOnly={qmra.readOnly}
              selected={selectedElement ? selectedElement.id : undefined}
            />
          </Grid.Column>
          <Grid.Column width={12}>
            {selectedElement && (
              <PathogenForm
                groups={_.uniq(
                  defaultGroups.concat(qmra.inflow.filter((p) => !defaultGroups.includes(p.group)).map((p) => p.group))
                )}
                onChange={handleChangeSelected}
                readOnly={qmra.readOnly}
                selectedPathogen={Pathogen.fromObject(selectedElement)}
              />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {defaultDoseResponse && (
        <Modal onClose={handleCloseModal} open={true}>
          <Modal.Header>Do you want to import the default dose response for this pathogen?</Modal.Header>
          <Modal.Content>
            <DoseResponseForm readOnly={true} selectedDoseResponse={DoseResponse.fromObject(defaultDoseResponse)} />
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handleCloseModal}>No</Button>
            <Button content="Yes" icon="checkmark" labelPosition="right" primary onClick={handleAcceptModal} />
          </Modal.Actions>
        </Modal>
      )}
    </Segment>
  );
};

export default PathogenEditor;
