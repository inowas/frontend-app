import moment from 'moment/moment';
import React from 'react';
import {withRouter} from 'react-router-dom';
import {Button, Checkbox, Form, Grid, Icon, Segment} from 'semantic-ui-react';
import uuidv4 from 'uuid/v4';
import BoundingBox from '../../../core/model/geometry/BoundingBox';
import {Cells, Geometry, GridSize, ModflowModel, Stressperiods} from '../../../core/model/modflow';
import LengthUnit from '../../../core/model/modflow/LengthUnit';
import Soilmodel from '../../../core/model/modflow/soilmodel/Soilmodel';
import SoilmodelLayer from '../../../core/model/modflow/soilmodel/SoilmodelLayer';
import {ISoilmodelLayer} from '../../../core/model/modflow/soilmodel/SoilmodelLayer.type';
import TimeUnit from '../../../core/model/modflow/TimeUnit';
import {sendCommands} from '../../../services/api/commandHelper';
import AppContainer from '../../shared/AppContainer';
import ModflowModelCommand from '../commands/modflowModelCommand';
import {CreateModelMap} from '../components/maps';
import defaults from '../defaults/createModel';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools/t03-modflow-model-setup-and-editor/',
    icon: <Icon name="file"/>
}];

class CreateModel extends React.Component {

    public props: any;
    public state: any;

    constructor(props: any) {
        super(props);
        this.state = {
            id: defaults.id,
            name: defaults.name,
            description: defaults.description,
            geometry: null,
            boundingBox: null,
            gridSize: defaults.gridSize.toObject(),
            cells: [],
            lengthUnit: defaults.lengthUnit,
            timeUnit: defaults.timeUnit,
            isPublic: defaults.isPublic,
            stressperiods: defaults.stressperiods.toObject(),
            error: false,
            loading: false,
            gridSizeLocal: defaults.gridSize.toObject(),
            stressperiodsLocal: {
                startDateTime: defaults.stressperiods.startDateTime.format('YYYY-MM-DD'),
                endDateTime: defaults.stressperiods.endDateTime.format('YYYY-MM-DD'),
            },
            validation: [false, []]
        };
    }

    public getPayload = () => (ModflowModel.createFromParameters(
        uuidv4(),
        this.state.name,
        this.state.description,
        Geometry.fromObject(this.state.geometry),
        BoundingBox.fromObject(this.state.boundingBox),
        GridSize.fromObject(this.state.gridSize),
        Cells.fromObject(this.state.cells),
        LengthUnit.fromInt(this.state.lengthUnit),
        TimeUnit.fromInt(this.state.timeUnit),
        Stressperiods.fromObject(this.state.stressperiods),
        this.state.isPublic
    )).toCreatePayload();

    public handleSave = () => {
        const commands = [];

        const soilmodel = Soilmodel.fromDefaults(
            Geometry.fromObject(this.state.geometry), Cells.fromObject(this.state.cells)
        );

        const createModelPayload = this.getPayload();

        commands.push(ModflowModelCommand.createModflowModel(createModelPayload));
        commands.push(ModflowModelCommand.addLayer(
            createModelPayload.id,
            SoilmodelLayer.fromObject(soilmodel.layersCollection.first as ISoilmodelLayer)
        ));
        commands.push(ModflowModelCommand.updateSoilmodelProperties({
            id: createModelPayload.id,
            properties: soilmodel.toObject().properties
        }));

        return sendCommands(
            commands,
            () => this.props.history.push(`T03/${createModelPayload.id}`),
            (e: any) => this.setState({error: e})
        );
    };

    public handleInputChange = (e: any, {value, name, checked}: any) => {
        this.setState({
            [name]: value || checked
        });
    };

    public handleGridSizeChange = (e: any) => {
        const {type, target} = e;
        const {name, value} = target;

        if (type === 'change') {
            const gridSize = GridSize.fromObject(this.state.gridSizeLocal);
            // @ts-ignore
            gridSize[name] = parseFloat(value);
            this.setState({gridSizeLocal: gridSize.toObject()});
        }

        if (type === 'blur') {
            this.setState({gridSize: this.state.gridSizeLocal}, () => this.validate());
        }
    };

