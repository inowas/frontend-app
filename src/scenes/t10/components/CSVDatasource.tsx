import {cloneDeep} from 'lodash';
import moment from 'moment';
import * as Papa from 'papaparse';
import {ParseResult} from 'papaparse';
import React, {ChangeEvent, useEffect, useState} from 'react';
import {ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {Form, Grid, Header, Label, List, Segment} from 'semantic-ui-react';
import {ICSVDataSource} from '../../../core/model/rtm/Sensor.type';
import {dropData, retrieveDroppedData} from '../../../services/api';

interface IDateTimeValue {
    timeStamp: number;
    value: number;
}

interface IProps {
    dataSource: ICSVDataSource;
    onChange: (ds: ICSVDataSource) => void;
}

const csvDatasource = (props: IProps) => {
    const [data, setData] = useState<IDateTimeValue[] | null>(null);
    const [filteredData, setFilteredData] = useState<IDateTimeValue[] | null>(null);
    const [metadata, setMetadata] = useState<ParseResult | null>(null);

    const [dateTimeFormat, setDateTimeFormat] = useState<string>('DD.MM.YYYY H:i:s');
    const [firstRowIsHeader, setFirstRowIsHeader] = useState<boolean>(true);

    const [datetimeField, setDateTimeField] = useState<number | null>(null);
    const [parameterField, setParameterField] = useState<number | null>(null);

    const [fetchingData, setFetchingData] = useState<boolean>(false);
    const [parsingData, setParsingData] = useState<boolean>(false);

    const [isFetched, setIsFetched] = useState<boolean>(false);

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
        const {dataSource} = props;
        if (dataSource && dataSource.url && dataSource.property) {
            setFetchingData(true);
            retrieveDroppedData(dataSource.url,
                (rData) => {
                    setFetchingData(false);
                    setIsFetched(true);
                    setParameterField(0);
                    return setData(rData as IDateTimeValue[]);
                },
                () => {
                    setFetchingData(false);
                }
            );
        }
    }, []);

    useEffect(() => {
        if (datetimeField !== null && parameterField !== null && metadata) {
            const fData = cloneDeep(metadata.data);
            if (firstRowIsHeader) {
                fData.shift();
            }
            const cData: IDateTimeValue[] = fData.map((r) => {
                return {
                    timeStamp: moment.utc(r[datetimeField], dateTimeFormat).unix(),
                    value: parseFloat(r[parameterField])
                };
            });
            sendData(cData);
            return setData(cData);
        }
    }, [datetimeField, dateTimeFormat, parameterField]);

    useEffect(() => {
        let fData = cloneDeep(data);
        if (fData && (minValueEnabled || maxValueEnabled || beginEnabled || endEnabled)) {
            fData = fData.filter((v) =>
                !(minValueEnabled && v.value <= minValue) && !(maxValueEnabled && v.value >= maxValue) &&
                !(beginEnabled && v.timeStamp <= begin) && !(endEnabled && v.timeStamp >= end)
            );
            sendData(fData);
            return setFilteredData(fData);
        }
    }, [begin, beginEnabled, end, endEnabled, minValue, minValueEnabled, maxValue, maxValueEnabled]);

    const sendData = (sData: IDateTimeValue[]) => {
        setFetchingData(true);
        dropData(sData,
            (url) => {
                setFetchingData(false);
                const ds = {
                    ...props.dataSource,
                    property: parameterField,
                    url: url.filename
                };
                return props.onChange(ds);
            },
            () => {
                setFetchingData(false);
            }
        );
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

    const renderDiagram = () => {
        if (!data || parameterField === null) {
            return (
                <Header as={'h2'}>No data</Header>
            );
        }

        return (
            <ResponsiveContainer height={300}>
                <ScatterChart>
                    <XAxis
                        dataKey={'timeStamp'}
                        domain={['auto', 'auto']}
                        name={'Date Time'}
                        tickFormatter={formatDateTimeTicks}
                        type={'number'}
                    />
                    <YAxis dataKey={'value'} name={parameterField} domain={['auto', 'auto']}/>
                    <Scatter
                        data={filteredData !== null ? filteredData : data}
                        line={{stroke: '#eee'}}
                        lineJointType={'monotoneX'}
                        lineType={'joint'}
                        name={parameterField}
                    />
                </ScatterChart>
            </ResponsiveContainer>
        );
    };

    return (
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
                                            <List.Description as="a">{e.message} in row {e.row}</List.Description>
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
    );
};

export default csvDatasource;
