import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {fetchUrl, sendCommand} from '../../../../../services/api';
import {Grid, Segment} from 'semantic-ui-react';
import BoundaryList from './boundaryList';
import BoundaryDetails from './boundaryDetails';
import {BoundaryCollection, ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {updateBoundaries, updateModel} from '../../../actions/actions';
import {BoundaryFactory} from '../../../../../core/model/modflow/boundaries';
import ContentToolBar from '../../../../../scenes/shared/ContentToolbar';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import BoundariesImport from './boundaryImport';

const baseUrl = '/tools/T03';

class Boundaries extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedBoundary: null,
            isLoading: true,
            isDirty: false,
            error: false,
            state: null
        }
    }

    componentDidMount() {
        const {id, pid} = this.props.match.params;

        if (this.props.boundaries.length === 0) {
            return this.setState({
                isLoading: false
            })
        }

        if (!pid && this.props.boundaries.length > 0) {
            return this.redirectToFirstBoundary(this.props);
        }

        if (pid) {
            return this.fetchBoundary(id, pid);
        }
    }

    componentWillReceiveProps(nextProps) {
        const {id, pid} = nextProps.match.params;

        if (!pid && nextProps.boundaries.length > 0) {
            return this.redirectToFirstBoundary(nextProps);
        }

        if ((this.props.match.params.id !== id) || (this.props.match.params.pid !== pid)) {
            return this.setState({
                isLoading: true
            }, () => this.fetchBoundary(id, pid));
        }
    }

    redirectToFirstBoundary = (props) => {
        const {id, property} = props.match.params;

        if (props.boundaries.length > 0) {
            const bid = props.boundaries.first.id;
            return this.props.history.push(`${baseUrl}/${id}/${property}/!/${bid}`);
        }

        return this.props.history.push(`${baseUrl}/${id}/${property}`);
    };

    fetchBoundary = (modelId, boundaryId) => fetchUrl(`modflowmodels/${modelId}/boundaries/${boundaryId}`,
        (boundary) => this.setState({
            isLoading: false,
            selectedBoundary: boundary
        })
    );

    onChangeBoundary = boundary => {
        return this.setState({
            selectedBoundary: boundary.toObject(),
            isDirty: true
        });
    };

    handleBoundaryClick = (bid) => {
        const {id, property} = this.props.match.params;
        this.props.history.push(`${baseUrl}/${id}/${property}/${'!'}/${bid}`);
    };

    onAdd = type => {
        const {id, property} = this.props.match.params;
        if (type !== '!' && BoundaryFactory.availableTypes.indexOf(type >= 0)) {
            const newBoundary = BoundaryFactory.fromType(type);
            newBoundary.name = `New ${type}-Boundary`;
            newBoundary.affectedLayers = [0];

            this.props.history.push(`${baseUrl}/${id}/${property}/${type}`);
        }
    };

    onClone = (boundaryId) => {
        const model = this.props.model;
        fetchUrl(`modflowmodels/${model.id}/boundaries/${boundaryId}`,
            (boundary) => {
                const clonedBoundary = BoundaryFactory.fromObject(boundary).clone();
                sendCommand(ModflowModelCommand.addBoundary(model.id, clonedBoundary),
                    () => {
                        const boundaries = this.props.boundaries;
                        boundaries.addBoundary(clonedBoundary);
                        this.props.updateBoundaries(boundaries);
                        this.handleBoundaryClick(clonedBoundary.id);
                    },
                    () => this.setState({error: true})
                )
            }
        )
    };

    onRemove = (boundaryId) => {
        const model = this.props.model;
        return sendCommand(ModflowModelCommand.removeBoundary(model.id, boundaryId),
            () => {
                const boundaries = this.props.boundaries;
                boundaries.removeById(boundaryId);
                this.props.updateBoundaries(boundaries);
                this.redirectToFirstBoundary(this.props);
            },
            () => this.setState({error: true})
        )
    };

    onUpdate = () => {
        const model = this.props.model;
        const boundary = BoundaryFactory.fromObject(this.state.selectedBoundary);
        return sendCommand(ModflowModelCommand.updateBoundary(model.id, boundary),
            () => {
                this.setState({
                    isDirty: false
                });

                const boundaries = this.props.boundaries;
                boundaries.update(boundary);
                this.props.updateBoundaries(boundaries);
            },
            () => this.setState({error: true})
        )
    };

    render() {
        const {model, soilmodel, types} = this.props;
        const readOnly = model.readOnly;
        const {error, isDirty, isLoading, selectedBoundary} = this.state;
        const {pid} = this.props.match.params;

        const boundaries = types ? new BoundaryCollection() : this.props.boundaries;
        if (types) {
            boundaries.items = this.props.boundaries.all.filter(b => types.includes(b.type));
        }

        const boundary = BoundaryFactory.fromObject(selectedBoundary);

        return (
            <Segment color={'grey'} loading={isLoading}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <BoundaryList
                                boundaries={boundaries}
                                onAdd={this.onAdd}
                                onClick={this.handleBoundaryClick}
                                onClone={this.onClone}
                                onRemove={this.onRemove}
                                selected={pid}
                                types={types}
                            />
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={16}>
                                        <ContentToolBar
                                            onSave={this.onUpdate}
                                            isDirty={isDirty}
                                            isError={error}
                                            saveButton={!readOnly}
                                            importButton={this.props.readOnly ||
                                            <BoundariesImport
                                                onChange={this.handleChange}
                                            />
                                            }
                                        />
                                        {!isLoading &&
                                        <BoundaryDetails
                                            boundary={boundary}
                                            boundaries={boundaries}
                                            model={model}
                                            soilmodel={soilmodel}
                                            onClick={this.handleBoundaryClick}
                                            onChange={this.onChangeBoundary}
                                            readOnly={readOnly}
                                        />}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        )
    }
}

const mapStateToProps = (state, props) => {
    const boundaries = BoundaryCollection.fromObject(state.T03.boundaries);
    if (props.types && boundaries.length > 0) {
        boundaries.items = boundaries.all.filter(b => props.types.includes(b.type));
    }

    return ({
        readOnly: ModflowModel.fromObject(state.T03.model).readOnly,
        boundaries: boundaries,
        model: ModflowModel.fromObject(state.T03.model),
        soilmodel: Soilmodel.fromObject(state.T03.soilmodel)
    })
};

const mapDispatchToProps = {
    updateBoundaries, updateModel
};

Boundaries.propTypes = {
    readOnly: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    soilmodel: PropTypes.instanceOf(Soilmodel).isRequired,
    types: PropTypes.arrayOf(String),
    updateBoundaries: PropTypes.func.isRequired,
    updateModel: PropTypes.func.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Boundaries));
