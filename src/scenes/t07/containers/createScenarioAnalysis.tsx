import React from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {Breadcrumb, Button, Checkbox, Form, Grid, Icon, Segment} from 'semantic-ui-react';
import Uuid from 'uuid';
import {ModflowModel} from '../../../core/model/modflow';
import BoundaryCollection from '../../../core/model/modflow/boundaries/BoundaryCollection';
import {IMetaData, IPropertyValueObject} from '../../../core/model/types';
import {fetchUrl, sendCommand} from '../../../services/api';
import AppContainer from '../../shared/AppContainer';
import {ModelMap} from '../../t03/components/maps';
import ScenarioAnalysisCommand from '../commands/scenarioAnalysisCommand';

interface IState extends IPropertyValueObject {
    fetchingModels: boolean;
    fetchingModel: boolean;
    fetchingError: boolean;
    models: IMetaData[];
    selectedModelId: string | null;
    model: null | any;
    modelBoundaries: null | any;
    name: string;
    description: string;
    public: boolean;
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

class CreateScenarioAnalysis extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            fetchingModels: true,
            fetchingModel: false,
            fetchingError: false,
            selectedModelId: null,
            models: [],
            model: null,
            modelBoundaries: null,
            name: '',
            description: '',
            public: false
        };
    }

    public componentDidMount() {
        fetchUrl('tools/T03', (data: IMetaData[]) => {
            this.setState({
                models: data,
                fetchingModels: false
            }, () => data.length > 0 && this.changeModelId(data[0].id));
        });
    }

    public changeModelId(selectedModelId: string) {
        const filteredModels = this.state.models.filter((m) => m.id === selectedModelId);
        if (filteredModels.length === 1) {
            this.setState({
                selectedModelId: filteredModels[0].id,
                name: `Scenarioanalysis for model ${filteredModels[0].name}`,
                description: `Scenarioanalysis for model ${filteredModels[0].name}`,
            }, () => this.fetchModel(selectedModelId));
        }
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
        const {model} = this.state;

        if (!model) {
            return null;
        }

        return (
            <AppContainer navbarItems={navigation}>
                <Breadcrumb>
                    <Breadcrumb.Section>Tools</Breadcrumb.Section>
                    <Breadcrumb.Divider icon={'right chevron'}/>
                    <Breadcrumb.Section>{'T07'}. {this.state.name}</Breadcrumb.Section>
                    <Breadcrumb.Divider icon={'right arrow'}/>
                </Breadcrumb>
                <Segment color={'grey'}>
                    <Grid padded={true} columns={2}>
                        <Grid.Row stretched={true}>
                            <Grid.Column width={6}>
                                <Segment>
                                    <Form>
                                        <Form.Dropdown
                                            loading={this.state.fetchingModels}
                                            label={'Select Model'}
                                            style={{zIndex: 1000}}
                                            selection={true}
                                            options={this.state.models.map((m) => (
                                                {key: m.id, value: m.id, text: m.name}
                                            ))}
                                            value={this.state.selectedModelId ? this.state.selectedModelId : false}
                                            name={'selectedModelId'}
                                            onChange={this.handleChange}
                                        />
                                        {this.state.selectedModelId &&
                                        <div>
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
                                        </div>}
                                    </Form>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={10}>
                                {this.renderMap(this.state.model, this.state.modelBoundaries)}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={6}>
                                <Button
                                    primary={true}
                                    positive={true}
                                    type="submit"
                                    onClick={this.onCreateScenarioAnalysisClick}
                                >
                                    Create Scenario Analysis
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </AppContainer>
        );
    }

    private onCreateScenarioAnalysisClick = () => {
        const scenarioAnalysisId = Uuid.v4();
        const command = ScenarioAnalysisCommand.createScenarioAnalysis(
            scenarioAnalysisId,
            this.state.selectedModelId,
            this.state.name,
            this.state.description,
            this.state.public
        );
        sendCommand(command,
            () => this.props.history.push('/tools/T07/' + scenarioAnalysisId),
            () => this.setState({fetchingError: true})
        );
    };
}

export default withRouter<IProps>(CreateScenarioAnalysis);
