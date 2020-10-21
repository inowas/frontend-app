import * as Papa from 'papaparse';
import {Button, Form, Grid, Header, Label, List, Modal, Segment} from 'semantic-ui-react';
import {DataPoint} from 'downsample';
import {DatePicker} from '../../shared/uiComponents';
import {FileDataSource} from '../../../core/model/rtm';
import {IDateTimeValue, IFileDataSource} from '../../../core/model/rtm/Sensor.type';
import {LTOB} from 'downsample';
import {ParseResult} from 'papaparse';
import {ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {cloneDeep} from 'lodash';
import React, {ChangeEvent, useEffect, useState} from 'react';
import moment from 'moment';

interface IProps {
    dataSource?: FileDataSource;
    onSave: (ds: FileDataSource) => void;
    onCancel: () => void;
}

const FileDatasourceEditor = (props: IProps) => {
    const [dataSource, setDataSource] = useState<IFileDataSource | null>(null);

    const [rawData, setRawData] = useState<IDateTimeValue[] | undefined>(undefined);
    const [data, setData] = useState<IDateTimeValue[] | undefined>(undefined);
    const [metadata, setMetadata] = useState<ParseResult<any> | null>(null);

    const [dateTimeFormat, setDateTimeFormat] = useState<string>('DD.MM.YYYY H:i:s');
    const [firstRowIsHeader, setFirstRowIsHeader] = useState<boolean>(true);

    const [datetimeField, setDateTimeField] = useState<number | null>(null);
    const [parameterField, setParameterField] = useState<number | null>(null);

    const [fetchingData] = useState<boolean>(false);
    const [parsingData, setParsingData] = useState<boolean>(false);

    const [isFetched] = useState<boolean>(false);

    const [beginEnabled, setBeginEnabled] = useState<boolean>(false);
    const [begin, setBegin] = useState<number>(0);
    const [lBegin, setLBegin] = useState<number>(0);

    const [endEnabled, setEndEnabled] = useState<boolean>(false);
    const [end, setEnd] = useState<number>(moment.utc().unix());
    const [lEnd, setLEnd] = useState<number>(moment.utc().unix());

    const [minValueEnabled, setMinValueEnabled] = useState<boolean>(false);
    const [minValue, setMinValue] = useState<number>(0);
    const [lMinValue, setLMinValue] = useState<string>('0');

    const [maxValueEnabled, setMaxValueEnabled] = useState<boolean>(false);
    const [maxValue, setMaxValue] = useState<number>(0);
    const [lMaxValue, setLMaxValue] = useState<string>('0');

    useEffect(() => {

        if (!(props.dataSource instanceof FileDataSource)) {
            return;
        }

        if (props.dataSource.data) {
            setRawData(props.dataSource.data);
            setData(props.dataSource.data);
        }

        setDataSource(props.dataSource.toObject());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (datetimeField !== null && parameterField !== null && metadata) {
            const fData = cloneDeep(metadata.data);
            if (firstRowIsHeader) {
                fData.shift();
            }
            const cData: IDateTimeValue[] = fData.map((r) => ({
                timeStamp: moment.utc(r[datetimeField], dateTimeFormat).unix(),
                value: parseFloat(r[parameterField])
            })).filter((r) => !isNaN(r.value) && !isNaN(r.timeStamp));

            return setRawData(cData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [datetimeField, dateTimeFormat, parameterField]);

    useEffect(() => {
        let fData = cloneDeep(rawData);
        if (fData && (minValueEnabled || maxValueEnabled || beginEnabled || endEnabled)) {
            fData = fData.filter((v) =>
                !(minValueEnabled && v.value <= minValue) && !(maxValueEnabled && v.value >= maxValue) &&
                !(beginEnabled && v.timeStamp <= begin) && !(endEnabled && v.timeStamp >= end)
            );
            setData(fData);
        }
    }, [begin, beginEnabled, end, endEnabled, minValue, minValueEnabled, maxValue, maxValueEnabled, rawData]);

    useEffect(() => {
        if (!rawData || rawData.length === 0) {
            return;
        }

        if (!beginEnabled) {
            setBeginEnabled(true);
            setBegin(rawData[0].timeStamp);
            setLBegin(rawData[0].timeStamp);
        }

        if (!endEnabled) {
            setEndEnabled(true);
            setEnd(rawData[rawData.length - 1].timeStamp);
            setLEnd(rawData[rawData.length - 1].timeStamp);
        }
    }, [beginEnabled, endEnabled, rawData]);

    const handleSave = () => {
        if (!dataSource && data) {
            return FileDataSource.fromData(data).then((ds) => props.onSave(ds));
        }

        if (dataSource && data) {
            return FileDataSource.fromObject(dataSource).saveData(data).then((ds) => props.onSave(ds));
        }
    };

    const adding = () => !(props.dataSource instanceof FileDataSource);

    const handleBlur = (f: (v: any) => void) => (v: any) => {
        f(v);
    };

    const handleChange = (f: (v: any) => void) => (e: any, d: any) => {
        if (Object.prototype.hasOwnProperty.call(d, 'value')) {
            f(d.value);
        }

        if (Object.prototype.hasOwnProperty.call(d, 'checked')) {
            f(d.checked);
        }
    };

    const handleUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        const file = files && files.length > 0 ? files[0] : null;
        if (file) {
            setParsingData(true);
            Papa.parse(file, {
                complete: (results) => {
                    setMetadata(results);
                    setParsingData(false);
                }
            });
        }
    };

    const formatDateTimeTicks = (dt: number) => {
        return moment.unix(dt).format('YYYY/MM/DD');
    };

    // tslint:disable-next-line:variable-name
    const RenderNoShape = () => null;

    const renderDiagram = () => {
        if (!data) {
            return (
                <Header as={'h2'}>No data</Header>
            );
        }

        const downSampledDataLTOB: DataPoint[] = LTOB(data.map((ds: IDateTimeValue) => ({
            x: ds.timeStamp,
            y: ds.value
        })), 200);

        return (
            <ResponsiveContainer height={300}>
                <ScatterChart>
                    <XAxis
                        dataKey={'x'}
                        domain={[
                            data.length > 0 ? data[0].timeStamp : 'auto',
                            data.length > 0 ? data[data.length - 1].timeStamp : 'auto'
                        ]}
                        name={'Date Time'}
                        tickFormatter={formatDateTimeTicks}
                        type={'number'}
                    />
                    <YAxis dataKey={'y'} name={parameterField || ''} domain={['auto', 'auto']}/>
                    <Scatter
                        data={downSampledDataLTOB}
                        line={{stroke: '#1eb1ed', strokeWidth: 2}}
                        lineType={'joint'}
                        name={parameterField || ''}
                        shape={<RenderNoShape/>}
                    />
                </ScatterChart>
            </ResponsiveContainer>
        );
    };

    return (
        <Modal centered={false} open={true} dimmer={'blurring'}>
            {adding() && <Modal.Header>Add Datasource</Modal.Header>}
            {!adding() && <Modal.Header>Edit Datasource</Modal.Header>}
            <Modal.Content>
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
                                                <Form.Dropdown
                                                    label={'Datetime'}
                                                    name={'datetimeField'}
                                                    selection={true}
                                                    value={datetimeField !== null ? datetimeField : undefined}
                                                    onChange={handleChange(setDateTimeField)}
                                                    options={metadata.data[0].map((s: string, idx: number) => ({
                                                        key: idx,
                                                        value: idx,
                                                        text: firstRowIsHeader ? s : `Column ${idx + 1}`
                                                    }))}
                                                />
                                                <Form.Dropdown
                                                    label={'Parameter'}
                                                    name={'parameterField'}
                                                    selection={true}
                                                    value={parameterField !== null ? parameterField : undefined}
                                                    onChange={handleChange(setParameterField)}
                                                    options={metadata.data[0].map((s: string, idx: number) => ({
                                                        key: idx,
                                                        value: idx,
                                                        text: firstRowIsHeader ? s : `Column ${idx + 1}`
                                                    }))}
                                                />
                                            </Form.Group>
                                        </Form>
                                    </div>
                                    }
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>

                        {data &&
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Segment raised={true} loading={parsingData}>
                                    <Label as={'div'} color={'blue'} ribbon={true}>Time range</Label>
                                    <Form>
                                        <Form.Group>
                                            <Form.Checkbox
                                                disabled={true}
                                                style={{marginTop: '30px'}}
                                                toggle={true}
                                                checked={beginEnabled}
                                                onChange={handleChange(setBeginEnabled)}
                                            />
                                            <DatePicker
                                                label={'Start'}
                                                name={'start'}
                                                value={moment.unix(lBegin).toDate()}
                                                onChange={handleChange((d) => setLBegin(moment.utc(d).unix()))}
                                                onBlur={handleBlur(() => setBegin(lBegin))}
                                                size={'small'}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Checkbox
                                                disabled={true}
                                                style={{marginTop: '30px'}}
                                                toggle={true}
                                                checked={endEnabled}
                                                onChange={handleChange(setEndEnabled)}
                                            />
                                            <DatePicker
                                                label={'End'}
                                                name={'end'}
                                                value={moment.unix(lEnd).toDate()}
                                                onChange={handleChange((d) => setLEnd(moment.utc(d).unix()))}
                                                onBlur={handleBlur(() => setEnd(lBegin))}
                                                size={'small'}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={8} loading={parsingData.toString()}>
                                <Segment raised={true}>
                                    <Label as={'div'} color={'blue'} ribbon={true}>Value range</Label>
                                    <Form>
                                        <Form.Group>
                                            <Form.Checkbox
                                                style={{marginTop: '30px'}}
                                                toggle={true}
                                                checked={maxValueEnabled}
                                                onChange={handleChange(setMaxValueEnabled)}
                                            />
                                            <Form.Input
                                                label={'Upper limit'}
                                                type={'number'}
                                                value={lMaxValue}
                                                disabled={!maxValueEnabled}
                                                onBlur={handleBlur(() => setMaxValue(parseFloat(lMaxValue)))}
                                                onChange={handleChange((v) => setLMaxValue(v))}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Checkbox
                                                style={{marginTop: '30px'}}
                                                toggle={true}
                                                checked={minValueEnabled}
                                                onChange={handleChange(setMinValueEnabled)}
                                            />
                                            <Form.Input
                                                label={'Lower limit'}
                                                type={'number'}
                                                value={lMinValue}
                                                disabled={!minValueEnabled}
                                                onBlur={handleBlur(() => setMinValue(parseFloat(lMinValue)))}
                                                onChange={handleChange((v) => setLMinValue(v))}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>}
                    </React.Fragment>}

                    {data &&
                    <Grid.Row>
                        <Grid.Column>
                            <Segment loading={parsingData} raised={true}>
                                {!parsingData && <Label as={'div'} color={'red'} ribbon={true}>Data</Label>}
                                {renderDiagram()}
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

export default FileDatasourceEditor;
