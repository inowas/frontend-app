import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {sendCommand} from 'services/api';
import {Form, Grid, Header, Segment} from 'semantic-ui-react';
import {ModflowModel, Soilmodel} from 'core/model/modflow';
import {updateBoundaries} from '../../../actions/actions';
import {BoundaryCollection, BoundaryFactory} from 'core/model/modflow/boundaries';
import ContentToolBar from 'scenes/shared/ContentToolbar';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import {CreateBoundaryMap} from '../../maps';
import {calculateActiveCells} from 'services/geoTools';

const baseUrl = '/tools/T03';

class Boundaries extends React.Component {
    constructor(props) {
        super(props);
        const {type} = this.props.match.params;

        this.state = {
            name: 'New ' + type + '-Boundary',
            affectedLayers: [0],
            subType: BoundaryFactory.fromType(type).subType,
            subTypes: BoundaryFactory.fromType(type).subTypes,
            geometry: null,
            activeCells: null,
            isLoading: false,
            isDirty: false,
            error: false,
            state: null
        }
    }

    onChangeGeometry = geometry => {
        const activeCells = calculateActiveCells(geometry, this.props.model.boundingBox, this.props.model.gridSize);
        this.setState({
            activeCells,
            geometry,
            isDirty: true
        });
    };

    handleChange = (e, {name, value}) => {
        if (name === 'affectedLayers') {
            value = [value];
        }

        this.setState({
            [name]: value,
            isDirty: true
        });
    };

    onSave = () => {
        const {id, property} = this.props.match.params;
        const {model} = this.props;

        const boundary = BoundaryFactory.createByTypeAndStartDate({
            name: this.state.name,
            type: this.props.match.params.type,
            geometry: this.state.geometry,
            utcIsoStartDateTimes: this.props.model.stressperiods.dateTimes
        });

        boundary.activeCells = this.state.activeCells;
        boundary.affectedLayers = this.state.affectedLayers;

        return sendCommand(ModflowModelCommand.addBoundary(model.id, boundary),
            () => {
                this.props.updateBoundaries(this.props.boundaries.addBoundary(boundary));
                this.props.history.push(`${baseUrl}/${id}/${property}/${'!'}/${boundary.id}`);
            },
            () => this.setState({error: true})
        )
    };

    render() {
        const {model} = this.props;
        const readOnly = model.readOnly;
        const {error, isDirty, name, affectedLayers, subType, subTypes} = this.state;
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
                                    value={affectedLayers[0]}
                                    name={'affectedLayers'}
                                    onChange={this.handleChange}
                                />

                                {subTypes &&
                                <Form.Dropdown
                                    label={subTypes.name}
                                    selection
                                    fluid
                                    options={subTypes.types.map(t => (
                                        {key: t.value, value: t.value, text: t.name}
                                    ))}
                                    value={subType}
                                    name={'subType'}
                                    onChange={this.handleChange}
                                />
                                }
                            </Form>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <ContentToolBar
                                onSave={this.onSave}
                                isValid={(this.state.boundary !== null)}
                                isDirty={isDirty}
                                isError={error}
                                saveButton={!readOnly}
                            />
                            <CreateBoundaryMap
                                type={type}
                                geometry={model.geometry}
                                onChangeGeometry={this.onChangeGeometry}
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
        soilmodel: Soilmodel.fromObject(state.T03.soilmodel)
    };
};

const mapDispatchToProps = {
    updateBoundaries
};


Boundaries.proptypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    soilmodel: PropTypes.instanceOf(Soilmodel).isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Boundaries));
