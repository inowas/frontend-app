import React, {useEffect, useState} from 'react';
import {Button, Form, Modal, Segment} from 'semantic-ui-react';
import {Rtm} from '../../../core/model/rtm';
import {IDataSource, IDateTimeValue, IFilter, ISensorProperty} from '../../../core/model/rtm/Sensor.type';
import {OnlineDatasource} from './index';

interface IProps {
    rtm: Rtm;
    sensorProperty: ISensorProperty | null;
    onChange: (property: ISensorProperty) => void;
    onClose: () => void;
}

const parameterDetails = (props: IProps) => {

    const [name, setName] = useState<string>('name');
    const [dataSource, setDataSource] = useState<IDataSource>({type: 'noSource', query: null, server: null});
    const [filters, setFilters] = useState<IFilter[]>([]);
    const [data, setData] = useState<IDateTimeValue[]>([]);

    useEffect(() => {
        if (props.sensorProperty) {
            setName(props.sensorProperty.name);
            setDataSource(props.sensorProperty.dataSource);
            setFilters(props.sensorProperty.filters);
            setData(props.sensorProperty.data);
        }
    }, []);

    const handleChange = (func: (value: any) => void) => (e: any, d: any) => {
        const v = d.value;
        func(v);
    };

    const handleSave = () => {
        if (props.sensorProperty) {
            const property = {
                ...props.sensorProperty,
                id: props.sensorProperty.id,
                name,
                dataSource,
                filters,
                data
            };

            props.onChange(property);
            props.onClose();
        }
    };

    if (!props.sensorProperty) {
        return null;
    }

    const handleChangeDataSourceType = (e: any, d: any) => {
        setDataSource({...dataSource, type: d.value});
    };

    const renderDataSourceDetails = (ds: IDataSource) => {
        if (ds.type === 'online') {
            return (
                <OnlineDatasource datasource={ds} onChange={setDataSource}/>
            );
        }

        return (<h1> NoSource </h1>);
    };

    return (
        <Modal centered={false} onClose={props.onClose} closeIcon={true} open={true} dimmer={'blurring'}>
            <Modal.Header>Edit sensor property</Modal.Header>
            <Modal.Content>
                <Segment color={'grey'}>
                    <Form>
                        <Form.Group>
                            <Form.Input
                                label={'Name'}
                                name={'name'}
                                value={name}
                                onChange={handleChange(setName)}
                            />
                        </Form.Group>
                    </Form>
                </Segment>
                <Segment color={'blue'}>
                    <Form>
                        <Form.Dropdown
                            label={'Data source'}
                            value={dataSource.type}
                            options={[
                                {key: 0, value: 'noSource', text: 'No data source'},
                                {key: 1, value: 'online', text: 'Online'},
                            ]}
                            onChange={handleChangeDataSourceType}
                        />
                    </Form>
                    {dataSource && renderDataSourceDetails(dataSource)}
                </Segment>
            </Modal.Content>
            <Modal.Actions>
                <Button negative={true} onClick={props.onClose}>Cancel</Button>
                <Button positive={true} labelPosition={'right'} onClick={handleSave}>Apply</Button>
            </Modal.Actions>
        </Modal>
    );
};

export default parameterDetails;
