import * as Papa from 'papaparse';
import {
  Button, Dimmer, DropdownProps, Form, Grid, List, Loader, Modal, Pagination, PaginationProps, Table
} from 'semantic-ui-react';
import {ECsvColumnType} from './types';
import {ParseResult} from 'papaparse';
import React, {ChangeEvent, MouseEvent, SyntheticEvent, useEffect, useState} from 'react';
import moment from 'moment';

export type TColumns = Array<{ key: number, value: string, text: string, type?: ECsvColumnType }>;

interface IProps {
  columns: TColumns;
  onSave: (ds: any[][]) => void;
  onCancel: () => void;
  useDateTimes?: boolean;
  withoutModal?: boolean;
}

const AdvancedCsvUpload = (props: IProps) => {
  const [columns, setColumns] = useState<TColumns>(props.columns);
  const [metadata, setMetadata] = useState<ParseResult<any> | null>(null);

  const [dateTimeFormat, setDateTimeFormat] = useState<string>('DD.MM.YYYY H:m:s');
  const [firstRowIsHeader, setFirstRowIsHeader] = useState<boolean>(true);

  const [parameterColumns, setParameterColumns] = useState<{ [name: string]: number } | null>(null);

  const [fileToParse, setFileToParse] = useState<File>();
  const [parsingData, setParsingData] = useState<boolean>(false);
  const [processedData, setProcessedData] = useState<any[][] | null>(null);

  const [isFetched] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const [paginationPage, setPaginationPage] = useState<number>(1);

  const rowsPerPage = 50;

  useEffect(() => {
    if (props.useDateTimes) {
      return setColumns(([{
        key: 0,
        value: 'datetime',
        text: 'Datetime',
        type: ECsvColumnType.DATE_TIME
      }] as TColumns).concat(props.columns));
    }
    return setColumns(props.columns);
  }, [props.columns, props.useDateTimes]);

  useEffect(() => {
    if (metadata && parameterColumns && Object.keys(parameterColumns).length === columns.length) {
      setIsFetching(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstRowIsHeader, parameterColumns]);

  useEffect(() => {
    if (parsingData && fileToParse) {
      Papa.parse(fileToParse, {
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          setMetadata(results);
          setParsingData(false);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsingData]);

  useEffect(() => {
    if (metadata && isFetching) {
      processData(metadata);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  const handleBlurDateTimeFormat = () => {
    if (metadata && parameterColumns && Object.keys(parameterColumns).length === columns.length) {
      setIsFetching(true);
    }
  };

  const handleSave = () => {
    if (processedData) {
      props.onCancel();
      return props.onSave(processedData);
    }
  };

  const handleChange = (f: (v: any) => void) => (e: any, d: any) => {
    // eslint-disable-next-line no-prototype-builtins
    if (d.hasOwnProperty('value')) {
      f(d.value);
    }

    // eslint-disable-next-line no-prototype-builtins
    if (d.hasOwnProperty('checked')) {
      f(d.checked);
    }
  };

  const handleChangeParameterColumn = (e: SyntheticEvent, {name, value}: DropdownProps) => {
    setParameterColumns({
      ...parameterColumns,
      [name]: value
    });
  };

  const processData = ({data}: ParseResult<any>) => {
    if (
      (!metadata) ||
      (!parameterColumns) ||
      (parameterColumns && Object.keys(parameterColumns).length !== columns.length)
    ) {
      return;
    }
    const nData: any[][] = [];
    data.forEach((r, rKey) => {
      if (!firstRowIsHeader || (firstRowIsHeader && rKey > 0)) {
        const row = columns.map((c) => {
          if (c.type === ECsvColumnType.DATE_TIME) {
            return moment.utc(r[parameterColumns[c.value]], dateTimeFormat);
          }
          if (c.type === ECsvColumnType.BOOLEAN) {
            return r[parameterColumns[c.value]] === 1 || r[parameterColumns[c.value]] === true ||
              r[parameterColumns[c.value]] === 'true';
          }
          return r[parameterColumns[c.value]] || 0;

        });
        nData.push(row);
      }
    });
    setIsFetching(false);
    setProcessedData(nData);
    if (props.withoutModal) {
      return props.onSave(nData);
    }
  };

  const parseToString = (value: any) => {
    if (typeof value === 'boolean') {
      return value.toString();
    }
    if (typeof value === 'number') {
      return value.toFixed(3);
    }
    if (moment.isMoment(value)) {
      return value.format(dateTimeFormat);
    }
    return value;
  };

  const handleUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files && files.length > 0 ? files[0] : null;
    if (file) {
      setFileToParse(file);
      setParsingData(true);
    }
  };

  const handleChangePagination = (e: MouseEvent, {activePage}: PaginationProps) =>
    setPaginationPage(typeof activePage === 'number' ? activePage : 1);

  const renderProcessedData = () => {
    if (!processedData) {
      return null;
    }

    const startingIndex = (paginationPage - 1) * rowsPerPage;
    const endingIndex = startingIndex + rowsPerPage;

    return processedData.slice(startingIndex, endingIndex).map((row, rKey) => (
      <Table.Row key={rKey}>
        {row.map((c, cKey) => (
          <Table.Cell key={cKey}>
            {parseToString(c)}
          </Table.Cell>
        ))}
      </Table.Row>
    ));
  };

  const renderContent = (props: IProps) => (
    <Grid>
      {(parsingData || isFetching) &&
      <Dimmer active={true} inverted={true}>
        <Loader inverted={true}>Loading</Loader>
      </Dimmer>
      }
      {!isFetched &&
      <React.Fragment>
        <Grid.Row>
          <Grid.Column>
            <Form>
              <Form.Group>
                <Form.Input
                  onChange={handleUploadFile}
                  label="File"
                  name="file"
                  type="file"
                />
                <Form.Checkbox
                  style={{marginTop: '30px'}}
                  toggle={true}
                  onChange={handleChange(setFirstRowIsHeader)}
                  checked={firstRowIsHeader}
                  label="First row is header."
                />
              </Form.Group>
            </Form>
          </Grid.Column>
        </Grid.Row>
        {(props.useDateTimes || columns.filter((c) => c.type === ECsvColumnType.DATE_TIME).length > 0) &&
        <Grid.Row>
          <Grid.Column>
            <Form>
              <Form.Group>
                <Form.Input
                  onBlur={handleBlurDateTimeFormat}
                  onChange={handleChange(setDateTimeFormat)}
                  label="Datetime format"
                  name={'datetimeField'}
                  value={dateTimeFormat}
                />
              </Form.Group>
            </Form>
          </Grid.Column>
        </Grid.Row>
        }
        {metadata &&
        <Grid.Row>
          <Grid.Column>
            {metadata.errors.length > 0 &&
            <div>
              <List divided={true} relaxed={true}/>
              {metadata.errors.map((e, key) => (
                <List.Item key={key}>
                  <List.Content>
                    <List.Header>{e.type}: {e.code}</List.Header>
                    <List.Description as="a">{e.message} in
                      row {e.row}</List.Description>
                  </List.Content>
                </List.Item>
              ))}
            </div>
            }
            {metadata.errors.length === 0 &&
            <div>
              <Form>
                {columns.map((c, key) => (
                  <Form.Dropdown
                    key={key}
                    label={c.text}
                    name={c.value}
                    selection={true}
                    value={parameterColumns ? parameterColumns[c.value] : undefined}
                    onChange={handleChangeParameterColumn}
                    options={metadata.data[0].map((s: string, idx: number) => ({
                      key: idx,
                      value: idx,
                      text: firstRowIsHeader ? s : `Column ${idx + 1}`
                    }))}
                  />
                ))}
              </Form>
            </div>
            }
          </Grid.Column>
        </Grid.Row>
        }
        {processedData && processedData.length > rowsPerPage &&
        <Pagination
          activePage={paginationPage}
          onPageChange={handleChangePagination}
          size="mini"
          totalPages={Math.ceil(processedData.length / rowsPerPage)}
        />
        }
        {processedData &&
        <Grid.Row>
          <Grid.Column>
            <Table size={'small'}>
              <Table.Header>
                <Table.Row>
                  {props.columns.map((c, cKey) =>
                    <Table.HeaderCell key={cKey}>{c.text}</Table.HeaderCell>
                  )}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {renderProcessedData()}
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
        }
      </React.Fragment>
      }
    </Grid>
  );

  if (!props.withoutModal) {
    return (
      <Modal
        closeIcon={true}
        open={true}
        onClose={props.onCancel}
        dimmer={'blurring'}
      >
        <Modal.Header>CSV Upload</Modal.Header>
        <Modal.Content>
          {renderContent(props)}
        </Modal.Content>
        <Modal.Actions>
          <Button negative={true} onClick={props.onCancel}>Cancel</Button>
          <Button positive={true} disabled={!processData} onClick={handleSave}>Apply</Button>
        </Modal.Actions>
      </Modal>
    );
  }

  return renderContent(props);
};

export default AdvancedCsvUpload;
