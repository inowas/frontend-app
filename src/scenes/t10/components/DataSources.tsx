import React, {useEffect, useState} from 'react';
import {Button, Dropdown, Grid, Header, Icon, Label, Segment, Table} from 'semantic-ui-react';
import {DataSourceCollection, DataSourceFactory, Rtm} from '../../../core/model/rtm';
import FileDataSource from '../../../core/model/rtm/FileDataSource';
import {DataSource, IDataSource, ISensorParameter} from '../../../core/model/rtm/Sensor.type';
import SensorDataSource from '../../../core/model/rtm/SensorDataSource';
import {colors, dataSourceList, parameterList} from '../defaults';
import {
    DataSourcesChart,
    DataSourceTimeRange,
    FileDatasourceEditor,
    SensorDatasourceEditor,
    TinyLineChart
} from './index';

interface IProps {
    rtm: Rtm;
    parameter: ISensorParameter;
    onChange: (parameter: ISensorParameter) => void;
}

const arrayMoveItems = (arr: any[], from: number, to: number) => {
    if (from !== to && 0 <= from && from <= arr.length && 0 <= to && to <= arr.length) {
        const tmp = arr[from];
        if (from < to) {
            for (let i = from; i < to; i++) {
                arr[i] = arr[i + 1];
            }
        } else {
            for (let i = from; i > to; i--) {
                arr[i] = arr[i - 1];
            }
        }
        arr[to] = tmp;
    }

    return arr;
};

const dataSources = (props: IProps) => {
    const [addDatasource, setAddDatasource] = useState<string | null>(null);
    const [editDatasource, setEditDatasource] = useState<DataSource | null>(null);

    useEffect(() => {
        props.parameter.dataSources.map((ds) => {
            const d = DataSourceFactory.fromObject(ds);
            if (d === null) {
                return ds;
            }

            d.loadData().then(() => handleUpdateDataSource(d));
        });
    }, []);

    const getDsType = (ds: DataSource) => {
        if (ds instanceof FileDataSource) {
            return 'file';
        }

        return 'online';
    };

    const handleAddDataSource = (ds: DataSource) => {

        const {parameter} = props;
        if (!parameter) {
            return;
        }

        parameter.dataSources.push(ds.toObject());
        setAddDatasource(null);
        props.onChange(parameter);
    };

    const handleUpdateDataSource = (ds: DataSource) => {
        const {parameter} = props;
        if (!parameter) {
            return;
        }

        parameter.dataSources = parameter.dataSources.map((d) => {
            if (d.id === ds.id) {
                return ds.toObject();
            }

            return d;
        });

        setEditDatasource(null);
        props.onChange(parameter);
    };

    const handleAddDataSourceClick = (dsType: string) => () => {
        setAddDatasource(dsType);
    };

    const handleCancelDataSourceClick = () => {
        setAddDatasource(null);
        setEditDatasource(null);
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

        setEditDatasource(DataSourceFactory.fromObject(filteredDs[0]));
    };

    const handleMoveDataSourceClick = (from: number, to: number) => () => {
        const {parameter} = props;
        parameter.dataSources = arrayMoveItems(parameter.dataSources, from, to);
        props.onChange(parameter);
    };

    const renderDatasourceDetails = () => {
        if (addDatasource) {
            switch (addDatasource) {
                case 'online':
                    return (
                        <SensorDatasourceEditor
                            onCancel={handleCancelDataSourceClick}
                            onSave={handleAddDataSource}
                        />
                    );
                case 'file':
                    return (
                        <FileDatasourceEditor
                            onCancel={handleCancelDataSourceClick}
                            onSave={handleAddDataSource}
                        />
                    );
            }
        }

        if (editDatasource) {
            if (editDatasource instanceof SensorDataSource) {
                return (
                    <SensorDatasourceEditor
                        dataSource={editDatasource}
                        onCancel={handleCancelDataSourceClick}
                        onSave={handleUpdateDataSource}
                    />
                );
            }

            return (
                <FileDatasourceEditor
                    dataSource={editDatasource}
                    onCancel={handleCancelDataSourceClick}
                    onSave={handleUpdateDataSource}
                />
            );
        }

        return null;
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
                                    <Table.HeaderCell/>
                                    <Table.HeaderCell/>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {props.parameter.dataSources.map((ds, key) => {
                                    const dsInst = DataSourceFactory.fromObject(ds);
                                    if (dsInst === null) {
                                        return null;
                                    }

                                    return (
                                        <Table.Row key={key}>
                                            <Table.Cell>{getDsType(dsInst)}</Table.Cell>
                                            <Table.Cell>
                                                <DataSourceTimeRange datasource={dsInst}/>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <TinyLineChart
                                                    datasource={dsInst}
                                                    color={colors[key]}
                                                    begin={DataSourceCollection
                                                        .fromObject(props.parameter.dataSources).globalBegin()}
                                                    end={DataSourceCollection
                                                        .fromObject(props.parameter.dataSources).globalEnd()}
                                                />
                                            </Table.Cell>
                                            <Table.Cell textAlign={'right'}>
                                                {!props.rtm.readOnly &&
                                                <div>
                                                    <Button.Group>
                                                        <Button
                                                            icon={true}
                                                            onClick={handleMoveDataSourceClick(key, key - 1)}
                                                            disabled={key === 0}
                                                        >
                                                            <Icon name={'arrow up'}/>
                                                        </Button>
                                                        <Button
                                                            icon={true}
                                                            onClick={handleMoveDataSourceClick(key, key + 1)}
                                                            disabled={key === props.parameter.dataSources.length - 1}
                                                        >
                                                            <Icon name={'arrow down'}/>
                                                        </Button>
                                                    </Button.Group>
                                                    {' '}
                                                    <Button.Group>
                                                        <Button
                                                            icon={true}
                                                            onClick={handleEditDataSourceClick(dsInst.id)}
                                                        >
                                                            <Icon name={'edit'}/>
                                                        </Button>
                                                        <Button
                                                            icon={true}
                                                            onClick={handleDeleteDataSourceClick(dsInst.id)}
                                                        >
                                                            <Icon name={'trash'}/>
                                                        </Button>
                                                    </Button.Group>
                                                </div>}
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
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

                    {props.parameter.dataSources.length > 0 &&
                    <Segment color={'grey'} raised={true}>
                        <Label color={'blue'} ribbon={true} size={'large'}>
                            Chart
                        </Label>
                        <DataSourcesChart dataSources={DataSourceCollection.fromObject(props.parameter.dataSources)}/>
                    </Segment>
                    }

                </Grid.Column>
            </Grid.Row>
            {renderDatasourceDetails()}
        </Grid>
    );
};

export default dataSources;
