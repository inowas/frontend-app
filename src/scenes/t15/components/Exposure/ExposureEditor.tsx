import {Button, Grid, Segment} from 'semantic-ui-react';
import { IPropertyValueObject } from '../../../../core/model/types';
import { exposureColumns } from '../defaults/columns';
import { useEffect, useState } from 'react';
import CsvUpload from '../shared/CsvUpload';
import ElementsList from '../ElementsList';
import Exposure from '../../../../core/model/qmra/Exposure';
import ExposureForm from './ExposureForm';
import IExposure from '../../../../core/model/qmra/Exposure.type';
import InfoBox from '../InfoBox';
import Qmra from '../../../../core/model/qmra/Qmra';
import _ from 'lodash';
import descriptions from '../defaults/descriptions';
import uuid from 'uuid';

interface IProps {
  onChange: (qmra: Qmra) => void;
  qmra: Qmra;
}

const ExposureEditor = ({ qmra, onChange }: IProps) => {
  const [selectedElement, setSelectedElement] = useState<IExposure>();

  useEffect(() => {
    if (!selectedElement && qmra.exposure.length > 0) {
      setSelectedElement(qmra.exposure[0].toObject());
    }
    if (selectedElement && qmra.exposure.length === 0) {
      setSelectedElement(undefined);
    }
  }, [qmra, selectedElement]);

  const handleDispatch = (e: IExposure[]) => {
    const cQmra = qmra.toObject();
    cQmra.data.exposure = e;
    onChange(Qmra.fromObject(cQmra));
  };

  const handleChangeSelected = (ce: Exposure) => {
    setSelectedElement(ce.toObject());
    const cExposure = qmra.exposure.map((e) => {
      if (e.id === ce.id) {
        return ce.toObject();
      }
      return e.toObject();
    });
    handleDispatch(cExposure);
  };

  const handleSelectElement = (id: number | string) => {
    const item = qmra.exposure.filter((e) => e.id === id);
    if (item.length > 0) {
      setSelectedElement(item[0].toObject());
    }
  };

  const handleAddElement = () => {
    const newElement = Exposure.fromDefaults();
    const cQmra = qmra.addElement(newElement);
    setSelectedElement(newElement.toObject());
    onChange(cQmra);
  };

  const handleCloneElement = (key: string | number) => {
    const elementToClone = qmra.toObject().data.exposure.filter((e) => e.id === key);
    if (elementToClone.length > 0) {
      const newElement = _.cloneDeep(elementToClone[0]);
      newElement.id = uuid.v4();
      const cQmra = qmra.addElement(Exposure.fromObject(newElement));
      setSelectedElement(newElement);
      onChange(cQmra);
    }
  };

  const handleRemoveElement = (key: string | number) => {
    const elementToClone = qmra.toObject().data.exposure.filter((e) => e.id === key);
    if (elementToClone.length > 0) {
      const cQmra = qmra.removeElement(Exposure.fromObject(elementToClone[0]));
      onChange(cQmra);
    }
  };

  const handleUpload = (results: IPropertyValueObject[]) => {
    const cQmra = Qmra.fromObject(qmra.toObject());
    results.forEach((row) => {
      cQmra.addElement(Exposure.fromCsv(row));
    });
    onChange(cQmra);
  };

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
                onClick={handleAddElement}
                content="Add Exposure"
                disabled={qmra.readOnly}
              />
              <CsvUpload columns={exposureColumns} onChange={handleUpload} />
            </Button.Group>
          </Grid.Column>
          <Grid.Column width={12} />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={4}>
            <ElementsList
              items={qmra.exposure.map((e) => ({ id: e.id, name: e.name }))}
              onClick={handleSelectElement}
              onClone={handleCloneElement}
              onRemove={handleRemoveElement}
              readOnly={qmra.readOnly}
              selected={selectedElement ? selectedElement.id : undefined}
            />
          </Grid.Column>
          <Grid.Column width={12}>
            {selectedElement && (
              <ExposureForm
                onChange={handleChangeSelected}
                readOnly={qmra.readOnly}
                selectedExposure={Exposure.fromObject(selectedElement)}
              />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <InfoBox header="Exposure Scenario" description={descriptions.exposure} />
    </Segment>
  );
};

export default ExposureEditor;
