import {cloneDeep} from 'lodash';
import moment from 'moment/moment';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useHistory, withRouter} from 'react-router-dom';
import {Button, Checkbox, Form, Grid, Header, Icon, Segment} from 'semantic-ui-react';
import uuidv4 from 'uuid/v4';
import FlopyPackages from '../../../core/model/flopy/packages/FlopyPackages';
import BoundingBox from '../../../core/model/geometry/BoundingBox';
import {IBoundingBox} from '../../../core/model/geometry/BoundingBox.type';
import {ICells} from '../../../core/model/geometry/Cells.type';
import {IGeometry} from '../../../core/model/geometry/Geometry.type';
import {IGridSize} from '../../../core/model/geometry/GridSize.type';
import {
    Cells,
    Geometry,
    GridSize,
    ModflowModel,
    Stressperiods,
    Transport,
    VariableDensity
} from '../../../core/model/modflow';
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
import AppContainer from '../../shared/AppContainer';
import {addMessage} from '../actions/actions';
import ModflowModelCommand from '../commands/modflowModelCommand';
import {DrawOnMapModal, UploadGeoJSONModal} from '../components/content/create';
import {GridProperties} from '../components/content/discretization';
import {ModelMap} from '../components/maps';
import defaults from '../defaults/createModel';
import {messageError} from '../defaults/messages';
import {CALCULATE_CELLS_INPUT} from '../worker/t03.worker';
import {ICalculateCellsInputData} from '../worker/t03.worker.type';
import {asyncWorker} from '../worker/worker';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools/t03-modflow-model-setup-and-editor/',
    icon: <Icon name="file"/>
}];

