import {Dropdown, DropdownProps, Grid, Icon, Label, Segment} from 'semantic-ui-react';
import ElementsList from '../ElementsList';
import ITreatmentScheme from '../../../../core/model/qmra/TreatmentScheme.type';
import Qmra from '../../../../core/model/qmra/Qmra';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import SchemeForm from './SchemeForm';
import TreatmentScheme from '../../../../core/model/qmra/TreatmentScheme';
import _ from 'lodash';

interface IProps {
  onChange: (qmra: Qmra) => void;
  qmra: Qmra;
}

const SchemeEditor = ({qmra, onChange}: IProps) => {
  const [selectedElement, setSelectedElement] = useState<ITreatmentScheme>();

  const filteredSchemes = _.uniqBy(
    qmra.treatmentSchemes.map((ts) => ({id: ts.schemeId, name: ts.name})),
    'id'
  );
  const addedProcesses = selectedElement
    ? qmra.treatmentSchemes.filter((ts) => ts.schemeId === selectedElement.schemeId)
    : [];
  const remainingProcesses = _.uniqBy(
    qmra.treatmentProcesses.filter((tp) => addedProcesses.filter((t) => t.treatmentId === tp.processId).length === 0),
    'processId'
  );

  useEffect(() => {
    if (!selectedElement && qmra.treatmentSchemes.length > 0) {
      setSelectedElement(qmra.treatmentSchemes[0].toObject());
    }
    if (
      selectedElement &&
      qmra.treatmentSchemes.filter((ts) => selectedElement.schemeId === ts.schemeId).length === 0
    ) {
      if (qmra.treatmentSchemes.length === 0) {
        setSelectedElement(undefined);
      } else {
        setSelectedElement(qmra.treatmentSchemes[0].toObject());
      }
    }
    if (selectedElement && qmra.treatmentSchemes.length === 0) {
      setSelectedElement(undefined);
    }
  }, [qmra, selectedElement]);

  const handleChangeSelected = (ts: TreatmentScheme) => {
    setSelectedElement(ts.toObject());
    onChange(qmra.updateElement(ts));
  };

  const handleSelectElement = (id: number | string) => {
    const element = qmra.treatmentSchemes.filter((tp) => tp.schemeId === id);
    if (element.length > 0) {
      setSelectedElement(element[0].toObject());
    }
  };

  const handleAddElement = (e: SyntheticEvent<HTMLElement>, {value}: DropdownProps) => {
    const processes = qmra.treatmentProcesses.filter((p) => p.id === value);
    if (processes.length < 1) {
      return;
    }

    const cQmra = Qmra.fromObject(qmra.toObject());
    const newElement = TreatmentScheme.fromProcess(processes[0]);
    newElement.schemeId =
      qmra.treatmentSchemes.length > 0 ? 1 + Math.max(...qmra.treatmentSchemes.map((p) => p.schemeId)) : 1;
    cQmra.addElement(newElement);

    onChange(cQmra);
    setSelectedElement(newElement.toObject());
  };

  const handleAddProcess = (e: SyntheticEvent<HTMLElement>, {value}: DropdownProps) => {
    const processes = qmra.treatmentProcesses.filter((p) => p.id === value);
    if (processes.length < 1 || !selectedElement) {
      return;
    }

    const cQmra = Qmra.fromObject(qmra.toObject());
    const newElement = TreatmentScheme.fromProcess(processes[0]);
    newElement.schemeId = selectedElement.schemeId;
    cQmra.addElement(newElement);

    onChange(cQmra);
    setSelectedElement(newElement.toObject());
  };

  const handleRemoveElement = (key: string | number) => {
    const cQmra = qmra.toObject();
    cQmra.data.treatment.schemes = cQmra.data.treatment.schemes.filter((e) => e.schemeId !== key);
    onChange(Qmra.fromObject(cQmra));
  };

  const handleRemoveProcess = (id: number) => () => {
    if (!selectedElement) {
      return;
    }
    const elementToRemove = qmra
      .toObject()
      .data.treatment.schemes.filter((e) => e.treatmentId === id && e.schemeId === selectedElement.schemeId);
    if (elementToRemove.length > 0) {
      const cQmra = qmra.removeElement(TreatmentScheme.fromObject(elementToRemove[0]));
      onChange(cQmra);
    }
  };

  return (
    <Segment color={'grey'}>
      <Grid>
        <Grid.Row>
          <Grid.Column width={4}>
            <Dropdown
              button
              className="icon positive"
              disabled={qmra.readOnly || qmra.treatmentProcesses.length === 0}
              floating
              fluid
              labeled
              icon="add"
              options={_.uniqBy(qmra.treatmentProcesses, 'processId').map((p) => ({
                key: p.id,
                text: p.name,
                value: p.id,
              }))}
              onChange={handleAddElement}
              text="Add Scheme"
            />
          </Grid.Column>
          <Grid.Column width={12}/>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={4}>
            <ElementsList
              items={filteredSchemes}
              onClick={handleSelectElement}
              onRemove={handleRemoveElement}
              readOnly={qmra.readOnly}
              selected={selectedElement ? selectedElement.schemeId : undefined}
            />
          </Grid.Column>
          <Grid.Column width={12}>
            {selectedElement && (
              <SchemeForm
                onChange={handleChangeSelected}
                readOnly={qmra.readOnly}
                selectedScheme={TreatmentScheme.fromObject(selectedElement)}
              />
            )}
            {addedProcesses.length > 0 && (
              <Segment>
                <Label.Group>
                  {addedProcesses.map((tp) => (
                    <Label color="blue" key={tp.id}>
                      {tp.treatmentName} <Icon name="delete" onClick={handleRemoveProcess(tp.treatmentId)}/>
                    </Label>
                  ))}
                </Label.Group>
              </Segment>
            )}
            {selectedElement &&
            <Dropdown
              button
              className="icon positive"
              disabled={qmra.readOnly || remainingProcesses.length === 0}
              floating
              fluid
              labeled
              icon="add"
              options={remainingProcesses.map((p) => ({key: p.id, text: p.name, value: p.id}))}
              onChange={handleAddProcess}
              text="Add treatment process"
            />
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default SchemeEditor;
