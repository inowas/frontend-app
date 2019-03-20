import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Redirect, withRouter} from 'react-router-dom';

import {fetchUrl, sendCommand} from 'services/api';

import {Grid, Segment} from 'semantic-ui-react';
import BoundaryList from './boundaryList';
import BoundaryDetails from './boundaryDetails';
import {BoundaryCollection, ModflowModel, Soilmodel} from 'core/model/modflow';
import {updateBoundaries, updateModel} from '../../../actions/actions';
import {BoundaryFactory} from 'core/model/modflow/boundaries';
import ContentToolBar from 'scenes/shared/ContentToolbar';
import ModflowModelCommand from '../../../commands/modflowModelCommand';

const baseUrl = '/tools/T03';

class Boundaries extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedBoundary: null,
            isLoading: false,
            isDirty: false,
            error: false,
            state: null
        }
    }

    componentDidMount() {
        const {id, pid} = this.props.match.params;
        if (pid) {
            this.fetchBoundary(id, pid);
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {id, pid} = nextProps.match.params;
        if ((this.props.match.params.id !== id) || (this.props.match.params.pid !== pid)) {
            this.fetchBoundary(id, pid);
        }
    }

    fetchBoundary = (modelId, boundaryId) => fetchUrl(`modflowmodels/${modelId}/boundaries/${boundaryId}`,
        (boundary) => this.setState({selectedBoundary: boundary})
    );

    onChangeBoundary = boundary => {
        return this.setState({
            selectedBoundary: boundary.toObject(),
            isDirty: true
        });
    };

    handleBoundaryListClick = (bid) => {
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
                        this.handleBoundaryListClick(clonedBoundary.id);
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
                this.handleBoundaryListClick(boundaries.first.id);
            },
            () => this.setState({error: true})
        )
    };

    onUpdate = () => {
        const model = this.props.model;
        const boundary = BoundaryFactory.fromObject(this.state.selectedBoundary);
        return sendCommand(ModflowModelCommand.updateBoundary(model.id, boundary),
            () => {
                this.setState({isDirty: false});
                this.fetchBoundary(model.id, boundary.id);

                const boundaries = this.props.boundaries;
                boundaries.update(boundary);
                this.props.updateBoundaries(boundaries);
            },
            () => this.setState({error: true})
        )
    };

    render() {
        const {boundaries, model, soilmodel} = this.props;
        const readOnly = model.readOnly;
        const {error, isDirty, isLoading, selectedBoundary} = this.state;
        const {id, pid, property} = this.props.match.params;

        // If no boundary is selected, redirect to the first.
        if (!pid && boundaries.length > 0) {
            const bid = boundaries.first.id;
            return <Redirect to={`${baseUrl}/${id}/${property}/${'!'}/${bid}`}/>
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
                                onClick={this.handleBoundaryListClick}
                                onClone={this.onClone}
                                onRemove={this.onRemove}
                                selected={pid}
                            />
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <ContentToolBar
                                onSave={this.onUpdate}
                                isDirty={isDirty}
                                isError={error}
                                saveButton={!readOnly}
                            />
                            {!isLoading &&
                            <BoundaryDetails
                                boundary={boundary}
                                model={model}
                                soilmodel={soilmodel}
                                onChange={this.onChangeBoundary}
                                readOnly={readOnly}
                            />}
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
    updateBoundaries, updateModel
};


Boundaries.proptypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    soilmodel: PropTypes.instanceOf(Soilmodel).isRequired,
    updateBoundaries: PropTypes.func.isRequired,
    updateModel: PropTypes.func.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Boundaries));
