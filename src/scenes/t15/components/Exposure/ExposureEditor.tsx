import {Button, DropdownProps, Form, Grid, InputProps, Segment} from 'semantic-ui-react';
import {ChangeEvent, SyntheticEvent, useCallback, useEffect} from 'react';
import {usePrevious} from '../../shared/simpleTools/helpers/customHooks';
import Exposure from '../../../core/model/qmra/Exposure';
import IExposure from '../../../core/model/qmra/Exposure.type';
import ItemsList from './ItemsList';
import Qmra from '../../../core/model/qmra/Qmra';
import React, {useState} from 'react';
import _ from 'lodash';
import uuid from 'uuid';

interface IProps {
  onChange: (qmra: Qmra) => void;
  qmra: Qmra;
}

const ExposureEditor = ({qmra, onChange}: IProps) => {
  const [activeInput, setActiveInput] = useState<null | string>(null);
  const [activeValue, setActiveValue] = useState<string>('');
  const [exposure, setExposure] = useState<IExposure[]>(qmra.toObject().data.exposure);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<IExposure>();

  const prevSelectedItem = usePrevious<IExposure>(selectedItem);

  const handleDispatch = useCallback((e: IExposure[]) => {
    const cQmra = qmra.toObject();
    cQmra.data.exposure = e;
    onChange(Qmra.fromObject(cQmra));
  }, [qmra, onChange]);

  const handleSave = useCallback(() => {
    if (!selectedItem || !isDirty) {
      return false;
    }

    const cExposure = exposure.map((e) => {
      if (e.id === selectedItem.id) {
        return selectedItem;
      }
      return e;
    });
    handleDispatch(cExposure);
    setIsDirty(false);
  }, [exposure, handleDispatch, isDirty, selectedItem]);

  useEffect(() => {
    return () => {
      handleSave();
    };
  }, [handleSave]);

  useEffect(() => {
    setExposure(qmra.toObject().data.exposure);
    if (!selectedItem && qmra.exposure.length > 0) {
      setSelectedItem(qmra.exposure[0].toObject());
    }
    if (selectedItem && qmra.exposure.length === 0) {
      setSelectedItem(undefined);
    }
  }, [qmra, selectedItem]);

  useEffect(() => {
    if (isDirty && prevSelectedItem && selectedItem && selectedItem.id !== prevSelectedItem.id) {
      const cExposure = exposure.map((e) => {
        if (e.id === prevSelectedItem.id) {
          return prevSelectedItem;
        }
        return e;
      });
      handleDispatch(cExposure);
      setIsDirty(false);
    }
  }, [exposure, handleDispatch, isDirty, prevSelectedItem, selectedItem]);

  const handleBlur = (type?: string) => () => {
    if (!selectedItem || !activeInput) {
      return null;
    }

    setSelectedItem({
      ...selectedItem,
      [activeInput]: type === 'number' ? parseFloat(activeValue) : activeValue
    });
    setActiveInput(null);
    setIsDirty(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputProps) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  const handleClickAddItem = () => {
    const cExposure = _.cloneDeep(exposure);
    const newExposure = Exposure.fromDefaults().toObject();
    cExposure.push(newExposure);
    handleDispatch(cExposure);
    setSelectedItem(newExposure);
  };

  const handleClickItem = (id: number | string) => {
    const item = exposure.filter((e) => e.id === id);
    if (item.length > 0) {
      setSelectedItem(_.cloneDeep(item[0]));
    }
  };

  const handleCloneItem = (id: number | string) => {
    const cExposure = _.cloneDeep(exposure);
    const itemToClone = exposure.filter((e) => e.id === id);
    if (itemToClone.length > 0) {
      const newItem = _.cloneDeep(itemToClone[0]);
      newItem.id = uuid.v4();
      cExposure.push(newItem);
      handleDispatch(cExposure);
    }
  };

  const handleRemoveItem = (id: number | string) => {
    const cExposure = exposure.filter((e) => e.id !== id);
    handleDispatch(cExposure);
  };

  const handleSelect = (e: SyntheticEvent, {name, value}: DropdownProps) => {
    if (!selectedItem) {
      return null;
    }

    const cSelected = {
      ...selectedItem,
      [name]: value
    };

    setIsDirty(true);
    setSelectedItem(cSelected);
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
              onClick={handleClickAddItem}
              content="Add Exposure"
              disabled={qmra.readOnly}
            />
          </Grid.Column>
          <Grid.Column width={12}>
            <Button
              disabled={!isDirty}
              floated="right"
              primary={true}
              onClick={handleSave}
            >Save</Button>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={4}>
            <ItemsList
              items={exposure.map((e) => ({id: e.id, name: e.name}))}
              onClick={handleClickItem}
              onClone={handleCloneItem}
              onRemove={handleRemoveItem}
              readOnly={qmra.readOnly}
              selected={selectedItem ? selectedItem.id : undefined}
            />
          </Grid.Column>
          <Grid.Column width={12}>
            {selectedItem &&
            <Form>
              <Form.Group widths='equal'>
                <Form.Field>
                  <Form.Input
                    label="Name"
                    name="name"
                    onBlur={handleBlur()}
                    onChange={handleChange}
                    readOnly={qmra.readOnly}
                    value={activeInput === 'name' ? activeValue : selectedItem.name}
                  />
                </Form.Field>
                <Form.Field>
                  <Form.Select
                    label="Type"
                    name="type"
                    onChange={handleSelect}
                    options={[
                      {key: 'value', value: 'value', text: 'Value'},
                      {key: 'triangle', value: 'triangle', text: 'Triangle'}
                    ]}
                    readOnly={qmra.readOnly}
                    value={selectedItem.type}
                  />
                </Form.Field>
              </Form.Group>
              {selectedItem.type === 'value' &&
              <Form.Field>
                <Form.Input
                  label="Value"
                  name="value"
                  onBlur={handleBlur('number')}
                  onChange={handleChange}
                  readOnly={qmra.readOnly}
                  type="number"
                  value={activeInput === 'value' ? activeValue : selectedItem.value}
                />
              </Form.Field>
              }
              {selectedItem.type === 'triangle' &&
              <React.Fragment>
                <Form.Group widths='equal'>
                  <Form.Field>
                    <Form.Input
                      label="Min"
                      name="min"
                      onBlur={handleBlur('number')}
                      onChange={handleChange}
                      readOnly={qmra.readOnly}
                      type="number"
                      value={activeInput === 'min' ? activeValue : selectedItem.min}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Form.Input
                      label="Max"
                      name="max"
                      onBlur={handleBlur('number')}
                      onChange={handleChange}
                      readOnly={qmra.readOnly}
                      type="number"
                      value={activeInput === 'max' ? activeValue : selectedItem.max}
                    />
                  </Form.Field>
                </Form.Group>
                <Form.Group widths='equal'>
                  <Form.Field>
                    <Form.Input
                      label="Mean"
                      name="mean"
                      onBlur={handleBlur('number')}
                      onChange={handleChange}
                      readOnly={qmra.readOnly}
                      type="number"
                      value={activeInput === 'mean' ? activeValue : selectedItem.mean}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Form.Input
                      label="Mode"
                      name="mode"
                      onBlur={handleBlur('number')}
                      onChange={handleChange}
                      readOnly={qmra.readOnly}
                      type="number"
                      value={activeInput === 'mode' ? activeValue : selectedItem.mode}
                    />
                  </Form.Field>
                </Form.Group>
              </React.Fragment>
              }
            </Form>
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default ExposureEditor;
