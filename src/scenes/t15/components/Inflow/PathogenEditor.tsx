import {Button, Grid, Label, Modal, Segment} from 'semantic-ui-react';
import {doseResponseDefaults} from '../defaults/doseResponse';
import {useEffect, useState} from 'react';
import DoseResponse from '../../../../core/model/qmra/DoseResponse';
import DoseResponseForm from '../DoseResponse/DoseResponseForm';
import ElementsList from '../ElementsList';
import Health from '../../../../core/model/qmra/Health';
import HealthForm from '../Health/HealthForm';
import IDoseResponse from '../../../../core/model/qmra/DoseResponse.type';
import IHealth from '../../../../core/model/qmra/Health.type';
import IPathogen from '../../../../core/model/qmra/Pathogen.type';
import InfoBox from '../InfoBox';
import Pathogen from '../../../../core/model/qmra/Pathogen';
import PathogenForm from './PathogenForm';
import Qmra from '../../../../core/model/qmra/Qmra';
import _ from 'lodash';
import descriptions from '../defaults/descriptions';
import healthDefaults from '../defaults/health';

interface IProps {
  onChange: (qmra: Qmra) => void;
  qmra: Qmra;
}

const defaultGroups = ['Bacteria', 'Protozoa', 'Virus'];

const PathogenEditor = ({qmra, onChange}: IProps) => {
  const [defaultDoseResponse, setDefaultDoseResponse] = useState<IDoseResponse>();
  const [defaultHealth, setDefaultHealth] = useState<IHealth>();
  const [selectedDoseResponse, setSelectedDoseResponse] = useState<IDoseResponse>();
  const [selectedElement, setSelectedElement] = useState<IPathogen>();
  const [selectedHealth, setSelectedHealth] = useState<IHealth>();

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
    const healths = cQmra.data.health.filter((h) => h.pathogenId === p.id);
    if (doseResponses.length < 1 || healths.length < 1 || !selectedElement) {
      return;
    }
    let cDoseResponse = doseResponses[0];
    cDoseResponse.pathogenName = p.name;
    cDoseResponse.pathogenGroup = p.group;

    let cHealth = healths[0];
    cHealth.pathogenName = p.name;

    setSelectedDoseResponse(DoseResponse.fromObject(cDoseResponse).toObject());
    setSelectedHealth(Health.fromObject(cHealth).toObject());

    if (p.name !== selectedElement.name) {
      setSelectedElement(p.toObject());
      const defaultDoseResponses = doseResponseDefaults.filter((d) => d.pathogenName === p.name);
      if (defaultDoseResponses.length > 0) {
        cDoseResponse = {
          ...defaultDoseResponses[0],
          id: cDoseResponse.id,
          pathogenId: p.id,
        };
        setDefaultDoseResponse(cDoseResponse);
      }
      const defaultHealth = healthDefaults.filter((h) => h.pathogenName === p.name);
      if (defaultHealth.length > 0) {
        cHealth = {
          ...defaultHealth[0],
          id: cHealth.id,
          pathogenId: p.id
        };
        setDefaultHealth(cHealth);
      }

      if (defaultHealth.length > 0 || defaultDoseResponses.length > 0) {
        return;
      }
    }

    handleDispatch(
      p,
      [DoseResponse.fromObject(cDoseResponse), Health.fromObject(cHealth)]
    );
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
    const newDoseResponse = DoseResponse.fromPathogen(newElement);
    const newHealth = Health.fromPathogen(newElement);
    const cQmra = Qmra.fromObject(qmra.toObject()).addElement(newElement).addElement(newDoseResponse)
      .addElement(newHealth);
    setSelectedElement(newElement.toObject());
    onChange(cQmra);
  };

  const handleCloneElement = (key: string | number) => {
    const elementToClone = qmra.toObject().data.inflow.filter((e) => e.id === key);
    if (elementToClone.length > 0) {
      const newElement = _.cloneDeep(elementToClone[0]);
      newElement.id = qmra.inflow.length > 0 ? 1 + Math.max(...qmra.inflow.map((p) => p.id)) : 1;
      const newDoseResponse = DoseResponse.fromPathogen(Pathogen.fromObject(newElement));
      const newHealth = Health.fromPathogen(Pathogen.fromObject(newElement));
      const cQmra = Qmra.fromObject(qmra.toObject()).addElement(Pathogen.fromObject(newElement))
        .addElement(newDoseResponse).addElement(newHealth);
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

  const handleToggleElement = (key: string | number) => {
    const cPathogens = qmra.inflow.map((p) => {
      if (p.id === key) {
        p.simulate = p.simulate === 1 ? 0 : 1;
      }
      return p.toObject();
    })

    const cQmra = qmra.toObject();
    cQmra.data.inflow = cPathogens;
    onChange(Qmra.fromObject(cQmra));
  };

  const handleDispatch = (p: Pathogen, elements: Array<DoseResponse | Health>) => {
    setSelectedElement(p.toObject());

    const cQmra = Qmra.fromObject(qmra.toObject()).updateElement(p);
    elements.forEach((e) => {
      cQmra.updateElement(e);
    });

    onChange(cQmra);
    setSelectedDoseResponse(undefined);
    setDefaultDoseResponse(undefined);
    setDefaultHealth(undefined);
  };

  const handleAcceptModal = () => {
    if (!selectedElement || (!defaultDoseResponse && !defaultHealth)) {
      setDefaultDoseResponse(undefined);
      setDefaultHealth(undefined);
      return;
    }
    const elements = [];
    if (defaultDoseResponse) { elements.push(DoseResponse.fromObject(defaultDoseResponse)); }
    if (defaultHealth) { elements.push(Health.fromObject(defaultHealth)); }
    handleDispatch(Pathogen.fromObject(selectedElement), elements);
    setDefaultDoseResponse(undefined);
    setDefaultHealth(undefined);
  };

  const handleCloseModal = () => {
    if (!selectedElement || (!selectedDoseResponse && !selectedHealth)) {
      setDefaultDoseResponse(undefined);
      setDefaultHealth(undefined);
      return;
    }
    const elements = [];
    if (selectedDoseResponse) { elements.push(DoseResponse.fromObject(selectedDoseResponse)); }
    if (selectedHealth) { elements.push(Health.fromObject(selectedHealth)); }
    handleDispatch(Pathogen.fromObject(selectedElement), elements);
    setDefaultDoseResponse(undefined);
    setDefaultHealth(undefined);
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
          <Grid.Column width={12}/>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={4}>
            <ElementsList
              items={qmra.inflow.map((e) => ({id: e.id, name: e.name, isActive: e.simulate === 1}))}
              onClick={handleSelectElement}
              onClone={handleCloneElement}
              onRemove={handleRemoveElement}
              onToggle={handleToggleElement}
              readOnly={qmra.readOnly}
              selected={selectedElement ? selectedElement.id : undefined}
              type="checkbox"
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
      <InfoBox header="Inflow concentration of pathogens" description={descriptions.inflow}/>
      {(defaultDoseResponse || defaultHealth) && (
        <Modal onClose={handleCloseModal} open={true}>
          <Modal.Header>Do you want to import the defaults for this pathogen?</Modal.Header>
          <Modal.Content>
            {defaultDoseResponse &&
            <Segment>
              <Label color="blue" ribbon>
                Dose Response
              </Label>
              <DoseResponseForm readOnly={true} selectedDoseResponse={DoseResponse.fromObject(defaultDoseResponse)}/>
            </Segment>
            }
            {defaultHealth &&
            <Segment>
              <Label color="blue" ribbon>
                Health
              </Label>
              <HealthForm readOnly={true} selectedHealth={Health.fromObject(defaultHealth)}/>
            </Segment>
            }
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handleCloseModal}>No</Button>
            <Button content="Yes" icon="checkmark" labelPosition="right" primary onClick={handleAcceptModal}/>
          </Modal.Actions>
        </Modal>
      )}
    </Segment>
  );
};

export default PathogenEditor;
