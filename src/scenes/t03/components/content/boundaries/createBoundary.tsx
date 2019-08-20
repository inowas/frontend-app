import React, {ChangeEvent, SyntheticEvent} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {DropdownProps, Form, Grid, Header, InputOnChangeData, Segment} from 'semantic-ui-react';
import Uuid from 'uuid';
import {ICells} from '../../../../../core/model/geometry/Cells.type';
import {default as Geometry} from '../../../../../core/model/geometry/Geometry';
import {GeoJson} from '../../../../../core/model/geometry/Geometry.type';

import {ModflowModel, Soilmodel, Stressperiods} from '../../../../../core/model/modflow';
import {BoundaryCollection, BoundaryFactory} from '../../../../../core/model/modflow/boundaries';
import Boundary from '../../../../../core/model/modflow/boundaries/Boundary';
import {BoundaryType, ISpValues, IValueProperty} from '../../../../../core/model/modflow/boundaries/Boundary.type';
import ContentToolBar from '../../../../../scenes/shared/ContentToolbar';
import {sendCommand} from '../../../../../services/api';
import {calculateActiveCells} from '../../../../../services/geoTools';
import {updateBoundaries} from '../../../actions/actions';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import {CreateBoundaryMap} from '../../maps';

const baseUrl = '/tools/T03';

interface IOwnProps {
    history: any;
    location: any;
    match: any;
    readOnly: boolean;
    type: BoundaryType;
}

interface IStateProps {
    boundaries: BoundaryCollection;
    model: ModflowModel;
    soilmodel: Soilmodel;
    stressperiods: Stressperiods;
}

interface IDispatchProps {
    updateBoundaries: (packages: BoundaryCollection) => any;
}

type Props = IStateProps & IDispatchProps & IOwnProps;

interface IState {
    name: string;
    geometry: GeoJson | null;
    cells: ICells | null;
    layers: number[];
    isLoading: boolean;
    isDirty: boolean;
    isEditing: boolean;
    isError: boolean;
    state: null;
}

class CreateBoundary extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);
        const {type} = this.props.match.params;

        this.state = {
            name: 'New ' + type + '-Boundary',
            geometry: null,
            cells: null,
            layers: [0],
            isLoading: false,
            isDirty: false,
            isEditing: false,
            isError: false,
            state: null
        };
    }

    public onChangeGeometry = (geometry: Geometry) => {
        if (this.props.model.boundingBox) {
            const cells = calculateActiveCells(geometry, this.props.model.boundingBox,
                this.props.model.gridSize);
            this.setState({
                cells: cells.toObject(),
                geometry: geometry.toObject(),
                isDirty: true
            });
        }
    };

    public onToggleEditMode = () => this.setState((prevState) => ({
        isEditing: !prevState.isEditing
    }));

    public handleChange = (e: SyntheticEvent<HTMLElement, Event> | ChangeEvent<HTMLInputElement>,
                           data: DropdownProps | InputOnChangeData) => {
        let value = data.value;
        if (data.name === 'layers' && typeof value === 'number') {
            value = [value];
        }

        return this.setState({
            [data.name]: value,
            isDirty: true
        } as Pick<IState, keyof IState>);
    };

    public onSave = () => {
        const {id, property, type} = this.props.match.params;
        const {model, stressperiods} = this.props;
        const {name, geometry, cells, layers} = this.state;

        const valueProperties = BoundaryFactory.valuePropertiesByType(type);
        const values = valueProperties.map((vp: IValueProperty) => vp.default);

        if (!geometry || !cells) {
            return null;
        }

        const boundary = BoundaryFactory.createNewFromProps(
            type,
            Uuid.v4(),
            geometry,
            name,
            layers,
            cells,
            new Array(stressperiods.count).fill(values) as ISpValues
        );

        return sendCommand(ModflowModelCommand.addBoundary(model.id, boundary),
            () => {
                const boundaries = this.props.boundaries;
                boundaries.addBoundary(boundary as Boundary);
                this.props.updateBoundaries(boundaries);
                this.props.history.push(`${baseUrl}/${id}/${property}/!/${boundary.id}`);
            },
            () => this.setState({isError: true})
        );
    };

    public renderDropdown() {
        const {type} = this.props.match.params;

        // Add boundary types, which doesn't need layer selection:
        if (['evt', 'rch', 'riv'].includes(type)) {
            return null;
        }

        // Add boundary types, for which multiple layers may be selected:
        const multipleLayers = ['chd', 'ghb'].includes(type);

        const {layers} = this.state;
        return (
            <Form.Dropdown
                label={'Selected layers'}
                selection={true}
                fluid={true}
                options={this.props.soilmodel.layersCollection.all.map((l, key) => (
                    {key: l.id, value: key, text: l.name}
                ))}
                value={multipleLayers ? layers : layers[0]}
                multiple={multipleLayers}
                name={'layers'}
                onChange={this.handleChange}
            />

        );
    }

    public render() {
        const {model} = this.props;
        const readOnly = model.readOnly;
        const {isError, isDirty, cells, geometry, name} = this.state;
        const {type} = this.props.match.params;

        return (
            <Segment color={'grey'} loading={this.state.isLoading}>
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
                                    onChange={this.handleChange}
                                />
                                {this.renderDropdown()}
                            </Form>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <ContentToolBar
                                onSave={this.onSave}
                                isValid={!!geometry}
                                isDirty={isDirty && !!geometry && !!cells}
                                isError={isError}
                                saveButton={!readOnly && !this.state.isEditing}
                            />
                            <CreateBoundaryMap
                                type={type}
                                geometry={model.geometry}
                                onChangeGeometry={this.onChangeGeometry}
                                onToggleEditMode={this.onToggleEditMode}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        boundaries: BoundaryCollection.fromObject(state.T03.boundaries),
        model: ModflowModel.fromObject(state.T03.model),
        stressperiods: ModflowModel.fromObject(state.T03.model).stressperiods,
        soilmodel: Soilmodel.fromObject(state.T03.soilmodel)
    };
};

const mapDispatchToProps = {
    updateBoundaries
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateBoundary));
