import React, {useEffect, useState} from 'react';
import {Button, Form, Modal, Segment} from 'semantic-ui-react';
import {Rtm} from '../../../core/model/rtm';
import {IDataSource, IDateTimeValue, IFilter, ISensorProperty} from '../../../core/model/rtm/Sensor.type';

interface IProps {
    rtm: Rtm;
    sensorProperty: ISensorProperty | null;
    onChange: (property: ISensorProperty) => void;
    onClose: () => void;
}

const sensorPropertyDetails = (props: IProps) => {

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

    const handleChangeDataSourceType = (e: any, d: any) => {
        if (props.sensorProperty) {
            const ds = props.sensorProperty.dataSource;
            ds.type = d.value;
            handleChangeDataSource(ds);
        }
    };

    const handleChangeDataSource = (ds: IDataSource) => {
        if (props.sensorProperty) {
            const p = {
                ...props.sensorProperty,
                dataSource: ds
            };
            props.onChange(p);
        }
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

    const renderDataSourceDetails = (ds: IDataSource) => {
        switch (ds.type) {
            case 'sensoWeb':
                return (<h1>SensoWeb</h1>);
            default:
                return (<h1>NoSource</h1>);
        }
    };

    return (
        <Modal centered={false} onClose={props.onClose} closeIcon={true} open={true} dimmer={'blurring'}>
            <Modal.Header>Edit sensor property</Modal.Header>
            <Modal.Content>
                <Segment color={'red'}>
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
                                {key: 1, value: 'sensoWeb', text: 'Sensoweb'},
                            ]}
                            onChange={handleChangeDataSourceType}
                        />
                    </Form>
                    {props.sensorProperty.dataSource && renderDataSourceDetails(props.sensorProperty.dataSource)}
                </Segment>
            </Modal.Content>
            <Modal.Actions>
                <Button negative={true} onClick={props.onClose}>Cancel</Button>
                <Button labelPosition={'right'} content={'Save'} onClick={handleSave}/>
            </Modal.Actions>
        </Modal>
    );
};

export default sensorPropertyDetails;
