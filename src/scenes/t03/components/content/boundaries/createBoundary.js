import React from 'react';
import Uuid from 'uuid';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {sendCommand} from '../../../../../services/api';
import {Form, Grid, Header, Segment} from 'semantic-ui-react';
import {ModflowModel, Soilmodel, Stressperiods} from '../../../../../core/model/modflow';
import {updateBoundaries} from '../../../actions/actions';
import {BoundaryCollection, BoundaryFactory} from '../../../../../core/model/modflow/boundaries';
import ContentToolBar from '../../../../../scenes/shared/ContentToolbar';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import {CreateBoundaryMap} from '../../maps';
import {calculateActiveCells} from '../../../../../services/geoTools';

const baseUrl = '/tools/T03';

class CreateBoundary extends React.Component {
    constructor(props) {
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
        }
    }

    onChangeGeometry = geometry => {
        const cells = calculateActiveCells(geometry, this.props.model.boundingBox, this.props.model.gridSize);
        this.setState({
            cells: cells.toArray(),
            geometry: geometry.toObject(),
            isDirty: true
        });
    };

    onToggleEditMode = () => this.setState(prevState => ({
        isEditing: !prevState.isEditing
    }));

    handleChange = (e, {name, value}) => {
        if (name === 'layers') {
            value = [value];
        }

        this.setState({
            [name]: value,
            isDirty: true
        });
    };

    onSave = () => {
        const {id, property, type} = this.props.match.params;
        const {model, stressperiods} = this.props;
        const {name, geometry, cells, layers} = this.state;

        const valueProperties = BoundaryFactory.fromType(type).valueProperties;
        const values = valueProperties.map(vp => vp.default);

        const boundary = BoundaryFactory.createNewFromProps(
            type,
            Uuid.v4(),
            geometry,
            name,
            layers,
            cells,
            new Array(stressperiods.count).fill(values)
        );

        return sendCommand(ModflowModelCommand.addBoundary(model.id, boundary),
            () => {
                const boundaries = this.props.boundaries;
                boundaries.addBoundary(boundary);
                this.props.updateBoundaries(boundaries);
                this.props.history.push(`${baseUrl}/${id}/${property}/${'!'}/${boundary.id}`);
            },
            () => this.setState({isError: true})
        )
    };

    render() {
        const {model} = this.props;
        const readOnly = model.readOnly;
        const {isError, isDirty, cells, geometry, name, layers} = this.state;
        const {type} = this.props.match.params;

        return (
            <Segment color={'grey'} loading={this.state.isLoading}>
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <Header as={'h2'}>Create Boundary</Header>
                            <Form>
                                <Form.Input
                                    label={'Name'}
                                    name={'name'}
                                    value={name}
                                    onChange={this.handleChange}
                                />

                                <Form.Dropdown
                                    label={'Selected layers'}
                                    selection
                                    fluid
                                    options={this.props.soilmodel.layersCollection.all.map((l, key) => (
                                        {key: l.id, value: key, text: l.name}
                                    ))}
                                    value={layers[0]}
                                    name={'layers'}
                                    onChange={this.handleChange}
                                />
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
        )
    }
}

const mapStateToProps = state => {
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


CreateBoundary.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    soilmodel: PropTypes.instanceOf(Soilmodel).isRequired,
    stressperiods: PropTypes.instanceOf(Stressperiods).isRequired,
    updateBoundaries: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateBoundary));
