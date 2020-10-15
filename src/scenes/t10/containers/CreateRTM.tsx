import React, {useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {Breadcrumb, Button, Checkbox, Form, Grid, Icon, Segment} from 'semantic-ui-react';
import Uuid from 'uuid';
import {ModflowModel} from '../../../core/model/modflow';
import {IBoundary} from '../../../core/model/modflow/boundaries/Boundary.type';
import BoundaryCollection from '../../../core/model/modflow/boundaries/BoundaryCollection';
import {IModflowModel} from '../../../core/model/modflow/ModflowModel.type';
import {IRtm} from '../../../core/model/rtm/Rtm.type';
import {IMetaData} from '../../../core/model/types';
import {fetchUrl, sendCommand} from '../../../services/api';
import {createToolInstance} from '../../dashboard/commands';
import AppContainer from '../../shared/AppContainer';
import {ModelMap} from '../../t03/components/maps';

type IProps = RouteComponentProps

const navigation = [
    {
        name: 'Documentation',
        path: 'https://inowas.com/tools',
        icon: <Icon name="file"/>
    }
];

const CreateRTM = (props: IProps) => {

    const [fetchingModels, setFetchingModels] = useState<boolean>(true);
    const [fetchingError, setFetchingError] = useState<boolean>(false);
    const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
    const [models, setModels] = useState<IMetaData[]>([]);
    const [model, setModel] = useState<IModflowModel | null>(null);
    const [modelBoundaries, setModelBoundaries] = useState<IBoundary[] | null>(null);
    const [name, setName] = useState<string>('New real time modelling project');
    const [description, setDescription] = useState<string>('');
    const [isPublic, setPublic] = useState<boolean>(true);
    const [tool] = useState<string>('T10');

    useEffect(() => {
        fetchUrl('tools/T10', (data: IMetaData[]) => {
            setModels(data);
            setFetchingModels(false);
        });
    }, []);

    useEffect(() => {
        if (selectedModelId) {
            fetchModel(selectedModelId);
        }
    }, [selectedModelId]);

    useEffect(() => {
        if (model) {
            fetchModelBoundaries(model.id);
        }
    }, [model]);

    const changeModelId = (mID: string) => {
        const filteredModels = models.filter((m) => m.id === mID);
        if (filteredModels.length === 1) {
            return setSelectedModelId(filteredModels[0].id);
        }

        setModel(null);
        setSelectedModelId(null);
    };

    const fetchModel = (id: string) => {
        fetchUrl(`modflowmodels/${id}`, (m: IModflowModel) => {
            setModel(ModflowModel.fromQuery(m).toObject());
            setFetchingModels(false);
            setPublic(m.public);
        });
    };

    const fetchModelBoundaries = (id: string) => {
        fetchUrl(`modflowmodels/${id}/boundaries`, (b: IBoundary[]) => {
            setModelBoundaries(BoundaryCollection.fromQuery(b).toObject());
        });
    };

    const handleChange = (e: any, data: any) => {
        const property: string = data.name;

        if (property === 'selectedModelId') {
            changeModelId(data.value);
        }

        if (property === 'name') {
            setName(data.value);
        }

        if (property === 'description') {
            setDescription(data.value);
        }

        if (property === 'public') {
            setPublic(data.checked);
        }
    };

    const onCreateClick = () => {
        const rtm: IRtm = {
            id: Uuid.v4(),
            name,
            description,
            permissions: 'rwx',
            public: isPublic,
            tool,
            data: {
                sensors: [],
                model: selectedModelId
            }
        };

        sendCommand(createToolInstance('T10', rtm),
            () => props.history.push('/tools/T10/' + rtm.id),
            () => setFetchingError(true)
        );
    };

    const renderMap = (m: IModflowModel, b: IBoundary[] | null) => {
        if (!m) {
            return null;
        }

        const modflowModel = ModflowModel.fromObject(m);
        const geometry = modflowModel.geometry;
        const boundaries = b ? BoundaryCollection.fromObject(b) : null;

        return (
            <Segment>
                <ModelMap boundaries={boundaries} geometry={geometry}/>
            </Segment>
        );

    };

    return (
        <AppContainer navbarItems={navigation}>
            <Breadcrumb>
                <Breadcrumb.Section>Tools</Breadcrumb.Section>
                <Breadcrumb.Divider icon={'right chevron'}/>
                <Breadcrumb.Section>{'T10'}. {name}</Breadcrumb.Section>
                <Breadcrumb.Divider icon={'right arrow'}/>
            </Breadcrumb>
            <Segment color={'grey'}>
                <Grid padded={true} columns={2}>
                    <Grid.Row stretched={true}>
                        <Grid.Column width={6}>
                            <Segment>
                                <Form>
                                    <Form.Group>
                                        <Form.Input
                                            label={'Name'}
                                            name={'name'}
                                            value={name}
                                            width={14}
                                            onChange={handleChange}
                                        />
                                        <Form.Field>
                                            <label>Public</label>
                                            <Checkbox
                                                toggle={true}
                                                checked={isPublic}
                                                onChange={handleChange}
                                                name={'public'}
                                                width={2}
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.TextArea
                                        label="Description"
                                        name="description"
                                        onChange={handleChange}
                                        placeholder="Description"
                                        value={description}
                                        width={16}
                                    />
                                    <Form.Dropdown
                                        loading={fetchingModels}
                                        label={'Select Model (optional)'}
                                        style={{zIndex: 1000}}
                                        selection={true}
                                        options={
                                            [{key: 'no_model', value: 'no_model', text: 'No Model'}]
                                                .concat(models.map((m) => ({key: m.id, value: m.id, text: m.name})))
                                        }
                                        value={selectedModelId ? selectedModelId : 'no_model'}
                                        name={'selectedModelId'}
                                        onChange={handleChange}
                                    />
                                </Form>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            {model && renderMap(model, modelBoundaries)}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={6}>
                            <Button
                                primary={true}
                                positive={!fetchingError}
                                type="submit"
                                onClick={!fetchingError ? onCreateClick : () => ({})}
                            >
                                {!fetchingError ? 'Create' : 'Error'}
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </AppContainer>
    );

};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore todo
export default withRouter<IProps>(CreateRTM);
