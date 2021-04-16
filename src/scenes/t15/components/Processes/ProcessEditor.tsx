import { Button, Dropdown, DropdownProps, Grid, Segment } from 'semantic-ui-react';
import { ITreatmentProcess } from '../../../../core/model/qmra/TreatmentProcess.type';
import ElementsList from '../ElementsList';
import ProcessForm from './ProcessForm';
import ProcessGroupForm from './ProcessGroupForm';
import Qmra from '../../../../core/model/qmra/Qmra';
import React, { useEffect, useState } from 'react';
import TreatmentProcess from '../../../../core/model/qmra/TreatmentProcess';
import _ from 'lodash';
import uuid from 'uuid';

interface IProps {
  onChange: (qmra: Qmra) => void;
  qmra: Qmra;
}

const ProcessEditor = ({ qmra, onChange }: IProps) => {
  const [selectedElement, setSelectedElement] = useState<ITreatmentProcess>();

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

  const handleAddElement = () => {
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
      newElements.push(newElement);
      cQmra.addElement(newElement);
    });

    onChange(cQmra);
    setSelectedElement(newElements[0].toObject());
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
              content="Add Process"
              disabled={qmra.readOnly}
            />
          </Grid.Column>
          <Grid.Column width={12} />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={4}>
            <ElementsList
              items={_.uniqBy(qmra.treatmentProcesses, 'processId').map((e) => ({ id: e.processId, name: e.name }))}
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
                  <div />
                )}
                <Dropdown
                  button
                  className="icon positive"
                  disabled={qmra.readOnly || filteredGroups.length === 0}
                  floating
                  fluid
                  labeled
                  icon="add"
                  options={filteredGroups.map((g) => ({ key: g, text: g, value: g }))}
                  onChange={handleAddPathogenGroup}
                  text="Add Pathogen Group"
                />
              </React.Fragment>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default ProcessEditor;
