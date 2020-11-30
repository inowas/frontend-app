import {BasicTileLayer} from '../../../services/geoTools/tileLayers';
import {
    Button,
    Checkbox, CheckboxProps,
    DropdownProps,
    Form,
    Grid,
    Icon, InputOnChangeData,
    Loader, Message,
    Segment, TextAreaProps
} from 'semantic-ui-react';
import {DatePicker} from '../../shared/uiComponents';
import {ETimeResolution} from '../../../core/model/rtm/modelling/RTModelling.type';
import {IDatePickerProps} from '../../shared/uiComponents/DatePicker';
import {IModflowModel} from '../../../core/model/modflow/ModflowModel.type';
import {IToolInstance} from '../../dashboard/defaults/tools';
import {Map} from 'react-leaflet';
import {ModflowModel} from '../../../core/model/modflow';
import {createToolInstance} from '../../dashboard/commands';
import {fetchApiWithToken, fetchUrl, sendCommand} from '../../../services/api';
import {renderAreaLayer} from '../../t03/components/maps/mapLayers';
import {uniqBy} from 'lodash';
import { useHistory } from 'react-router-dom';
import AppContainer from '../../shared/AppContainer';
import RTModelling from '../../../core/model/rtm/modelling/RTModelling';
import React, {FormEvent, SyntheticEvent, useEffect, useState} from 'react';
import uuid from 'uuid';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools/t03-modflow-model-setup-and-editor/',
    icon: <Icon name="file"/>
}];

const style = {
    map: {
        height: '250px',
        width: '100%'
    }
};

