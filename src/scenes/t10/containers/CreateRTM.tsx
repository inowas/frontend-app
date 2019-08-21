import React from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {Breadcrumb, Button, Checkbox, Form, Grid, Icon, Segment} from 'semantic-ui-react';
import Uuid from 'uuid';
import {ModflowModel} from '../../../core/model/modflow';
import BoundaryCollection from '../../../core/model/modflow/boundaries/BoundaryCollection';
import {IModflowModel} from '../../../core/model/modflow/ModflowModel.type';
import {IRtm} from '../../../core/model/rtm/Rtm.type';
import {IMetaData, IPropertyValueObject} from '../../../core/model/types';
import {fetchUrl, sendCommand} from '../../../services/api';
import {createToolInstance} from '../../dashboard/commands';
import AppContainer from '../../shared/AppContainer';
import {ModelMap} from '../../t03/components/maps';

interface IState extends IPropertyValueObject {
    fetchingModels: boolean;
    fetchingError: boolean;
    selectedModelId: string | null;
    models: IMetaData[];
    model: IModflowModel | null;
    name: string;
    description: string;
    public: boolean;
    tool: string;
}

// tslint:disable-next-line:no-empty-interface
interface IProps extends RouteComponentProps {
}

const navigation = [
    {
        name: 'Documentation',
        path: 'https://inowas.com/tools/t07-application-specific-scenarios-analyzer/',
        icon: <Icon name="file"/>
    }
];

class CreateRTM extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            fetchingModels: true,
            fetchingError: false,
            selectedModelId: null,
            models: [],
            model: null,
            name: `New real time modelling project`,
            description: `New real time modelling project`,
            public: true,
            tool: 'T10'
        };
    }

    public componentDidMount() {
        fetchUrl('tools/T03', (data: IMetaData[]) => {
            this.setState({
                models: data,
                fetchingModels: false
            });
        });
    }

    public changeModelId(selectedModelId: string) {
        const filteredModels = this.state.models.filter((m) => m.id === selectedModelId);
        if (filteredModels.length === 1) {
            return this.setState({
                selectedModelId: filteredModels[0].id,
                name: `New real time modelling project`,
                description: `New real time modelling project`,
            }, () => this.fetchModel(selectedModelId));
        }

        return this.setState({
            model: null,
            selectedModelId: null
        });
    }

    public fetchModel(id: string) {
        fetchUrl(`modflowmodels/${id}`, (model: any) => {
                this.setState({
                    model: ModflowModel.fromQuery(model).toObject(),
                    fetchingModel: false,
                    public: model.public
                }, () => this.fetchBoundaries(id));
            }
        );
    }

    public fetchBoundaries(id: string) {
        fetchUrl(`modflowmodels/${id}/boundaries`,
            (data: any) => this.setState({
                modelBoundaries: data
            })
        );
    }

    public handleChange = (e: any, data: any) => {
        const name: string = data.name;

        if (name === 'selectedModelId') {
            this.changeModelId(data.value);
        }

        if (name === 'name' || name === 'description') {
            this.setState({
                [name]: data.value
            });
        }

        if (name === 'public') {
            this.setState({
                public: data.checked
            });
        }
    };

    public renderMap = (model: any, modelBoundaries: any) => {
        if (!model) {
            return null;
        }

        const modflowModel = ModflowModel.fromObject(model);
        const geometry = modflowModel.geometry;
        const boundaries = modelBoundaries ? BoundaryCollection.fromQuery(modelBoundaries) : null;

        return (
            <Segment>
                <ModelMap boundaries={boundaries} geometry={geometry}/>
            </Segment>
        );

    };

    public render() {
        return (
            <AppContainer navbarItems={navigation}>
                <Breadcrumb>
                    <Breadcrumb.Section>Tools</Breadcrumb.Section>
                    <Breadcrumb.Divider icon={'right chevron'}/>
                    <Breadcrumb.Section>{'T10'}. {this.state.name}</Breadcrumb.Section>
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
                                                value={this.state.name}
                                                width={14}
                                                onChange={this.handleChange}
                                            />
                                            <Form.Field>
                                                <label>Public</label>
                                                <Checkbox
                                                    toggle={true}
                                                    checked={this.state.public}
                                                    onChange={this.handleChange}
                                                    name={'public'}
                                                    width={2}
                                                />
                                            </Form.Field>
                                        </Form.Group>
                                        <Form.TextArea
                                            label="Description"
                                            name="description"
                                            onChange={this.handleChange}
                                            placeholder="Description"
                                            value={this.state.description}
                                            width={16}
                                        />
                                        <Form.Dropdown
                                            loading={this.state.fetchingModels}
                                            label={'Select Model (optional)'}
                                            style={{zIndex: 1000}}
                                            selection={true}
                                            options={
                                                [{key: 'no_model', value: 'no_model', text: 'No Model'}]
                                                    .concat(this.state.models.map(
                                                        (m) => ({key: m.id, value: m.id, text: m.name})))
                                            }
                                            value={this.state.selectedModelId ? this.state.selectedModelId : 'no_model'}
                                            name={'selectedModelId'}
                                            onChange={this.handleChange}
                                        />
                                    </Form>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={10}>
                                {this.state.model && this.renderMap(this.state.model, this.state.modelBoundaries)}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={6}>
                                <Button
                                    primary={true}
                                    positive={true}
                                    type="submit"
                                    onClick={this.onCreateClick}
                                >
                                    Create
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </AppContainer>
        );
    }

    private onCreateClick = () => {
        const rtm: IRtm = {
            id: Uuid.v4(),
            name: this.state.name,
            description: this.state.description,
            permissions: 'rwx',
            public: this.state.public,
            tool: this.state.tool,
            data: {
                sensors: [],
                model: this.state.selectedModelId
            }
        };

        sendCommand(createToolInstance('T10', rtm),
            () => this.props.history.push('/tools/T10/' + rtm.id),
            () => this.setState({fetchingError: true})
        );
    };
}

export default withRouter<IProps>(CreateRTM);
