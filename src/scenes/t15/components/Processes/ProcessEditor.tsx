import {Button, Dropdown, DropdownProps, Grid, Segment} from 'semantic-ui-react';
import {ITreatmentProcess} from '../../../../core/model/qmra/TreatmentProcess.type';
import ElementsList from '../ElementsList';
import InfoBox from '../InfoBox';
import ProcessForm from './ProcessForm';
import ProcessGroupForm from './ProcessGroupForm';
import ProcessSelection from './ProcessSelection';
import Qmra from '../../../../core/model/qmra/Qmra';
import React, {useEffect, useState} from 'react';
import TreatmentProcess from '../../../../core/model/qmra/TreatmentProcess';
import _ from 'lodash';
import descriptions from '../defaults/descriptions.json';
import treatmentRemovals from '../defaults/treatmentRemovals.json';
import uuid from 'uuid';

interface IProps {
  onChange: (qmra: Qmra) => void;
  qmra: Qmra;
}

const ProcessEditor = ({qmra, onChange}: IProps) => {
  const [selectedElement, setSelectedElement] = useState<ITreatmentProcess>();
  const [showDefaultSelection, setShowDefaultSelection] = useState<boolean>(false);

  const groups = _.uniq(qmra.inflow.map((i) => i.group));

  const filteredGroups = selectedElement
    ? groups.filter(
      (g) =>
        !qmra.treatmentProcesses
          .filter((t) => t.processId === selectedElement.processId)
          .map((t) => t.pathogenGroup)
          .includes(g)
    )
    : [];

  useEffect(() => {
    if (!selectedElement && qmra.treatmentProcesses.length > 0) {
      setSelectedElement(qmra.treatmentProcesses[0].toObject());
    }
    if (selectedElement && qmra.treatmentProcesses.length === 0) {
      setSelectedElement(undefined);
    }
  }, [qmra, selectedElement]);

  const handleDispatch = (e: ITreatmentProcess[]) => {
    const cQmra = qmra.toObject();
    cQmra.data.treatment.processes = e;
    onChange(Qmra.fromObject(cQmra));
  };

  const handleChangeProcess = (tp: TreatmentProcess) => {
    const cTreatmentProcess = qmra.treatmentProcesses.map((t) => {
      if (tp.id === t.id) {
        return tp.toObject();
      }
      return t.toObject();
    });
    handleDispatch(cTreatmentProcess);
  };

  const handleChangeSelected = (tp: TreatmentProcess) => {
    setSelectedElement(tp.toObject());
    onChange(qmra.updateElement(tp));
  };

  const handleSelectElement = (id: number | string) => {
    const element = qmra.treatmentProcesses.filter((tp) => tp.processId === id);
    if (element.length > 0) {
      setSelectedElement(element[0].toObject());
    }
  };

  const handleAddNewElement = () => handleAddElement();

  const handleAddElement = (name?: string, group?: string) => {
    if (qmra.inflow.length < 1) {
      return;
    }

    const cQmra = Qmra.fromObject(qmra.toObject());
    const newElements: TreatmentProcess[] = [];
    const processId =
      qmra.treatmentProcesses.length > 0 ? 1 + Math.max(...qmra.treatmentProcesses.map((p) => p.processId)) : 1;

    groups.forEach((g) => {
      const newElement = TreatmentProcess.fromPathogenGroup(g);
      newElement.processId = processId;
      if (name && group) {
        newElement.name = name;
        newElement.group = group;
        const defaults = treatmentRemovals.filter((tr) =>
          tr.TreatmentName === name && tr.TreatmentGroup === group && tr.PathogenGroup === g);
        if (defaults.length > 0) {
          newElement.min = defaults[0].Min;
          newElement.max = defaults[0].Max;
          newElement.reference = defaults[0].ReferenceName;
        }
      }
      newElements.push(newElement);
      cQmra.addElement(newElement);
    });

    onChange(cQmra);
    setSelectedElement(newElements[0].toObject());
    setShowDefaultSelection(false);
  };

  const handleAddPathogenGroup = (e: React.SyntheticEvent, {value}: DropdownProps) => {
    if (typeof value !== 'string' || !selectedElement) {
      return;
    }
    const cQmra = Qmra.fromObject(qmra.toObject());
    const newElement = TreatmentProcess.fromPathogenGroup(value);
    newElement.processId = selectedElement.processId;
    cQmra.addElement(newElement);
    onChange(cQmra);
  };

  const handleCloneElement = (key: string | number) => {
    const elementToClone = qmra.toObject().data.treatment.processes.filter((tp) => tp.id === key);
    if (elementToClone.length > 0) {
      const newElement = _.cloneDeep(elementToClone[0]);
      newElement.id = uuid.v4();
      const cQmra = Qmra.fromObject(qmra.toObject()).addElement(TreatmentProcess.fromObject(newElement));
      onChange(cQmra);
    }
  };

  const handleRemoveElement = (key: string | number) => {
    const cQmra = qmra;
    qmra
      .toObject()
      .data.treatment.processes.filter((tp) => tp.processId === key)
      .forEach((p) => {
        cQmra.removeElement(TreatmentProcess.fromObject(p));
      });
    onChange(cQmra);
  };

  const handleRemoveProcess = (tp: TreatmentProcess) => {
    const cQmra = qmra.removeElement(TreatmentProcess.fromObject(tp));
    onChange(cQmra);
  };

  const handleToggleSelection = () => setShowDefaultSelection(!showDefaultSelection);

  return (
    <Segment color={'grey'}>
      <Grid>
        <Grid.Row>
          <Grid.Column width={4}>
            <Button.Group fluid>
              <Button
                positive={true}
                icon="plus"
                labelPosition="left"
                onClick={handleAddNewElement}
                content="Add Process"
                disabled={qmra.readOnly}
              />
              <Button icon="list" onClick={handleToggleSelection} primary/>
            </Button.Group>
          </Grid.Column>
          <Grid.Column width={12}/>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={4}>
            <ElementsList
              items={_.uniqBy(qmra.treatmentProcesses, 'processId').map((e) => ({id: e.processId, name: e.name}))}
              onClick={handleSelectElement}
              onClone={handleCloneElement}
              onRemove={handleRemoveElement}
              readOnly={qmra.readOnly}
              selected={selectedElement ? selectedElement.processId : undefined}
            />
          </Grid.Column>
          <Grid.Column width={12}>
            {selectedElement && (
              <React.Fragment>
                <ProcessForm
                  onChange={handleChangeSelected}
                  readOnly={qmra.readOnly}
                  selectedProcess={TreatmentProcess.fromObject(selectedElement)}
                />
                {selectedElement ? (
                  qmra.treatmentProcesses
                    .filter((p) => p.processId === selectedElement.processId)
                    .map((p) => (
                      <ProcessGroupForm
                        key={p.id}
                        onChange={handleChangeProcess}
                        onRemove={handleRemoveProcess}
                        readOnly={qmra.readOnly}
                        process={p}
                      />
                    ))
                ) : (
                  <div/>
                )}
                <Dropdown
                  button
                  className="icon positive"
                  disabled={qmra.readOnly || filteredGroups.length === 0}
                  floating
                  fluid
                  labeled
                  icon="add"
                  options={filteredGroups.map((g) => ({key: g, text: g, value: g}))}
                  onChange={handleAddPathogenGroup}
                  text="Add Pathogen Group"
                />
              </React.Fragment>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <InfoBox header="Treatment Train" description={descriptions.processes}/>
      {showDefaultSelection && <ProcessSelection onAdd={handleAddElement} onClose={handleToggleSelection}/>}
    </Segment>
  );
};

export default ProcessEditor;
