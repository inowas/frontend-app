import {cloneDeep} from 'lodash';
import moment from 'moment/moment';
import React from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {Button, Checkbox, Form, Grid, Header, Icon, Segment} from 'semantic-ui-react';
import uuidv4 from 'uuid/v4';
import BoundingBox from '../../../core/model/geometry/BoundingBox';
import {IBoundingBox} from '../../../core/model/geometry/BoundingBox.type';
import {ICells} from '../../../core/model/geometry/Cells.type';
import {GeoJson} from '../../../core/model/geometry/Geometry.type';
import {IGridSize} from '../../../core/model/geometry/GridSize.type';
import {Cells, Geometry, GridSize, ModflowModel, Stressperiods} from '../../../core/model/modflow';
import {BoundaryCollection} from '../../../core/model/modflow/boundaries';
import LengthUnit from '../../../core/model/modflow/LengthUnit';
import {ILengthUnit} from '../../../core/model/modflow/LengthUnit.type';
import Soilmodel from '../../../core/model/modflow/soilmodel/Soilmodel';
import SoilmodelLayer from '../../../core/model/modflow/soilmodel/SoilmodelLayer';
import {ISoilmodelLayer} from '../../../core/model/modflow/soilmodel/SoilmodelLayer.type';
import {IStressPeriods} from '../../../core/model/modflow/Stressperiods.type';
import TimeUnit from '../../../core/model/modflow/TimeUnit';
import {ITimeUnit} from '../../../core/model/modflow/TimeUnit.type';
import {sendCommands} from '../../../services/api/commandHelper';
import {calculateCells} from '../../../services/geoTools';
import AppContainer from '../../shared/AppContainer';
import ModflowModelCommand from '../commands/modflowModelCommand';
import {DrawOnMapModal, UploadGeoJSONModal} from '../components/content/create';
import {ModelMap} from '../components/maps';
import defaults from '../defaults/createModel';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools/t03-modflow-model-setup-and-editor/',
    icon: <Icon name="file"/>
}];

interface IState {
    id: string;
    name: string;
    description: string;
    geometry: GeoJson | null;
    boundingBox: IBoundingBox | null;
    gridSize: IGridSize;
    gridSizeLocal: IGridSize;
    cells: ICells;
    lengthUnit: ILengthUnit;
    stressperiods: IStressPeriods;
    stressperiodsLocal: IStressPeriods;
    timeUnit: ITimeUnit;
    isPublic: boolean;
    error: boolean;
    loading: boolean;
    validation: any;
}

// tslint:disable-next-line:no-empty-interface
interface IProps extends RouteComponentProps {
}

class CreateModel extends React.Component<IProps, IState> {

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
            stressperiodsLocal: cloneDeep(defaults.stressperiods.toObject()),
            validation: [false, []]
        };
    }

    public getPayload = () => {
        if (!this.state.geometry || !this.state.boundingBox) {
            return;
        }

        return (ModflowModel.createFromParameters(
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
    };

    public handleSave = () => {
        if (!this.state.geometry || !this.state.boundingBox) {
            return;
        }

        const commands = [];

        const soilmodel = Soilmodel.fromDefaults(
            Geometry.fromObject(this.state.geometry), Cells.fromObject(this.state.cells)
        );

        const createModelPayload = this.getPayload();
        if (!createModelPayload) {
            return;
        }

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
            () => this.props.history.push(`/tools/T03/${createModelPayload.id}`),
            (e: any) => this.setState({error: e})
        );
    };

    public handleInputChange = (e: any, {value, name, checked}: any) => {
        // @ts-ignore
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
            this.setState({gridSize: this.state.gridSizeLocal}, () => {
                this.recalculate();
            });
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
            stressPeriods.startDateTime = moment.utc(this.state.stressperiodsLocal.start_date_time);
            stressPeriods.endDateTime = moment.utc(this.state.stressperiodsLocal.start_date_time);
            this.setState({stressperiods: stressPeriods.toObject()}, () => this.validate());
        }
    };

    public recalculate = () => {
        if (this.state.geometry === null) {
            return;
        }
        const geometry = Geometry.fromObject(this.state.geometry);

        let boundingBox = BoundingBox.fromGeoJson(geometry.toGeoJSON());
        if (this.state.boundingBox !== null) {
            boundingBox = BoundingBox.fromObject(this.state.boundingBox);
        }

        const gridSize = GridSize.fromObject(this.state.gridSize);
        calculateCells(geometry, boundingBox, gridSize).then((cells: Cells) => {
            return (
                this.setState({
                    geometry: geometry.toObject(),
                    boundingBox: boundingBox.toObject(),
                    gridSize: gridSize.toObject(),
                    cells: cells.toObject()
                }, () => this.validate())
            );
        });
    };

    public validate = () => {
        if (!this.state.boundingBox || !this.state.geometry) {
            return this.setState({validation: [false, []]});
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
                                                        name={'start_date_time'}
                                                        value={Stressperiods
                                                            .fromObject(this.state.stressperiodsLocal)
                                                            .startDateTime.format('YYYY-MM-DD')}
                                                        onChange={this.handleStressperiodsChange}
                                                        onBlur={this.handleStressperiodsChange}
                                                    />
                                                    <Form.Input
                                                        type="date"
                                                        label="End Date"
                                                        name={'end_date_time'}
                                                        value={Stressperiods
                                                            .fromObject(this.state.stressperiodsLocal)
                                                            .endDateTime.format('YYYY-MM-DD')}
                                                        onChange={this.handleStressperiodsChange}
                                                        onBlur={this.handleStressperiodsChange}
                                                    />
                                                    <Form.Select
                                                        compact={true}
                                                        label="Time unit"
                                                        options={[{key: 4, text: 'days', value: 4}]}
                                                        value={this.state.timeUnit}
                                                    />
                                                </Form>
                                            </Segment>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                            <Grid.Column width={10}>
                                {(this.state.geometry && this.state.boundingBox && this.state.cells) ?
                                    <Segment>
                                        <ModelMap
                                            boundaries={BoundaryCollection.fromObject([])}
                                            geometry={Geometry.fromObject(this.state.geometry)}
                                            boundingBox={BoundingBox.fromObject(this.state.boundingBox)}
                                            cells={Cells.fromObject(this.state.cells)}
                                            gridSize={GridSize.fromObject(this.state.gridSize)}
                                        />
                                        <Button
                                            icon={'trash'}
                                            color={'red'}
                                            floated={'right'}
                                            onClick={() => this.setState({geometry: null}, () => this.validate())}
                                        />
                                    </Segment> :
                                    <Segment>
                                        <Grid columns={1} textAlign={'center'}>
                                            <Grid.Row>
                                                <Grid.Column>
                                                    <Header as={'h1'}>Set model geometry</Header>
                                                    <p>You have the following options</p>
                                                    <DrawOnMapModal
                                                        onChange={(geometry) => {
                                                            this.setState({geometry: geometry.toGeoJSON()},
                                                                () => this.recalculate());
                                                        }}
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row>
                                                <Grid.Column>
                                                    <UploadGeoJSONModal
                                                        onChange={(geometry) => {
                                                            this.setState({geometry: geometry.toGeoJSON()},
                                                                () => this.recalculate());
                                                        }}
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Segment>
                                }
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Button
                                    floated={'right'}
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
                </Segment>
            </AppContainer>
        );
    }
}

export default withRouter(CreateModel);
