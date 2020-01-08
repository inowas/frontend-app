import moment from 'moment';
import * as Papa from 'papaparse';
import {ParseResult} from 'papaparse';
import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';
import {Button, DropdownProps, Form, Grid, Header, Label, List, Modal, Segment} from 'semantic-ui-react';

interface IProps {
    columns: Array<{ key: number, value: string, text: string }>;
    onSave: (ds: any[][]) => void;
    onCancel: () => void;
    useDateTimes?: boolean;
}

const advancedCsvUpload = (props: IProps) => {
    const [columns, setColumns] = useState<Array<{key: number, value: string, text: string}>>(props.columns);
    const [metadata, setMetadata] = useState<ParseResult | null>(null);

    const [dateTimeFormat, setDateTimeFormat] = useState<string>('DD.MM.YYYY H:i:s');
    const [firstRowIsHeader, setFirstRowIsHeader] = useState<boolean>(true);

    const [parameterColumns, setParameterColumns] = useState<{ [name: string]: number } | null>(null);

    const [fetchingData] = useState<boolean>(false);
    const [parsingData, setParsingData] = useState<boolean>(false);

    const [isFetched] = useState<boolean>(false);

    useEffect(() => {
        if (props.useDateTimes) {
            return setColumns([{
                key: 0,
                value: 'datetime',
                text: 'Datetime'
            }].concat(props.columns));
        }
        return setColumns(props.columns);
    }, [props.columns, props.useDateTimes]);

    const handleSave = () => {
        if (!metadata || !parameterColumns ||
            (parameterColumns && Object.keys(parameterColumns).length !== columns.length)) {
            return;
        }

        const nData: any[][] = [];
        metadata.data.forEach((r, rKey) => {
            if (!firstRowIsHeader || firstRowIsHeader && rKey > 0) {
                const row = columns.map((c, cKey) => {
                    if (props.useDateTimes && cKey === 0) {
                        return moment.utc(r[parameterColumns[c.value]]);
                    }
                    if (!props.useDateTimes || cKey > 0) {
                        return r[parameterColumns[c.value]] || 0;
                    }
                });
                nData.push(row);
            }
        });
        props.onCancel();
        return props.onSave(nData);
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
        <Modal centered={false} open={true} dimmer={'blurring'}>
            <Modal.Content>
                <Header>CSV Upload</Header>
                <Grid padded={true} loading={fetchingData.toString()}>
                    {!isFetched &&
                    <React.Fragment>
                        <Grid.Row>
                            <Grid.Column>
                                <Form>
                                    <Segment raised={true} loading={parsingData}>
                                        <Label as={'div'} color={'blue'} ribbon={true}>Upload File</Label>
                                        <Form.Group>
                                            {props.useDateTimes &&
                                            <Form.Input
                                                onChange={handleChange(setDateTimeFormat)}
                                                label="Datetime format"
                                                name={'datetimeField'}
                                                value={dateTimeFormat}
                                            />
                                            }
                                            <Form.Input
                                                onChange={handleUploadFile}
                                                label="File"
                                                name="file"
                                                type="file"
                                                width={6}
                                            />
                                            <Form.Checkbox
                                                style={{marginTop: '30px'}}
                                                toggle={true}
                                                onChange={handleChange(setFirstRowIsHeader)}
                                                checked={firstRowIsHeader}
                                                label="First row is header."
                                            />
                                        </Form.Group>
                                    </Segment>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Segment
                                    raised={true}
                                    loading={parsingData}
                                    color={metadata && metadata.errors.length > 0 ? 'red' : undefined}
                                >
                                    {metadata && metadata.errors.length > 0 &&
                                    <div>
                                        <Label as={'div'} color={'red'} ribbon={true}>Parsing errors</Label>
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
                                    {metadata && metadata.errors.length === 0 &&
                                    <div>
                                        <Label as={'div'} color={'blue'} ribbon={true}>Metadata</Label>
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
                    </React.Fragment>
                    }
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Button negative={true} onClick={props.onCancel}>Cancel</Button>
                <Button positive={true} onClick={handleSave}>Apply</Button>
            </Modal.Actions>
        </Modal>
    );
};

export default advancedCsvUpload;