const CreateRealTimeModelling = () => {
    const [activeInput, setActiveInput] = useState<string>();
    const [activeValue, setActiveValue] = useState<string>('');
    const [automaticCalculation, setAutomaticCalculation] = useState<boolean>(true);
    const [errors, setErrors] = useState<Array<{ id: string; message: string; }>>([]);
    const [description, setDescription] = useState<string>('')
    const [instanceName, setInstanceName] = useState<string>('New real time modelling');
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isPublic, setIsPublic] = useState<boolean>(true);
    const [selectedId, setSelectedId] = useState<string>();
    const [selectedModel, setSelectedModel] = useState<IModflowModel>();
    const [startDateTime, setStartDateTime] = useState<Date | null>(null);
    const [t03Instances, setT03Instances] = useState<IToolInstance[]>();
    const [timeResolution, setTimeResolution] = useState<ETimeResolution>(ETimeResolution.DAILY);

    const history = useHistory();

    useEffect(() => {
        const fetchInstances = async () => {
            try {
                setIsFetching(true);
                const privateT03Instances = (await fetchApiWithToken('tools/T03?public=false')).data;
                const publicT03Instances = (await fetchApiWithToken('tools/T03?public=true')).data;

                const tools = uniqBy(privateT03Instances.concat(publicT03Instances), (t: IToolInstance) => t.id);
                setT03Instances(tools);
            } catch (err) {
                setErrors(errors.concat([{id: uuid.v4(), message: 'Fetching t03 instances failed.'}]));
            } finally {
                setIsFetching(false);
            }
        };

        fetchInstances();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchModel = (id: string) => {
        setIsFetching(true);
        fetchUrl(
            `modflowmodels/${id}`,
            (data) => {
                const mfModel = ModflowModel.fromQuery(data);
                setSelectedModel(mfModel.toObject());
                setStartDateTime(new Date(mfModel.discretization.stressperiods.end_date_time));
                setIsFetching(false);
            },
            () => {
                setErrors(errors.concat([{id: uuid.v4(), message: 'Fetching model failed.'}]));
                setIsFetching(false);
            }
        );
    };

    const handleApply = () => {
        if (!selectedModel || !startDateTime) {
            return null;
        }
        
        const rtm = RTModelling.fromDefaults();
        rtm.name = instanceName;
        rtm.description = description;
        rtm.public = isPublic;
        rtm.data = {
            model_id: selectedModel.id,
            automatic_calculation: automaticCalculation,
            simulated_times: [],
            start_date_time: startDateTime.toDateString(),
            time_resolution: timeResolution
        }

        sendCommand(createToolInstance(rtm.tool, rtm.toObject()),
            () => history.push(`/tools/${rtm.tool}/${rtm.id}`),
            () => setErrors(errors.concat([{id: uuid.v4(), message: 'Creating instance failed.'}]))
        );
    };

    const handleBlurInput = () => {
        if (activeInput === 'name') {
            setInstanceName(activeValue);
        }
        if (activeInput === 'description') {
            setDescription(activeValue);
        }
        setActiveInput(undefined);
    }

    const handleChangeCheckbox = (e: FormEvent<HTMLInputElement>, {name}: CheckboxProps) => {
        if (name === 'automaticCalculation') {
            setAutomaticCalculation(!automaticCalculation);
        }
        if (name === 'isPublic') {
            setIsPublic(!isPublic);
        }
    };

    const handleChangeInput = (e: FormEvent, {name, value}: InputOnChangeData | TextAreaProps) => {
        setActiveInput(name);
        if (typeof value === 'string') {
            setActiveValue(value);
        }
    };

    const handleChangeModel = (e: SyntheticEvent<HTMLElement, Event>, {value}: DropdownProps) => {
        if (typeof value === 'string') {
            setSelectedId(value);
            fetchModel(value);
        }
    };

    const handleChangeResolution = (e: SyntheticEvent<HTMLElement, Event>, {value}: DropdownProps) => {
        if (value === ETimeResolution.DAILY) {
            setTimeResolution(value);
        }
    }

    const handleChangeStartDate = (e: React.SyntheticEvent, {value}: IDatePickerProps) => setStartDateTime(value);

    const renderMap = () => {
        if (!selectedModel) {
            return null;
        }
        const model = ModflowModel.fromObject(selectedModel);

        return (
            <Segment>
                <p>{selectedModel.description}</p>
                <Map
                    style={style.map}
                    bounds={model.boundingBox.getBoundsLatLng()}
                >
                    <BasicTileLayer/>
                    {renderAreaLayer(model.geometry)}
                </Map>
            </Segment>
        )
    };

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
                                        {isFetching &&
                                        <Loader active={true} inline='centered'/>
                                        }
                                    </Form.Field>
                                </Segment>
                                {renderMap()}
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <Segment>
                                    <Form>
                                        <Form.Group>
                                            <Form.Input
                                                label="Name"
                                                name={'name'}
                                                value={activeInput === 'name' ? activeValue : instanceName}
                                                width={14}
                                                onBlur={handleBlurInput}
                                                onChange={handleChangeInput}
                                            />
                                            <Form.Field>
                                                <label>Public</label>
                                                <Checkbox
                                                    toggle={true}
                                                    checked={isPublic}
                                                    onChange={handleChangeCheckbox}
                                                    name={'isPublic'}
                                                    width={2}
                                                />
                                            </Form.Field>
                                        </Form.Group>
                                        <Form.TextArea
                                            label="Description"
                                            name="description"
                                            onBlur={handleBlurInput}
                                            onChange={handleChangeInput}
                                            placeholder="Description"
                                            value={activeInput === 'description' ? activeValue : description}
                                            width={16}
                                        />
                                    </Form>
                                </Segment>
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
                                                        name="automaticCalculation"
                                                        onChange={handleChangeCheckbox}
                                                    />
                                                </Form.Field>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column width={16}>
                                                <Button
                                                    disabled={!selectedModel || !startDateTime}
                                                    floated={'right'}
                                                    primary={true}
                                                    type={'submit'}
                                                    negative={!selectedModel || !startDateTime}
                                                    onClick={handleApply}
                                                >
                                                    Apply
                                                </Button>
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
                    </Grid>
                </Form>
            </Segment>
        </AppContainer>
    );
}

export default CreateRealTimeModelling;
