import moment from 'moment';
import React, {useState} from 'react';
import {Button, Dropdown, Grid, Header, Icon, Label, Modal, Segment, Table} from 'semantic-ui-react';
import Uuid from 'uuid';
import {Rtm} from '../../../core/model/rtm';
import {IDataSource, ISensorParameter} from '../../../core/model/rtm/Sensor.type';
import {dataSourceList, parameterList} from '../defaults';
import {colors} from '../defaults';
import {CSVDatasource, DataSourcesChart, OnlineDatasource, TinyLineChart} from './index';

interface IProps {
    rtm: Rtm;
    parameter: ISensorParameter;
    onChange: (parameter: ISensorParameter) => void;
}

const dataSources = (props: IProps) => {

    const [datasource, setDatasource] = useState<IDataSource | null>(null);

    const getTimeRangeText = (timeRange: any) => {
        if (!timeRange) {
            return '-';
        }

        const [beginTimeStamp, endTimeStamp] = timeRange;

        let begin = '';
        if (beginTimeStamp) {
            begin = moment.unix(beginTimeStamp).format('YYYY/MM/DD');
        }

        let end = '';
        if (endTimeStamp) {
            end = moment.unix(endTimeStamp).format('YYYY/MM/DD');
        }

        return `${begin} - ${end}`;
    };

    const getValueRangeText = (valueRange: any) => {
        if (!valueRange) {
            return '-';
        }

        const [minValue, maxValue] = valueRange;

        if (minValue && maxValue) {
            return `${minValue} - ${maxValue}`;
        }

        if (minValue) {
            return `>= ${minValue}`;
        }

        if (maxValue) {
            return `<= ${maxValue}`;
        }

        return '-';
    };

    const handleAddEditDataSource = () => {

        const {parameter} = props;
        if (!parameter || !datasource) {
            return;
        }

        let add = true;
        parameter.dataSources = parameter.dataSources.map((ds) => {
            if (ds.id === datasource.id) {
                add = false;
                return datasource;
            }

            return ds;
        });

        if (add) {
            parameter.dataSources.push(datasource);
        }

        setDatasource(null);
        props.onChange(parameter);
    };

    const handleAddDataSourceClick = (dsType: string) => () => {
        if (dsType === 'csv') {
            setDatasource({id: Uuid.v4(), type: dsType});
        }

        if (dsType === 'online') {
            setDatasource({id: Uuid.v4(), type: dsType});
        }
    };

    const handleCancelAddDataSourceClick = () => {
        setDatasource(null);
    };

    const handleDeleteDataSourceClick = (id: string) => () => {

        const {parameter} = props;
        if (!parameter) {
            return;
        }

        parameter.dataSources = parameter.dataSources.filter((ds: IDataSource) => ds.id !== id);
        props.onChange(parameter);
    };

    const handleEditDataSourceClick = (id: string) => () => {
        const {parameter} = props;
        if (!parameter) {
            return;
        }

        const filteredDs = parameter.dataSources.filter((ds: IDataSource) => ds.id === id);
        if (filteredDs.length === 0) {
            return;
        }

        setDatasource(filteredDs[0]);
    };

    if (!props.parameter) {
        return null;
    }

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column>
                    <Segment color={'red'} raised={true}>
                        <Header as={'h2'} dividing={true}>
                            {parameterList.filter((i) => i.parameter === props.parameter.type)[0].text}
                        </Header>
                        <Label color={'blue'} ribbon={true} size={'large'}>
                            Data sources
                        </Label>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Type</Table.HeaderCell>
                                    <Table.HeaderCell>Time range</Table.HeaderCell>
                                    <Table.HeaderCell>Value range</Table.HeaderCell>
                                    <Table.HeaderCell/>
                                    <Table.HeaderCell/>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {props.parameter.dataSources.sort((a, b) => {
                                    if (a.timeRange && b.timeRange) {
                                        const aBegin = a.timeRange[0];
                                        const bBegin = b.timeRange[0];

                                        if (aBegin && bBegin) {
                                            return aBegin - bBegin;
                                        }
                                    }

                                    return 1;

                                }).map((ds, key) => (
                                    <Table.Row key={key}>
                                        <Table.Cell>{ds.type}</Table.Cell>
                                        <Table.Cell>{getTimeRangeText(ds.timeRange)}</Table.Cell>
                                        <Table.Cell>{getValueRangeText(ds.valueRange)}</Table.Cell>
                                        <Table.Cell>
                                            <TinyLineChart url={ds.url} color={colors[key]}/>
                                        </Table.Cell>
                                        <Table.Cell textAlign={'right'}>
                                            {!props.rtm.readOnly &&
                                            <Button.Group>
                                                <Button icon={true} onClick={handleEditDataSourceClick(ds.id)}>
                                                    <Icon name={'edit'}/>
                                                </Button>
                                                <Button icon={true} onClick={handleDeleteDataSourceClick(ds.id)}>
                                                    <Icon name={'trash'}/>
                                                </Button>
                                            </Button.Group>}
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>

                            {!props.rtm.readOnly &&
                            <Table.Footer>
                                <Table.Row>
                                    <Table.HeaderCell colSpan={5}>
                                        <Button
                                            as="div"
                                            labelPosition="left"
                                            floated={'right'}
                                        >
                                            <Dropdown
                                                text="Add"
                                                icon="add"
                                                labeled={true}
                                                button={true}
                                                className="icon blue"
                                                disabled={props.rtm.readOnly}
                                            >
                                                <Dropdown.Menu>
                                                    <Dropdown.Header>Choose type</Dropdown.Header>
                                                    {dataSourceList.map((ds) =>
                                                        <Dropdown.Item
                                                            key={ds}
                                                            text={ds}
                                                            onClick={handleAddDataSourceClick(ds)}
                                                        />
                                                    )}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Button>
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                            }
                        </Table>
                    </Segment>
                    <Segment color={'grey'} raised={true}>
                        <Label color={'blue'} ribbon={true} size={'large'}>
                            Chart
                        </Label>
                        <DataSourcesChart dataSources={props.parameter.dataSources}/>
                    </Segment>
                </Grid.Column>
            </Grid.Row>

            {datasource &&
            <Modal centered={false} open={true} dimmer={'blurring'}>
                <Modal.Header>Add Datasource</Modal.Header>
                <Modal.Content>
                    {datasource && datasource.type === 'csv' &&
                    <CSVDatasource dataSource={datasource} onChange={setDatasource}/>
                    }

                    {datasource && datasource.type === 'online' &&
                    <OnlineDatasource dataSource={datasource} onChange={setDatasource}/>
                    }
                </Modal.Content>
                <Modal.Actions>
                    <Button negative={true} onClick={handleCancelAddDataSourceClick}>Cancel</Button>
                    <Button positive={true} onClick={handleAddEditDataSource}>Apply</Button>
                </Modal.Actions>
            </Modal>}
        </Grid>
    );
};

export default dataSources;