    public handleStressperiodsChange = (e: any) => {
        const {type, target} = e;
        const {name, value} = target;

        if (type === 'change') {
            this.setState((prevState: any) => ({
                stressperiodsLocal: {
                    ...prevState.stressperiodsLocal,
                    [name]: value
                }
            }));
        }

        if (type === 'blur') {
            const stressPeriods = Stressperiods.fromObject(this.state.stressperiods);
            stressPeriods.startDateTime = moment.utc(this.state.stressperiodsLocal.startDateTime);
            stressPeriods.endDateTime = moment.utc(this.state.stressperiodsLocal.endDateTime);
            this.setState({stressperiods: stressPeriods.toObject()}, () => this.validate());
        }
    };

    public handleMapInputChange = ({cells, boundingBox, geometry}: any) => {
        this.setState({
            cells: cells.toObject(),
            boundingBox: boundingBox.toObject(),
            geometry: geometry.toObject()
        }, () => this.validate());
    };

    public validate = () => {
        if (!this.state.boundingBox || !this.state.geometry) {
            return false;
        }

        const command = ModflowModelCommand.createModflowModel(this.getPayload());
        command.validate().then(
            (validation) => this.setState({validation})
        );
    };

    public render() {
        return (
            <AppContainer navbarItems={navigation}>
                <Segment color={'grey'}>
                    <Grid padded={true} columns={2}>
                        <Grid.Row stretched={true}>
                            <Grid.Column width={6}>
                                <Segment>
                                    <Form>
                                        <Form.Group>
                                            <Form.Input
                                                label="Name"
                                                name={'name'}
                                                value={this.state.name}
                                                width={14}
                                                onChange={this.handleInputChange}
                                            />
                                            <Form.Field>
                                                <label>Public</label>
                                                <Checkbox
                                                    toggle={true}
                                                    checked={this.state.isPublic}
                                                    onChange={this.handleInputChange}
                                                    name={'isPublic'}
                                                    width={2}
                                                />
                                            </Form.Field>
                                        </Form.Group>
                                        <Form.TextArea
                                            label="Description"
                                            name="description"
                                            onChange={this.handleInputChange}
                                            placeholder="Description"
                                            value={this.state.description}
                                            width={16}
                                        />
                                    </Form>
                                </Segment>
                                <Grid columns={2}>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Segment>
                                                <Form>
                                                    <Form.Input
                                                        type="number"
                                                        label="Rows"
                                                        name={'nY'}
                                                        value={(GridSize.fromObject(this.state.gridSizeLocal)).nY}
                                                        onChange={this.handleGridSizeChange}
                                                        onBlur={this.handleGridSizeChange}
                                                    />
                                                    <Form.Input
                                                        type="number"
                                                        label="Columns"
                                                        name={'nX'}
                                                        value={GridSize.fromObject(this.state.gridSizeLocal).nX}
                                                        onChange={this.handleGridSizeChange}
                                                        onBlur={this.handleGridSizeChange}
                                                    />
                                                    <Form.Select
                                                        compact={true}
                                                        label="Length unit"
                                                        options={[{key: 2, text: 'meters', value: 2}]}
                                                        style={{zIndex: 10000}}
                                                        value={this.state.lengthUnit}
                                                    />
                                                </Form>
                                            </Segment>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Segment>
                                                <Form>
                                                    <Form.Input
                                                        type="date"
                                                        label="Start Date"
                                                        name={'startDateTime'}
                                                        value={this.state.stressperiodsLocal.startDateTime}
                                                        onChange={this.handleStressperiodsChange}
                                                        onBlur={this.handleStressperiodsChange}
                                                    />
                                                    <Form.Input
                                                        type="date"
                                                        label="End Date"
                                                        name={'endDateTime'}
                                                        value={this.state.stressperiodsLocal.endDateTime}
                                                        onChange={this.handleStressperiodsChange}
                                                        onBlur={this.handleStressperiodsChange}
                                                    />
                                                    <Form.Select
                                                        compact={true}
                                                        label="Time unit"
                                                        options={[{key: 4, text: 'days', value: 4}]}
                                                        style={{zIndex: 10000}}
                                                        value={this.state.timeUnit}
                                                    />
                                                </Form>
                                            </Segment>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column width={16}>
                                            <Button
                                                primary={true}
                                                type="submit"
                                                onClick={this.handleSave}
                                                disabled={!this.state.validation[0]}
                                            >
                                                Create model
                                            </Button>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <CreateModelMap
                                    gridSize={GridSize.fromObject(this.state.gridSize)}
                                    onChange={this.handleMapInputChange}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </AppContainer>
        );
    }
}

export default withRouter(CreateModel);