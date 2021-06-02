import {Button, Dropdown, DropdownProps, Grid, Segment} from 'semantic-ui-react';
import {SyntheticEvent, useEffect, useState} from 'react';
import ElementsList from '../ElementsList';
import ExposureForm from './ExposureForm';
import ExposureScenario from '../../../../core/model/qmra/ExposureScenario';
import IExposureScenario from '../../../../core/model/qmra/ExposureScenario.type';
import InfoBox from '../InfoBox';
import Qmra from '../../../../core/model/qmra/Qmra';
import _ from 'lodash';
import descriptions from '../defaults/descriptions';
import scenarios from '../defaults/exposure';
import uuid from 'uuid';

interface IProps {
  onChange: (qmra: Qmra) => void;
  qmra: Qmra;
}

const ExposureEditor = ({qmra, onChange}: IProps) => {
  const [selectedElement, setSelectedElement] = useState<IExposureScenario>();

  useEffect(() => {
    if (!selectedElement && qmra.exposureScenarios.length > 0) {
      setSelectedElement(qmra.exposureScenarios[0].toObject());
    }
    if (selectedElement && qmra.exposureScenarios.length === 0) {
      setSelectedElement(undefined);
    }
  }, [qmra, selectedElement]);

  const handleDispatch = (e: IExposureScenario[]) => {
    const cQmra = qmra.toObject();
    cQmra.data.exposureScenarios = e;
    onChange(Qmra.fromObject(cQmra));
  };

  const handleChangeSelected = (ce: ExposureScenario) => {
    setSelectedElement(ce.toObject());
    const cExposure = qmra.exposureScenarios.map((e) => {
      if (e.id === ce.id) {
        return ce.toObject();
      }
      return e.toObject();
    });
    handleDispatch(cExposure);
  };

  const handleSelectElement = (id: number | string) => {
    const item = qmra.exposureScenarios.filter((e) => e.id === id);
    if (item.length > 0) {
      setSelectedElement(item[0].toObject());
    }
  };

  const handleAddElement = (e: SyntheticEvent<HTMLElement>, {value}: DropdownProps) => {
    let newElement = ExposureScenario.fromDefaults();

    if (typeof value === 'number' && value >= 0 && scenarios.length > value) {
      newElement = ExposureScenario.fromObject(scenarios[value]);
      newElement.id = uuid.v4();
    }

    if (qmra.exposureScenarios.filter((e) => e.isActive).length === 0) {
      newElement.isActive = true;
    }

    const cQmra = qmra.addElement(newElement);
    setSelectedElement(newElement.toObject());
    onChange(cQmra);
  };

  const handleCloneElement = (key: string | number) => {
    const elementToClone = qmra.toObject().data.exposureScenarios.filter((e) => e.id === key);
    if (elementToClone.length > 0) {
      const newElement = _.cloneDeep(elementToClone[0]);
      newElement.id = uuid.v4();
      newElement.isActive = false;
      const cQmra = qmra.addElement(ExposureScenario.fromObject(newElement));
      setSelectedElement(newElement);
      onChange(cQmra);
    }
  };

  const handleRemoveElement = (key: string | number) => {
    const elementToRemove = qmra.toObject().data.exposureScenarios.filter((e) => e.id === key);
    if (elementToRemove.length > 0) {
      const cQmra = qmra.removeElement(ExposureScenario.fromObject(elementToRemove[0]));
      if (cQmra.exposureScenarios.length > 0 &&
        cQmra.exposureScenarios.filter((e) => e.isActive).length === 0) {
        cQmra.exposureScenarios = cQmra.exposureScenarios.map((e, key) => {
          if (key === 0) {
            e.isActive = true;
          }
          return e;
        })
      }
      onChange(cQmra);
    }
  };

  const handleToggleElement = (key: string | number) => {
    const cScenarios = qmra.exposureScenarios.map((e) => {
      e.isActive = e.id === key;
      return e.toObject();
    })
    const cQmra = qmra.toObject();
    cQmra.data.exposureScenarios = cScenarios;
    onChange(Qmra.fromObject(cQmra));
  };

  return (
    <Segment color={'grey'}>
      <Grid>
        <Grid.Row>
          <Grid.Column width={4}>
            <Button.Group fluid>
              <Dropdown
                text="Add Scenario"
                icon="plus"
                button
                floating
                labeled
                className="icon primary"
                options={
                  [{text: 'New Exposure', value: -1, key: -1}].concat(
                  scenarios.map((s, key) => {
                    return {
                      text: s.name, value: key, key
                    }
                  }))
                }
                onChange={handleAddElement}
              />
            </Button.Group>
          </Grid.Column>
          <Grid.Column width={12}/>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={4}>
            <ElementsList
              items={qmra.exposureScenarios.filter((e) => e.id)
                .map((e) => ({id: e.id as string, name: e.name, isActive: e.isActive}))}
              onClick={handleSelectElement}
              onClone={handleCloneElement}
              onRemove={handleRemoveElement}
              onToggle={handleToggleElement}
              readOnly={qmra.readOnly}
              selected={selectedElement ? selectedElement.id : undefined}
              type="radio"
            />
          </Grid.Column>
          <Grid.Column width={12}>
            {selectedElement && (
              <ExposureForm
                onChange={handleChangeSelected}
                readOnly={qmra.readOnly}
                selectedExposure={ExposureScenario.fromObject(selectedElement)}
              />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <InfoBox header="Exposure Scenario" description={descriptions.exposure}/>
    </Segment>
  );
};

export default ExposureEditor;
