import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import {
  Button,
  Dimmer,
  DropdownProps,
  Form,
  Grid,
  InputOnChangeData,
  Label,
  Loader,
  Modal,
  Segment,
} from 'semantic-ui-react';
import { DataSourceCollection } from '../../../../core/model/rtm/monitoring';
import { ECutRule } from '../../../../core/model/rtm/processing/Processing.type';
import { TimeProcessing } from '../../../../core/model/rtm/processing';
import { methods } from '../../../../core/model/rtm/processing/TimeProcessing';
import { parseDate } from '../setup/dataSources/helpers';
import { useTimeProcessing } from '../hooks/useTimeProcessing';
import DataChart from '../shared/dataChart';
import DatePicker, { IDatePickerProps } from '../../../shared/uiComponents/DatePicker';
import React, { ChangeEvent, SyntheticEvent, useState } from 'react';
import moment from 'moment';

interface IProps {
  dsc: DataSourceCollection;
  processing?: TimeProcessing;
  onSave: (p: TimeProcessing) => void;
  onCancel: () => void;
}

const TimeProcessingEditor = (props: IProps) => {
  const [activeInput, setActiveInput] = useState<string>();
  const [activeValue, setActiveValue] = useState<string>('');

  const { processedData, processing, updateProcessing } = useTimeProcessing(props.processing || null, props.dsc);

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

  const handleChangeSelect = (e: SyntheticEvent<HTMLElement, Event>, d: DropdownProps) => {
    const cProcessing = processing.toObject();
    if (d.name === 'method' && typeof d.value === 'string') {
      cProcessing.method = d.value;
    }
    if (d.name === 'cut' && typeof d.value === 'string') {
      cProcessing.cut = d.value as ECutRule;
    }
    updateProcessing(TimeProcessing.fromObject(cProcessing));
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>, { name, value }: InputOnChangeData) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  const handleBlurInput = () => {
    const cProcessing = processing.toObject();
    if (activeInput === 'rule') {
      cProcessing.rule = activeValue;
    }
    if (activeInput === 'cutNumber') {
      cProcessing.cutNumber = parseFloat(activeValue);
    }
    updateProcessing(TimeProcessing.fromObject(cProcessing));
    setActiveInput(undefined);
  };

  const handleBlurDate = (e: SyntheticEvent<Element, Event>, p: IDatePickerProps) => {
    if (!p.value) {
      return;
    }

    const cProcessing = processing.toObject();
    const value = moment(p.value.toDateString()).unix();
    if (p.name === 'start') {
      cProcessing.begin = processing.end && value < processing.end ? value : processing.begin;
    }
    if (p.name === 'end') {
      cProcessing.end = value > processing.begin ? value : processing.end;
    }
    updateProcessing(TimeProcessing.fromObject(cProcessing));
  };

  return (
    <Modal centered={false} open={true} dimmer={'blurring'}>
      {!props.processing && <Modal.Header>Add Time Processing</Modal.Header>}
      {props.processing && <Modal.Header>Edit Time Processing</Modal.Header>}
      <Modal.Content>
        <Grid padded={true}>
          {processedData && (
            <React.Fragment>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Segment raised={true}>
                    <Label as={'div'} color={'blue'} ribbon={true}>
                      Cut
                    </Label>
                    <Form>
                      <Form.Group widths={'equal'}>
                        <Form.Select
                          label="Rule"
                          name="cut"
                          onChange={handleChangeSelect}
                          options={[
                            { key: ECutRule.NONE, value: ECutRule.NONE, text: 'None' },
                            { key: ECutRule.PERIOD, value: ECutRule.PERIOD, text: 'Period' },
                            {
                              key: ECutRule.UNTIL_TODAY,
                              value: ECutRule.UNTIL_TODAY,
                              text: 'From date until today',
                            },
                            {
                              key: ECutRule.BEFORE_TODAY,
                              value: ECutRule.BEFORE_TODAY,
                              text: 'Units before today',
                            },
                          ]}
                          value={processing.cut}
                        />
                        {processing.cut === ECutRule.BEFORE_TODAY && (
                          <Form.Input
                            label="Number of units"
                            name="cutNumber"
                            value={activeInput === 'cutNumber' ? activeValue : processing.cutNumber}
                            type="number"
                            onChange={handleChangeInput}
                            onBlur={handleBlurInput}
                          />
                        )}
                      </Form.Group>
                    </Form>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
              {processing.cut !== ECutRule.BEFORE_TODAY && (
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Segment raised={true}>
                      <Label as={'div'} color={'blue'} ribbon={true}>
                        Time range
                      </Label>
                      <Form>
                        <Form.Group widths={'equal'}>
                          <DatePicker
                            onChange={handleBlurDate}
                            label="Start"
                            value={parseDate(processing.begin)}
                            size="small"
                            name="start"
                          />
                          <DatePicker
                            disabled={processing.cut === ECutRule.UNTIL_TODAY}
                            onChange={handleBlurDate}
                            label="End"
                            value={parseDate(processing.end)}
                            size="small"
                            name="end"
                          />
                        </Form.Group>
                      </Form>
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
              )}
              <Grid.Row>
                <Grid.Column width={16}>
                  <Segment raised={true}>
                    <Label as={'div'} color={'blue'} ribbon={true}>
                      Time resolution
                    </Label>
                    <Form>
                      <Form.Group widths={'equal'}>
                        <Form.Select
                          fluid={true}
                          label="Method"
                          name="method"
                          options={methods.map((o) => ({ key: o[0], value: o[0], text: o[0] }))}
                          value={processing.method}
                          onChange={handleChangeSelect}
                        />
                        <Form.Input
                          fluid={true}
                          name="rule"
                          label="Rule"
                          value={activeInput === 'rule' ? activeValue : processing.rule}
                          onChange={handleChangeInput}
                          onBlur={handleBlurInput}
                        />
                      </Form.Group>
                    </Form>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Segment loading={!processedData} raised={true}>
                    <Label as={'div'} color={'red'} ribbon={true}>
                      Data
                    </Label>
                    <DataChart dataSources={props.dsc} processings={processing || undefined} />
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </React.Fragment>
          )}
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

export default TimeProcessingEditor;
