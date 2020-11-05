import {
    Button,
    Checkbox,
    DropdownProps,
    Form,
    Grid,
    Icon,
    Loader, Message,
    Segment
} from 'semantic-ui-react';
import {DatePicker} from '../../shared/uiComponents';
import {ETimeResolution} from '../../../core/model/rtm/modelling/RTModelling.type';
import {IToolInstance} from '../../dashboard/defaults/tools';
import {fetchApiWithToken} from '../../../services/api';
import {uniqBy} from 'lodash';
import AppContainer from '../../shared/AppContainer';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import uuid from 'uuid';
import {IDatePickerProps} from '../../shared/uiComponents/DatePicker';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools/t03-modflow-model-setup-and-editor/',
    icon: <Icon name="file"/>
}];

const CreateRealTimeModelling = () => {
    const [automaticCalculation, setAutomaticCalculation] = useState<boolean>(true);
    const [errors, setErrors] = useState<Array<{ id: string; message: string; }>>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<string>();
    const [startDateTime, setStartDateTime] = useState<Date | null>(null);
    const [t03Instances, setT03Instances] = useState<IToolInstance[]>();
    const [timeResolution, setTimeResolution] = useState<ETimeResolution>(ETimeResolution.DAILY);

    useEffect(() => {
        const fetchInstances = async () => {
            try {
                setIsFetching(true);
                const privateT03Instances = (await fetchApiWithToken('tools/T03?public=false')).data;
                const publicT03Instances = (await fetchApiWithToken('tools/T03?public=true')).data;

                const tools = uniqBy(privateT03Instances.concat(publicT03Instances), (t: IToolInstance) => t.id);
                setT03Instances(tools);
            } catch (err) {
                setErrors([{id: uuid.v4(), message: 'Fetching t03 instances failed.'}]);
            } finally {
                setIsFetching(false);
            }
        };

        fetchInstances();
    }, []);

    const handleChangeAutomaticCalculation = () => setAutomaticCalculation(!automaticCalculation);

    const handleChangeModel = (e: SyntheticEvent<HTMLElement, Event>, {value}: DropdownProps) => {
        if (typeof value === 'string') {
            setSelectedId(value);
        }
    };

    const handleChangeResolution = (e: SyntheticEvent<HTMLElement, Event>, {value}: DropdownProps) => {
        if (value === ETimeResolution.DAILY) {
            setTimeResolution(value);
        }
    }

    const handleChangeStartDate = (e: React.SyntheticEvent, {value}: IDatePickerProps) => setStartDateTime(value);

    return (
        <AppContainer navbarItems={navigation}>
            <Segment color={'grey'}>
                <Form>
                    <Grid padded={true} columns={2}>
                        <Grid.Row stretched={true}>
                            <Grid.Column width={10}>
                                <Segment>
                                    <Form.Field>
                                        <label>Model</label>
                                        {isFetching &&
                                        <Loader active={true} inline='centered'/>
                                        }
                                        {t03Instances &&
                                        <Form.Select
                                            options={t03Instances.map((i, key) => {
                                                return {
                                                    key,
                                                    value: i.id,
                                                    text: i.name
                                                }
                                            })}
                                            onChange={handleChangeModel}
                                            value={selectedId}
                                        />
                                        }
                                    </Form.Field>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <Segment>
                                    <Form.Select
                                        label="Time resolution"
                                        options={[
                                            {key: 'daily', value: ETimeResolution.DAILY, text: 'Daily'}
                                        ]}
                                        onChange={handleChangeResolution}
                                        value={timeResolution}
                                    />
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column width={10}>
                                                <Form.Field>
                                                    <label>Start date</label>
                                                    <DatePicker value={startDateTime} onChange={handleChangeStartDate}/>
                                                </Form.Field>
                                            </Grid.Column>
                                            <Grid.Column width={6}>
                                                <Form.Field>
                                                    <label>Automatic calculation</label>
                                                    <Checkbox
                                                        toggle={true}
                                                        checked={automaticCalculation}
                                                        onChange={handleChangeAutomaticCalculation}
                                                    />
                                                </Form.Field>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        {errors.length > 0 &&
                        <Grid.Row>
                            <Grid.Column width={16}>
                                {errors.map((error) => (
                                    <Message negative={true} key={error.id}>
                                        <Message.Header>Error</Message.Header>
                                        <p>{error.message}</p>
                                    </Message>
                                ))}
                            </Grid.Column>
                        </Grid.Row>
                        }
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Button
                                    floated={'right'}
                                    primary={true}
                                    type={'submit'}
                                    negative={!selectedId}
                                >
                                    Create model
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Form>
            </Segment>
        </AppContainer>
    );
}

export default CreateRealTimeModelling;
