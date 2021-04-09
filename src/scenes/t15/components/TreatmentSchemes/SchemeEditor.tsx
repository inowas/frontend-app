import { Dropdown, DropdownProps, Grid, Segment } from 'semantic-ui-react';
import { SyntheticEvent, useEffect, useState } from 'react';
import ElementsList from '../ElementsList';
import ITreatmentScheme from '../../../../core/model/qmra/TreatmentScheme.type';
import Qmra from '../../../../core/model/qmra/Qmra';
import SchemeForm from './SchemeForm';
import TreatmentScheme from '../../../../core/model/qmra/TreatmentScheme';
import _ from 'lodash';

interface IProps {
  onChange: (qmra: Qmra) => void;
  qmra: Qmra;
}

const SchemeEditor = ({ qmra, onChange }: IProps) => {
  const [selectedElement, setSelectedElement] = useState<ITreatmentScheme>();

  const filteredProcesses = _.uniqBy(qmra.toObject().data.treatment.processes, 'name');

  useEffect(() => {
    if (!selectedElement && qmra.treatmentSchemes.length > 0) {
      setSelectedElement(qmra.treatmentSchemes[0].toObject());
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
    const element = qmra.treatmentSchemes.filter((tp) => tp.id === id);
    if (element.length > 0) {
      setSelectedElement(element[0].toObject());
    }
  };

  const handleAddElement = (e: SyntheticEvent<HTMLElement>, { value }: DropdownProps) => {
    const processes = qmra.treatmentProcesses.filter((p) => p.id === value);
    if (processes.length < 1) {
      return;
    }

    // TODO: Schemes are grouped by scheme name (add treatment process to treatment scheme)

    const cQmra = Qmra.fromObject(qmra.toObject());
    const newElement = TreatmentScheme.fromProcess(processes[0]);
    newElement.schemeId = qmra.treatmentSchemes.length > 0 ? 1 + Math.max(...qmra.treatmentSchemes.map((p) => p.schemeId)) : 1;
    cQmra.addElement(newElement);

    onChange(cQmra);
    setSelectedElement(newElement.toObject());
  };

  const handleCloneElement = (key: string | number) => {
    const elementToClone = qmra.toObject().data.treatment.schemes.filter((tp) => tp.id === key);
    if (elementToClone.length > 0) {
      const newElement = _.cloneDeep(elementToClone[0]);
      newElement.schemeId = qmra.treatmentSchemes.length > 0 ? 1 + Math.max(...qmra.treatmentSchemes.map((p) => p.schemeId)) : 1;
      const cQmra = Qmra.fromObject(qmra.toObject()).addElement(TreatmentScheme.fromObject(newElement));
      onChange(cQmra);
    }
  };

  const handleRemoveElement = (key: string | number) => {
    const elementToRemove = qmra.toObject().data.treatment.schemes.filter((e) => e.id === key);
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
              disabled={qmra.readOnly || filteredProcesses.length === 0}
              floating
              fluid
              labeled
              icon="add"
              options={filteredProcesses.map((p) => ({ key: p.id, text: p.name, value: p.id }))}
              onChange={handleAddElement}
              text="Add Scheme"
            />
          </Grid.Column>
          <Grid.Column width={12} />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={4}>
            <ElementsList
              items={qmra.treatmentSchemes.map((t) => ({ id: t.id, name: t.name }))}
              onClick={handleSelectElement}
              onClone={handleCloneElement}
              onRemove={handleRemoveElement}
              readOnly={qmra.readOnly}
              selected={selectedElement ? selectedElement.id : undefined}
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
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default SchemeEditor;
