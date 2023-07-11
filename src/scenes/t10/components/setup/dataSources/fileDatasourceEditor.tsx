import {
  Button,
  ButtonProps,
  DropdownProps,
  Form,
  Grid,
  Icon,
  InputProps,
  Label,
  List,
  Modal,
  Segment,
} from 'semantic-ui-react';
import { ChangeEvent, MouseEvent, SyntheticEvent, useState } from 'react';
import { DatePicker } from '../../../../shared/uiComponents';
import { FileDataSource } from '../../../../../core/model/rtm/monitoring';
import { IDatePickerProps } from '../../../../shared/uiComponents/DatePicker';
import { parseDate } from './helpers';
import { useFileDatasource } from '../../hooks/useFileDatasource';
import DataSourceChart from './dataSourceChart';

interface IProps {
  dataSource?: FileDataSource;
  onSave: (ds: FileDataSource) => void;
  onCancel: () => void;
}

const FileDatasourceEditor = (props: IProps) => {
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [activeValue, setActiveValue] = useState<string>('');
  const [dateTimeField, setDateTimeField] = useState<number | null>(null);
  const [dateTimeFormat, setDateTimeFormat] = useState<string>('YYYY/MM/DD');
  const [firstRowIsHeader, setFirstRowIsHeader] = useState<boolean>(true);
  const [parameterField, setParameterField] = useState<number | null>(null);

  const { dataSource, isParsing, metadata, updateData, updateDataSource, uploadFile } = useFileDatasource(
    props.dataSource || null,
  );

  const handleSave = () => {
    if (!dataSource) {
      return;
    }
    props.onSave(dataSource);
  };

  const handleBlur = (field?: string) => {
    if (!dataSource) {
      return;
    }

    if (activeInput === 'min') {
      dataSource.min = parseFloat(activeValue);
    }

    if (activeInput === 'max') {
      dataSource.max = parseFloat(activeValue);
    }

    if (field === 'dateTimeFormat') {
      if (dateTimeField !== null && parameterField !== null) {
        updateData(firstRowIsHeader, dateTimeField, parameterField, dateTimeFormat);
      }
    }

    updateDataSource(dataSource);
    setActiveInput(null);
  };

  const handleChangeDate = (e: SyntheticEvent<Element>, { name, value }: IDatePickerProps) => {
    if (!dataSource) {
      return;
    }

    if (name === 'begin') {
      dataSource.begin = value ? value.valueOf() / 1000 : null;
    }

    if (name === 'end') {
      dataSource.end = value ? value.valueOf() / 1000 : null;
    }

    updateDataSource(dataSource);
  };

  const handleChange = (e: SyntheticEvent<Element>, { name, value }: InputProps) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  const handleChangeDateTimeFormat = (e: ChangeEvent<HTMLInputElement>) => {
    setDateTimeFormat(e.target.value);
  };

  const handleChangeCheckbox = () => setFirstRowIsHeader(!firstRowIsHeader);

  const handleChangeDropdown = (e: SyntheticEvent<Element>, { name, value }: DropdownProps) => {

    if (typeof value !== 'number') {
      return;
    }

    const dateTimeColumn = name === 'dateTimeField' ? value : dateTimeField;
    const parameterColumn = name === 'parameterField' ? value : parameterField;

    setDateTimeField(dateTimeColumn);
    setParameterField(parameterColumn);

    if (dateTimeColumn !== null && parameterColumn !== null) {
      updateData(firstRowIsHeader, dateTimeColumn, parameterColumn, dateTimeFormat);
    }
  };

  const handleReset = (e: MouseEvent, { name }: ButtonProps) => {
    if (!dataSource) {
      return;
    }

    const cDataSource = FileDataSource.fromObject(dataSource.toObject());

    if (name === 'begin') {
      cDataSource.resetBegin();
    }

    if (name === 'end') {
      cDataSource.resetEnd();
    }

    if (name === 'min') {
      cDataSource.resetMin();
    }

    if (name === 'max') {
      cDataSource.resetMax();
    }

    updateDataSource(cDataSource);
  };

  const handleUploadFile = (e: ChangeEvent<HTMLInputElement>) => uploadFile(e);

  return (
    <Modal centered={false} open={true} dimmer={'blurring'}>
      {!dataSource && <Modal.Header>Add File Datasource</Modal.Header>}
      {dataSource && <Modal.Header>Edit Datasource</Modal.Header>}
      <Modal.Content>
        <Grid padded={true}>
          <>
            <Grid.Row>
              <Grid.Column>
                <Form>
                  <Segment raised={true} loading={isParsing}>
                    <Label as={'div'} color={'blue'} ribbon={true}>
                      Upload File
                    </Label>
                    <Form.Group>
                      <Form.Input onChange={handleUploadFile} label='File' name='file' type='file' width={6} />
                      <Form.Input
                        onBlur={() => handleBlur('dateTimeFormat')}
                        onChange={handleChangeDateTimeFormat}
                        label='Datetime format'
                        name={'dateTimeFormat'}
                        value={dateTimeFormat}
                      />
                      <Form.Checkbox
                        style={{ marginTop: '30px' }}
                        toggle={true}
                        onChange={handleChangeCheckbox}
                        checked={firstRowIsHeader}
                        label='First row is header.'
                      />
                    </Form.Group>
                  </Segment>
                </Form>
              </Grid.Column>
            </Grid.Row>
            {metadata && (
              <Grid.Row>
                <Grid.Column>
                  <Segment raised={true} loading={isParsing} color={metadata.errors.length > 0 ? 'red' : undefined}>
                    {metadata.errors.length > 0 && (
                      <div>
                        <Label as={'div'} color={'red'} ribbon={true}>
                          Parsing errors
                        </Label>
                        <List divided={true} relaxed={true} />
                        {metadata.errors.map((e, key) => (
                          <List.Item key={key}>
                            <List.Content>
                              <List.Header>
                                {e.type}: {e.code}
                              </List.Header>
                              <List.Description as='a'>
                                {e.message} in row {e.row}
                              </List.Description>
                            </List.Content>
                          </List.Item>
                        ))}
                      </div>
                    )}
                    {metadata.errors.length === 0 && (
                      <div>
                        <Label as={'div'} color={'blue'} ribbon={true}>
                          Metadata
                        </Label>
                        <Form>
                          <Form.Group>
                            <Form.Dropdown
                              label={'Datetime'}
                              name={'dateTimeField'}
                              selection={true}
                              value={dateTimeField !== null ? dateTimeField : undefined}
                              onChange={handleChangeDropdown}
                              options={metadata.data[0].map((s: string, idx: number) => ({
                                key: idx,
                                value: idx,
                                text: firstRowIsHeader ? s : `Column ${idx + 1}`,
                              }))}
                            />
                            <Form.Dropdown
                              label={'Parameter'}
                              name={'parameterField'}
                              selection={true}
                              value={parameterField !== null ? parameterField : undefined}
                              onChange={handleChangeDropdown}
                              options={metadata.data[0].map((s: string, idx: number) => ({
                                key: idx,
                                value: idx,
                                text: firstRowIsHeader ? s : `Column ${idx + 1}`,
                              }))}
                            />
                          </Form.Group>
                        </Form>
                      </div>
                    )}
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            )}
            {dataSource?.data && (
              <Grid.Row>
                <Grid.Column width={8}>
                  <Segment raised={true} loading={isParsing}>
                    <Label as={'div'} color={'blue'} ribbon={true}>
                      Time range
                    </Label>
                    <Form>
                      <Form.Group>
                        <Form.Field>
                          <Button icon onClick={handleReset} size='small' name='begin' style={{ marginTop: '22px' }}>
                            <Icon name='refresh' />
                          </Button>
                        </Form.Field>
                        <DatePicker
                          clearable={false}
                          label={'Begin'}
                          name={'begin'}
                          value={parseDate(dataSource.begin)}
                          onChange={handleChangeDate}
                          size={'small'}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Field>
                          <Button icon onClick={handleReset} size='small' name='end' style={{ marginTop: '22px' }}>
                            <Icon name='refresh' />
                          </Button>
                        </Form.Field>
                        <DatePicker
                          clearable={false}
                          label={'End'}
                          name={'end'}
                          value={parseDate(dataSource.end)}
                          onChange={handleChangeDate}
                          size={'small'}
                        />
                      </Form.Group>
                    </Form>
                  </Segment>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Segment raised={true}>
                    <Label as={'div'} color={'blue'} ribbon={true}>
                      Value range
                    </Label>
                    <Form>
                      <Form.Group>
                        <Form.Field>
                          <Button icon onClick={handleReset} size='small' name='max' style={{ marginTop: '22px' }}>
                            <Icon name='refresh' />
                          </Button>
                        </Form.Field>
                        <Form.Input
                          label={'Upper limit'}
                          name={'max'}
                          type={'number'}
                          value={activeInput === 'max' ? activeValue : dataSource.max || undefined}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Field>
                          <Button icon onClick={handleReset} size='small' name='min' style={{ marginTop: '22px' }}>
                            <Icon name='refresh' />
                          </Button>
                        </Form.Field>
                        <Form.Input
                          label={'Lower limit'}
                          name={'min'}
                          type={'number'}
                          value={activeInput === 'min' ? activeValue : dataSource.min || undefined}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                    </Form>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            )}
          </>
          {dataSource?.data && (
            <Grid.Row>
              <Grid.Column>
                <Segment loading={isParsing} raised={true}>
                  {!isParsing && (
                    <Label as={'div'} color={'red'} ribbon={true}>
                      Data
                    </Label>
                  )}
                  <DataSourceChart dataSource={dataSource} />
                </Segment>
              </Grid.Column>
            </Grid.Row>
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

export default FileDatasourceEditor;