const createModel = () => {
    const [modelName, setModelName] = useState<string>(defaults.name);
    const [description, setDescription] = useState<string>(defaults.description);
    const [geometry, setGeometry] = useState<IGeometry | null>(null);
    const [boundingBox, setBoundingBox] = useState<IBoundingBox | null>(null);
    const [gridSize, setGridSize] = useState<IGridSize>(defaults.gridSize.toObject());
    const [cells, setCells] = useState<ICells>([]);
    const [lengthUnit] = useState<ILengthUnit>(defaults.lengthUnit);
    const [timeUnit] = useState<ITimeUnit>(defaults.timeUnit);
    const [intersection, setIntersection] = useState<number>(defaults.intersection);
    const [rotation, setRotation] = useState<number>(defaults.rotation);
    const [isPublic, setIsPublic] = useState<boolean>(defaults.isPublic);
    const [stressperiods, setStressperiods] = useState<IStressPeriods>(defaults.stressperiods.toObject());
    const [calculating, setCalculating] = useState<boolean>(false);
    const [stressperiodsLocal, setStressperoidsLocal] =
        useState<IStressPeriods>(cloneDeep(defaults.stressperiods.toObject()));
    const [validation, setValidation] = useState<[boolean, string[]]>([false, []]);

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        recalculate();
    }, [geometry]);

    useEffect(() => {
        validate();
    }, [boundingBox]);

    const getModel = () => {
        if (!geometry || !boundingBox) {
            return;
        }

        return (ModflowModel.createFromParameters(
            uuidv4(),
            modelName,
            description,
            Geometry.fromObject(geometry),
            BoundingBox.fromObject(boundingBox),
            GridSize.fromObject(gridSize),
            Cells.fromObject(cells),
            LengthUnit.fromInt(lengthUnit),
            TimeUnit.fromInt(timeUnit),
            intersection,
            rotation,
            Stressperiods.fromObject(stressperiods),
            isPublic
        ));
    };

    const handleSave = () => {
        if (!geometry || !boundingBox || cells.length === 0) {
            return;
        }

        const commands = [];

        const model = getModel();
        if (!model) {
            return;
        }

        const soilmodel = Soilmodel.fromDefaults(
            Geometry.fromObject(geometry),
            Cells.fromObject(cells)
        );

        commands.push(ModflowModelCommand.createModflowModel(model));
        commands.push(ModflowModelCommand.addLayer(
            model.id,
            SoilmodelLayer.fromObject(soilmodel.layersCollection.first as ISoilmodelLayer)
        ));
        commands.push(ModflowModelCommand.updateSoilmodelProperties({
            id: model.id,
            properties: soilmodel.toObject().properties
        }));

        commands.push(ModflowModelCommand.updateFlopyPackages(
            model.id,
            FlopyPackages.createFromModelInstances(
                model,
                soilmodel,
                new BoundaryCollection([]),
                Transport.fromDefault(),
                VariableDensity.fromDefault()
            )));

        return sendCommands(
            commands,
            () => history.push(`/tools/T03/${model.id}`),
            (e: any) => {
                dispatch(addMessage(messageError('createModel', e)));
            }
        );
    };

    const handleChangeGridProps = (b: BoundingBox, g: GridSize, i: number, r: number, c: Cells) => {
        setBoundingBox(b.toObject());
        setGridSize(g.toObject());
        setIntersection(i);
        setRotation(r);
        setCells(c.toObject());
    };

    const handleInputChange = (e: any, {value, name, checked}: any) => {
        if (name === 'name') {
            return setModelName(value);
        }
        if (name === 'description') {
            return setDescription(value);
        }
        if (name === 'isPublic') {
            return setIsPublic(checked);
        }
    };

    const handleStressperiodsChange = (e: any) => {
        const {type, target} = e;
        const {name, value} = target;

        if (type === 'change') {
            setStressperoidsLocal({
                ...stressperiodsLocal,
                [name]: value
            });
        }

        if (type === 'blur') {
            const stressPeriods = Stressperiods.fromObject(stressperiods);
            const first = stressPeriods.first;

            const start = moment.utc(stressperiodsLocal.start_date_time);
            const end = moment.utc(stressperiodsLocal.end_date_time);

            first.startDateTime = start;
            stressPeriods.updateStressperiodByIdx(0, first);
            stressPeriods.startDateTime = start;

            if (end.isSameOrBefore(start)) {
                const test = moment(
                    start.clone().add(1, TimeUnit.fromInt(timeUnit).toString()).format('YYYY-MM-DD')
                );
                stressPeriods.endDateTime = test.clone();
            } else {
                stressPeriods.endDateTime = end;
            }

            setStressperoidsLocal(stressPeriods.toObject());
            setStressperiods(stressPeriods.toObject());
            validate();
        }
    };

    const recalculate = () => {
        if (geometry === null) {
            return;
        }

        const cGeometry = Geometry.fromObject(geometry);
        let cBoundingBox = BoundingBox.fromGeoJson(cGeometry.toGeoJSON());
        if (boundingBox !== null) {
            cBoundingBox = BoundingBox.fromObject(boundingBox);
        }

        let geometryRot = null;
        if (rotation % 360 === 0) {
            geometryRot = cGeometry.toGeoJSONWithRotation(rotation, cGeometry.centerOfMass);
            cBoundingBox = BoundingBox.fromGeoJson(geometryRot);
        }

        setCalculating(true);
        setBoundingBox(cBoundingBox.toObject());

        asyncWorker({
            type: CALCULATE_CELLS_INPUT,
            data: {
                geometry: geometryRot || geometry,
                boundingBox: cBoundingBox.toObject(),
                gridSize,
                intersection
            } as ICalculateCellsInputData
        }).then((c: ICells) => {
            setCells(c);
            setCalculating(false);
            validate();
        }).catch(() => {
            dispatch(addMessage(messageError('createModel', 'Calculating cells failed.')));
            setCalculating(false);
        });
    };

    const validate = () => {
        if (!boundingBox || !geometry) {
            return setValidation([false, []]);
        }

        const model = getModel();
        if (model) {
            ModflowModelCommand.createModflowModel(model)
                .validate()
                .then((v) => setValidation(v));
        }
    };

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
                                            value={modelName}
                                            width={14}
                                            onChange={handleInputChange}
                                        />
                                        <Form.Field>
                                            <label>Public</label>
                                            <Checkbox
                                                toggle={true}
                                                checked={isPublic}
                                                onChange={handleInputChange}
                                                name={'isPublic'}
                                                width={2}
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.TextArea
                                        label="Description"
                                        name="description"
                                        onChange={handleInputChange}
                                        placeholder="Description"
                                        value={description}
                                        width={16}
                                    />
                                </Form>
                            </Segment>
                            <Grid columns={2}>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Segment>
                                            <Form>
                                                <Form.Select
                                                    compact={true}
                                                    label="Length unit"
                                                    options={[{key: 2, text: 'meters', value: 2}]}
                                                    value={lengthUnit}
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
                                                        .fromObject(stressperiodsLocal)
                                                        .startDateTime.format('YYYY-MM-DD')}
                                                    onChange={handleStressperiodsChange}
                                                    onBlur={handleStressperiodsChange}
                                                />
                                                <Form.Input
                                                    type="date"
                                                    label="End Date"
                                                    name={'end_date_time'}
                                                    value={Stressperiods
                                                        .fromObject(stressperiodsLocal)
                                                        .endDateTime.format('YYYY-MM-DD')}
                                                    onChange={handleStressperiodsChange}
                                                    onBlur={handleStressperiodsChange}
                                                />
                                                <Form.Select
                                                    compact={true}
                                                    label="Time unit"
                                                    options={[{key: 4, text: 'days', value: 4}]}
                                                    value={timeUnit}
                                                />
                                            </Form>
                                        </Segment>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            {(geometry && boundingBox && cells) ?
                                <Segment>
                                    <ModelMap
                                        boundaries={BoundaryCollection.fromObject([])}
                                        geometry={Geometry.fromObject(geometry)}
                                        boundingBox={BoundingBox.fromObject(boundingBox)}
                                        cells={Cells.fromObject(cells)}
                                        gridSize={GridSize.fromObject(gridSize)}
                                        rotation={rotation}
                                    />
                                    <Button
                                        icon={'trash'}
                                        color={'red'}
                                        floated={'right'}
                                        onClick={() => setGeometry(null)}
                                    />
                                </Segment> :
                                <Segment>
                                    <Grid columns={1} textAlign={'center'}>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Header as={'h1'}>Set model geometry</Header>
                                                <p>You have the following options</p>
                                                <DrawOnMapModal
                                                    onChange={(g) => setGeometry(g.toGeoJSON())}
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <UploadGeoJSONModal
                                                    onChange={(g) => setGeometry(g.toGeoJSON())}
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Segment>
                            }
                        </Grid.Column>
                    </Grid.Row>
                    {boundingBox && geometry &&
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Segment>
                                <GridProperties
                                    boundingBox={BoundingBox.fromObject(boundingBox)}
                                    geometry={Geometry.fromObject(geometry)}
                                    gridSize={GridSize.fromObject(gridSize)}
                                    intersection={intersection}
                                    onChange={handleChangeGridProps}
                                    rotation={rotation}
                                    readonly={calculating}
                                />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    }
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Button
                                floated={'right'}
                                primary={true}
                                type={'submit'}
                                onClick={handleSave}
                                negative={!validation[0]}
                                loading={calculating}
                            >
                                Create model
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </AppContainer>
    );
};

export default withRouter(createModel);
