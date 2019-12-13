import moment from 'moment';
import * as Papa from 'papaparse';
import {ParseResult} from 'papaparse';
import React, {ChangeEvent, SyntheticEvent, useState} from 'react';
import {Button, DropdownProps, Form, Grid, Header, Input, Label, List, Modal, Segment, Table} from 'semantic-ui-react';

interface IProps {
    columns: Array<{ key: number, value: string, text: string }>;
    onSave: (ds: any) => void;
    onCancel: () => void;
}

const advancedCsvUpload = (props: IProps) => {
    const [data, setData] = useState<number[][] | undefined>(undefined);
    const [metadata, setMetadata] = useState<ParseResult | null>(null);

    const [dateTimeFormat, setDateTimeFormat] = useState<string>('DD.MM.YYYY H:i:s');
    const [firstRowIsHeader, setFirstRowIsHeader] = useState<boolean>(true);

    const [parameterColumns, setParameterColumns] = useState<{ [name: string]: number } | null>(null);

    const [fetchingData] = useState<boolean>(false);
    const [parsingData, setParsingData] = useState<boolean>(false);

    const [isFetched] = useState<boolean>(false);

    const [beginEnabled, setBeginEnabled] = useState<boolean>(false);
    const [begin, setBegin] = useState<number>(0);
    const [lBegin, setLBegin] = useState<number>(0);

    const [endEnabled, setEndEnabled] = useState<boolean>(false);
    const [end, setEnd] = useState<number>(moment.utc().unix());
    const [lEnd, setLEnd] = useState<number>(moment.utc().unix());

    const handleSave = () => {
        if (!metadata || !parameterColumns ||
            (parameterColumns && Object.keys(parameterColumns).length !== props.columns.length)) {
            return;
        }

        const nData: number[][] = [];
        metadata.data.forEach((r, rKey) => {
            if (!firstRowIsHeader || firstRowIsHeader && rKey > 0) {
                const row = props.columns.map((c) => {
                    return r[parameterColumns[c.value]];
                });
                nData.push(row);
            }
        });
        return setData(nData);
    };

    const handleBlur = (f: (v: any) => void) => (v: any) => {
        f(v);
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
                                            <Form.Input
                                                onChange={handleUploadFile}
                                                label="File"
                                                name="file"
                                                type="file"
                                                width={6}
                                            />
                                            <Form.Input
                                                onChange={handleChange(setDateTimeFormat)}
                                                label="Datetime format"
                                                name={'datetimeField'}
                                                value={dateTimeFormat}
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
                                                {props.columns.map((c, key) => (
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

                        {metadata &&
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Segment raised={true} loading={parsingData}>
                                    <Label as={'div'} color={'blue'} ribbon={true}>Time range</Label>
                                    <Form>
                                        <Form.Group>
                                            <Form.Checkbox
                                                style={{marginTop: '30px'}}
                                                toggle={true}
                                                checked={beginEnabled}
                                                onChange={handleChange(setBeginEnabled)}
                                            />
                                            <Form.Input
                                                label={'Start'}
                                                type={'date'}
                                                value={moment.unix(lBegin).format('YYYY-MM-DD')}
                                                disabled={!beginEnabled}
                                                onChange={handleChange((d) => setLBegin(moment.utc(d).unix()))}
                                                onBlur={handleBlur(() => setBegin(lBegin))}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Checkbox
                                                style={{marginTop: '30px'}}
                                                toggle={true}
                                                checked={endEnabled}
                                                onChange={handleChange(setEndEnabled)}
                                            />
                                            <Form.Input
                                                label={'End'}
                                                type={'date'}
                                                value={moment.unix(lEnd).format('YYYY-MM-DD')}
                                                disabled={!endEnabled}
                                                onChange={handleChange((d) => setLEnd(moment.utc(d).unix()))}
                                                onBlur={handleBlur(() => setEnd(lEnd))}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>}
                    </React.Fragment>}

                    {metadata && parameterColumns && Object.keys(parameterColumns).length !== props.columns.length &&
                    <Grid.Row>
                        <Grid.Column>
                            <Segment loading={parsingData} raised={true}>
                                {!parsingData && <Label as={'div'} color={'red'} ribbon={true}>Data</Label>}
                                <Table size={'small'} singleLine={true}>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Start Date</Table.HeaderCell>
                                            {props.columns.map((p, idx) => (
                                                <Table.HeaderCell key={idx}>{p.text}</Table.HeaderCell>))}
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>

                                    </Table.Body>
                                </Table>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
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
