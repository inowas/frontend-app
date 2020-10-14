import * as turf from '@turf/turf';
import React, {ChangeEvent, SyntheticEvent, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {DropdownProps, Form, Grid, Header, InputOnChangeData, Segment} from 'semantic-ui-react';
import Uuid from 'uuid';
import {ICells} from '../../../../../core/model/geometry/Cells.type';
import {default as Geometry} from '../../../../../core/model/geometry/Geometry';
import {IGeometry} from '../../../../../core/model/geometry/Geometry.type';
import {Cells, ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {BoundaryCollection, BoundaryFactory} from '../../../../../core/model/modflow/boundaries';
import {BoundaryType, ISpValues, IValueProperty} from '../../../../../core/model/modflow/boundaries/Boundary.type';
import {IRootReducer} from '../../../../../reducers';
import {sendCommand} from '../../../../../services/api';
import ContentToolBar from '../../../../shared/ContentToolbar';
import {addMessage, updateBoundaries} from '../../../actions/actions';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import {messageError} from '../../../defaults/messages';
import {CALCULATE_CELLS_INPUT} from '../../../worker/t03.worker';
import {ICalculateCellsInputData} from '../../../worker/t03.worker.type';
import {asyncWorker} from '../../../worker/worker';
import {CreateBoundaryMap} from '../../maps';
import {UploadGeoJSONModal} from '../create';

const baseUrl = '/tools/T03';

interface IOwnProps {
    type: BoundaryType;
}

type Props = IOwnProps & RouteComponentProps<{
    id: string;
    property?: string;
    type?: string;
}>;

const CreateBoundary = (props: Props) => {
    const [name, setName] = useState<string>('New ' + props.match.params.type + '-Boundary');
    const [geometry, setGeometry] = useState<IGeometry | null>(null);
    const [cells, setCells] = useState<ICells | null>(null);
    const [layers, setLayers] = useState<number[]>([0]);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;
    const model = T03.model ? ModflowModel.fromObject(T03.model) : null;
    const soilmodel = T03.soilmodel ? Soilmodel.fromObject(T03.soilmodel) : null;

    const dispatch = useDispatch();
    const type: BoundaryType = props.match.params.type as BoundaryType;

    if (!boundaries || !model || !soilmodel) {
        return (
            <Segment color={'grey'} loading={true}/>
        );
    }

    const handleChangeGeometry = (cGeometry: Geometry) => {
        if (model.boundingBox) {
            let g = cGeometry.toGeoJSON();
            if (model.rotation % 360 !== 0) {
                g = turf.transformRotate(
                    cGeometry.toGeoJSON(), -1 * model.rotation, {pivot: model.geometry.centerOfMass}
                );
            }
            asyncWorker({
                type: CALCULATE_CELLS_INPUT,
                data: {
                    geometry: g,
                    boundingBox: model.boundingBox.toObject(),
                    gridSize: model.gridSize.toObject(),
                    intersection: model.intersection
                } as ICalculateCellsInputData
            }).then((c: ICells) => {
                setCells(Cells.fromObject(c).removeCells(model.inactiveCells));
                setGeometry(cGeometry.toObject());
                return setIsDirty(true);
            }).catch(() => {
                dispatch(addMessage(messageError('boundaries', 'Calculating cells failed.')));
            });
        }
    };

    const handleApplyJson = (cGeometry: Geometry) => {
        let g = cGeometry.toGeoJSON();
        if (model.rotation % 360 !== 0) {
            g = turf.transformRotate(
                cGeometry.toGeoJSON(), -1 * model.rotation, {pivot: model.geometry.centerOfMass}
            );
        }

        asyncWorker({
            type: CALCULATE_CELLS_INPUT,
            data: {
                geometry: g,
                boundingBox: model.boundingBox.toObject(),
                gridSize: model.gridSize.toObject(),
                intersection: model.intersection
            } as ICalculateCellsInputData
        }).then((c: ICells) => {
            const cCells = Cells.fromObject(c).removeCells(model.inactiveCells);
            return handleSave(cGeometry.toObject(), cCells);
        }).catch(() => {
            dispatch(addMessage(messageError('boundaries', 'Calculating cells failed.')));
        });
    };

    const handleChange = (e: SyntheticEvent<HTMLElement, Event> | ChangeEvent<HTMLInputElement>,
                          data: DropdownProps | InputOnChangeData) => {
        setIsDirty(true);
        if (data.name === 'layers' && typeof data.value === 'number') {
            return setLayers([data.value]);
        }

        if (data.name === 'name' && typeof data.value === 'string') {
            return setName(data.value);
        }
    };

    const handleSave = (sGeometry = geometry, sCells = cells) => {
        if (!boundaries || !model || !sGeometry || !sCells || !type) {
            return null;
        }

        const {id, property} = props.match.params;
        const valueProperties = BoundaryFactory.valuePropertiesByType(type);
        const values = valueProperties.map((vp: IValueProperty) => vp.default);

        const boundary = BoundaryFactory.createNewFromProps(
            type,
            Uuid.v4(),
            sGeometry,
            name,
            layers,
            sCells,
            new Array(model.stressperiods.count).fill(values) as ISpValues,
            ['fhb', 'hob'].includes(type) ? [model.stressperiods.startDateTime.format('YYYY-MM-DD')] : undefined
        );

        return sendCommand(ModflowModelCommand.addBoundary(model.id, boundary),
            () => {
                const cBoundaries = boundaries;
                cBoundaries.addBoundary(boundary);
                dispatch(updateBoundaries(cBoundaries));
                props.history.push(`${baseUrl}/${id}/${property}/!/${boundary.id}`);
            },
            () => setIsError(true)
        );
    };

    const renderDropdown = () => {
        // Add boundary types, which doesn't need layer selection:
        if (['evt', 'rch', 'riv'].includes(type)) {
            return null;
        }

        // Add boundary types, for which multiple layers may be selected:
        const multipleLayers = ['chd', 'ghb'].includes(type);
        return (
            <Form.Dropdown
                label={'Selected layers'}
                selection={true}
                fluid={true}
                options={soilmodel.layersCollection.all.map((l, key) => (
                    {key: l.id, value: key, text: l.name}
                ))}
                value={multipleLayers ? layers : layers[0]}
                multiple={multipleLayers}
                name={'layers'}
                onChange={handleChange}
            />

        );
    };

    const getSchema = () => {
        if (['wel', 'hob'].includes(type)) {
            return 'point';
        }
        if (['chd', 'drn', 'fhb', 'ghb', 'riv'].includes(type)) {
            return 'linestring';
        }
        return 'polygon';
    };

    return (
        <Segment color={'grey'}>
            <Grid padded={true}>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Header as={'h2'}>
                            {type === 'hob' ? 'Create HOB' : 'Create Boundary'}
                        </Header>
                        <Form>
                            <Form.Input
                                label={'Name'}
                                name={'name'}
                                value={name}
                                onChange={handleChange}
                            />
                            {renderDropdown()}
                            <UploadGeoJSONModal
                                onChange={handleApplyJson}
                                geometry={getSchema()}
                                size={'medium'}
                            />
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <ContentToolBar
                            onSave={() => handleSave(geometry, cells)}
                            isValid={!!geometry}
                            isDirty={isDirty && !!geometry && !!cells}
                            isError={isError}
                            buttonSave={!model.readOnly && !isEditing}
                        />
                        <br />
                        <CreateBoundaryMap
                            boundaries={boundaries}
                            area={model.geometry}
                            type={type}
                            geometry={geometry ? Geometry.fromObject(geometry) : null}
                            onChangeGeometry={handleChangeGeometry}
                            onToggleEditMode={() => setIsEditing(!isEditing)}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};

export default withRouter(CreateBoundary);
