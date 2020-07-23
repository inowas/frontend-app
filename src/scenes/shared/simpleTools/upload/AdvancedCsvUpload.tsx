import moment from 'moment';
import * as Papa from 'papaparse';
import {ParseResult} from 'papaparse';
import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';
import {Button, DropdownProps, Form, Grid, List, Modal, Segment, Table} from 'semantic-ui-react';
import {ECsvColumnType} from './types';

type TColumns = Array<{ key: number, value: string, text: string, type?: ECsvColumnType }>;

interface IProps {
    columns: TColumns;
    onSave: (ds: any[][]) => void;
    onCancel: () => void;
    useDateTimes?: boolean;
}

const advancedCsvUpload = (props: IProps) => {
    const [columns, setColumns] = useState<TColumns>(props.columns);
    const [metadata, setMetadata] = useState<ParseResult | null>(null);

    const [dateTimeFormat, setDateTimeFormat] = useState<string>('DD.MM.YYYY H:m:s');
    const [firstRowIsHeader, setFirstRowIsHeader] = useState<boolean>(true);

    const [parameterColumns, setParameterColumns] = useState<{ [name: string]: number } | null>(null);

    const [fetchingData] = useState<boolean>(false);
    const [parsingData, setParsingData] = useState<boolean>(false);
    const [processedData, setProcessedData] = useState<any[][] | null>(null);

    const [isFetched] = useState<boolean>(false);

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
            processData(metadata);
        }
    }, [firstRowIsHeader, parameterColumns]);

    const handleBlurDateTimeFormat = () => {
        if (metadata && parameterColumns && Object.keys(parameterColumns).length === columns.length) {
            processData(metadata);
        }
    };

    const handleSave = () => {
        if (processedData) {
            props.onCancel();
            return props.onSave(processedData);
        }
    };

    const handleChange = (f: (v: any) => void) => (e: any, d: any) => {
        if (d.hasOwnProperty('value')) {
            f(d.value);
        }

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

    const processData = ({data}: ParseResult) => {
        if (!metadata || !parameterColumns ||
            (parameterColumns && Object.keys(parameterColumns).length !== columns.length)) {
            return;
        }
        const nData: any[][] = [];
        data.forEach((r, rKey) => {
            if (!firstRowIsHeader || firstRowIsHeader && rKey > 0) {
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
        return setProcessedData(nData);
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
            setParsingData(true);
            Papa.parse(file, {
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    setMetadata(results);
                    setParsingData(false);
                }
            });
        }
    };

    return (
        <Modal
            closeIcon={true}
            open={true}
            onClose={props.onCancel}
            dimmer={'blurring'}
        >
            <Modal.Header>CSV Upload</Modal.Header>
            <Modal.Content>
                <Grid loading={fetchingData.toString()}>
                    {!isFetched &&
                    <React.Fragment>
                        <Grid.Row>
                            <Grid.Column>
                                <Segment raised={true} loading={parsingData}>
                                    <Form>
                                        <Form.Group>
                                            <Form.Input
                                                onChange={handleUploadFile}
                                                label="File"
                                                name="file"
                                                type="file"
                                                width={6}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        {metadata &&
                        <Grid.Row>
                            <Grid.Column>
                                <Segment raised={true}>
                                    <Form>
                                        <Form.Group>
                                            {(props.useDateTimes || columns.filter((c) =>
                                                c.type === ECsvColumnType.DATE_TIME).length > 0) &&
                                            <Form.Input
                                                onBlur={handleBlurDateTimeFormat}
                                                onChange={handleChange(setDateTimeFormat)}
                                                label="Datetime format"
                                                name={'datetimeField'}
                                                value={dateTimeFormat}
                                            />
                                            }
                                            <Form.Checkbox
                                                style={{marginTop: '30px'}}
                                                toggle={true}
                                                onChange={handleChange(setFirstRowIsHeader)}
                                                checked={firstRowIsHeader}
                                                label="First row is header."
                                            />
                                        </Form.Group>
                                    </Form>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        }
                        {metadata &&
                        <Grid.Row>
                            <Grid.Column>
                                <Segment
                                    raised={true}
                                    loading={parsingData}
                                    color={metadata.errors.length > 0 ? 'red' : undefined}
                                >
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
                                            <Form.Group>
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
                                            </Form.Group>
                                        </Form>
                                    </div>
                                    }
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
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
                                        {processedData.map((row, rKey) =>
                                            <Table.Row key={rKey}>
                                                {row.map((c, cKey) => (
                                                    <Table.Cell key={cKey}>
                                                        {parseToString(c)}
                                                    </Table.Cell>
                                                ))}
                                            </Table.Row>
                                        )}
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                        </Grid.Row>
                        }
                    </React.Fragment>
                    }
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Button negative={true} onClick={props.onCancel}>Cancel</Button>
                <Button positive={true} disabled={!processData} onClick={handleSave}>Apply</Button>
            </Modal.Actions>
        </Modal>
    );
};

export default advancedCsvUpload;
