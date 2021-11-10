import {
  Button,
  Dimmer,
  DropdownProps,
  Form,
  Grid,
  Icon,
  InputOnChangeData,
  Label,
  Loader,
  Modal,
  Segment,
} from 'semantic-ui-react';
import { DataSourceCollection } from '../../../../core/model/rtm/monitoring';
import { IValueProcessingOperator } from '../../../../core/model/rtm/processing/Processing.type';
import { ValueProcessing } from '../../../../core/model/rtm/processing';
import { operators } from '../../../../core/model/rtm/processing/ValueProcessing';
import { parseDate } from '../setup/dataSources/helpers';
import { useValueProcessing } from '../hooks/useValueProcessing';
import DataChart from '../shared/dataChart';
import DatePicker, { IDatePickerProps } from '../../../shared/uiComponents/DatePicker';
import React, { ChangeEvent, SyntheticEvent, useState } from 'react';
import moment from 'moment';

interface IProps {
  dsc: DataSourceCollection;
  processing?: ValueProcessing;
  onSave: (p: ValueProcessing) => void;
  onCancel: () => void;
}

const ValueProcessingEditor = (props: IProps) => {
  const [activeInput, setActiveInput] = useState<string>();
  const [activeValue, setActiveValue] = useState<string>('');

  const { processing, updateProcessing } = useValueProcessing(props.processing || null, props.dsc);

  if (!processing) {
    return (
      <Dimmer active inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
    );
  }

  const handleSave = () => {
    if (processing) {
      props.onSave(processing);
    }
  };

  const handleClearEnd = () => {
    const cProcessing = processing.toObject();
    cProcessing.end = null;
    updateProcessing(ValueProcessing.fromObject(cProcessing));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, { name, value }: InputOnChangeData) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  const handleInputBlur = () => {
    const cProcessing = processing.toObject();
    if (activeInput === 'value') {
      cProcessing.value = parseFloat(activeValue);
    }
    updateProcessing(ValueProcessing.fromObject(cProcessing));
  };

  const handleChangeOperator = (e: SyntheticEvent<HTMLElement, Event>, d: DropdownProps) => {
    const cProcessing = processing.toObject();
    cProcessing.operator = d.value as IValueProcessingOperator;
    updateProcessing(ValueProcessing.fromObject(cProcessing));
  };

  const handleBlurDate = (e: SyntheticEvent<Element, Event>, p: IDatePickerProps) => {
    if (!p.value) {
      return;
    }

    console.log(p.name, p.value);

    const cProcessing = processing.toObject();
    const value = moment(p.value.toDateString()).unix();
    if (p.name === 'start') {
      cProcessing.begin = processing.end && value < processing.end ? value : processing.begin;
    }
    if (p.name === 'end') {
      cProcessing.end = value > processing.begin ? value : processing.end;
    }
    updateProcessing(ValueProcessing.fromObject(cProcessing));
  };

  return (
    <Modal centered={false} open={true} dimmer={'blurring'}>
      {!props.processing && <Modal.Header>Add Time Processing</Modal.Header>}
      {props.processing && <Modal.Header>Edit Time Processing</Modal.Header>}
      <Modal.Content>
        <Grid padded={true}>
          <React.Fragment>
            <Grid.Row>
              <Grid.Column width={16}>
                <Segment raised={true}>
                  <Label as={'div'} color={'blue'} ribbon={true}>
                    Time range
                  </Label>
                  <Form>
                    <Form.Group>
                      <DatePicker
                        clearable={false}
                        onChange={handleBlurDate}
                        label={'Start'}
                        name="start"
                        value={parseDate(processing.begin)}
                        size={'small'}
                      />
                    </Form.Group>
                    <Form.Group>
                      <DatePicker
                        clearable={false}
                        onChange={handleBlurDate}
                        label={'End'}
                        name="end"
                        value={parseDate(processing.end)}
                        size={'small'}
                      />
                      <Form.Field>
                        <Button
                          basic
                          labelPosition="left"
                          primary={!processing.end}
                          icon
                          onClick={handleClearEnd}
                          size="small"
                          style={{ marginTop: '22px', width: '100px' }}
                        >
                          <Icon name={!processing.end ? 'check circle outline' : 'circle outline'} />
                          Today
                        </Button>
                      </Form.Field>
                    </Form.Group>
                  </Form>
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
                <Segment raised={true}>
                  <Label as={'div'} color={'blue'} ribbon={true}>
                    Value processing
                  </Label>
                  <Form>
                    <Form.Group widths={'equal'}>
                      <Form.Select
                        fluid={true}
                        label={'Method'}
                        options={operators.map((o) => ({ key: o, value: o, text: o }))}
                        value={processing.operator}
                        onChange={handleChangeOperator}
                      />
                      <Form.Input
                        fluid={true}
                        label={'Value'}
                        type={'number'}
                        name="value"
                        value={activeInput === 'value' ? activeValue : processing.value}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                      />
                    </Form.Group>
                  </Form>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </React.Fragment>
          <Grid.Row>
            <Grid.Column>
              <Segment raised={true}>
                <Label as={'div'} color={'red'} ribbon={true}>
                  Data
                </Label>
                <DataChart dataSources={props.dsc} processings={processing} />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button negative={true} onClick={props.onCancel}>
          Cancel
        </Button>
        <Button positive={true} onClick={handleSave}>
          Apply
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ValueProcessingEditor;
