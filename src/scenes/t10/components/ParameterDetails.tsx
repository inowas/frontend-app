import React, {useEffect, useState} from 'react';
import {Button, Form, Modal, Segment} from 'semantic-ui-react';
import {Rtm} from '../../../core/model/rtm';
import {IDataSource, IDateTimeValue, IFilter, ISensorParameter} from '../../../core/model/rtm/Sensor.type';
import {OnlineDatasource} from './index';
import {parameterList} from './Parameters';

interface IProps {
    rtm: Rtm;
    sensorProperty: ISensorParameter | null;
    onChange: (property: ISensorParameter) => void;
    onClose: () => void;
}

const parameterDetails = (props: IProps) => {

    const [parameterType, setParameterType] = useState<string>('');
    const [parameterDescription, setParameterDescription] = useState<string>('');
    const [dataSource, setDataSource] = useState<IDataSource>({type: 'noSource'});
    const [filters, setFilters] = useState<IFilter[]>([]);
    const [data, setData] = useState<IDateTimeValue[]>([]);

    useEffect(() => {
        if (props.sensorProperty) {
            setParameterType(props.sensorProperty.type);
            setParameterDescription(props.sensorProperty.description);
            setDataSource(props.sensorProperty.dataSource);
            setFilters(props.sensorProperty.filters);
            setData(props.sensorProperty.data);
        }
    }, []);

    const handleChange = (func: (value: any) => void) => (e: any, d: any) => {
        const v = d.value;
        func(v);
    };

    const handleApply = () => {
        if (props.sensorProperty) {
            const property = {
                ...props.sensorProperty,
                id: props.sensorProperty.id,
                type: parameterType,
                description: parameterDescription,
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
                <OnlineDatasource dataSource={ds} onChange={setDataSource}/>
            );
        }

        return (<h1> NoSource </h1>);
    };

    return (
        <Modal centered={false} onClose={props.onClose} closeIcon={true} open={true} dimmer={'blurring'}>
            <Modal.Header>Edit sensor property</Modal.Header>
            <Modal.Content scrolling={true}>
                <Segment color={'grey'}>
                    <Form>
                        <Form.Group>
                            <Form.Dropdown
                                fluid={true}
                                selection={true}
                                label={'Parameter'}
                                placeholder={'Parameter'}
                                name={'type'}
                                value={parameterType}
                                onChange={handleChange(setParameterType)}
                                options={parameterList.map((i) => ({
                                    key: i.parameter,
                                    text: i.text,
                                    value: i.parameter
                                }))}
                            />
                            <Form.Input
                                label={'Description'}
                                name={'description'}
                                value={parameterDescription}
                                onChange={handleChange(setParameterDescription)}
                            />
                            <Form.Dropdown
                                label={'Data source'}
                                value={dataSource.type}
                                selection={true}
                                options={[
                                    {key: 0, value: 'noSource', text: 'No data source'},
                                    {key: 1, value: 'online', text: 'Online'},
                                ]}
                                onChange={handleChangeDataSourceType}
                            />
                        </Form.Group>
                    </Form>
                </Segment>
                <Segment color={'blue'}>
                    {dataSource && renderDataSourceDetails(dataSource)}
                </Segment>
            </Modal.Content>
            <Modal.Actions>
                <Button negative={true} onClick={props.onClose}>Cancel</Button>
                <Button positive={true} onClick={handleApply}>Apply</Button>
            </Modal.Actions>
        </Modal>
    );
};

export default parameterDetails;
