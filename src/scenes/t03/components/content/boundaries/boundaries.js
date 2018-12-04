import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Redirect, withRouter} from 'react-router-dom';

import {fetchUrl} from 'services/api';
import {Grid, Segment} from 'semantic-ui-react';
import BoundaryList from './boundaryList';
import BoundaryDetails from './boundaryDetails';
import {BoundaryCollection, ModflowModel, Soilmodel} from 'core/model/modflow';
import {updateBoundaries, updateModel} from '../../../actions/actions';
import {BoundaryFactory} from 'core/model/modflow/boundaries';
import ContentToolBar from '../../shared/contentToolbar';

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

    fetchBoundary = (modelId, boundaryId) => {
        return (
            fetchUrl(`modflowmodels/${modelId}/boundaries/${boundaryId}`,
                (boundary) => this.setState({selectedBoundary: boundary})
            )
        )
    };

    onChangeBoundary = boundary =>
        this.setState({selectedBoundary: boundary.toObject});

    handleBoundaryListClick = (bid) => {
        const {id, property, type} = this.props.match.params;
        this.props.history.push(`${baseUrl}/${id}/${property}/${type || '!'}/${bid}`);
    };

    onSave = () => {
        this.setState({state: 'notSaved'})
    };

    render() {
        const model = this.props.model;
        const {id, pid, property, type} = this.props.match.params;

        // If no boundary is selected, redirect to the first.
        if (!pid && this.props.boundaries.length > 0) {
            const bid = this.props.boundaries.first.id;
            return <Redirect to={`${baseUrl}/${id}/${property}/${type || '!'}/${bid}`}/>
        }

        const boundary = BoundaryFactory.fromObjectData(this.state.selectedBoundary);
        return (
            <Segment color={'grey'} loading={this.state.isLoading}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <BoundaryList
                                boundaries={this.props.boundaries}
                                onChange={this.handleBoundaryListClick}
                                selected={pid}
                            />
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <ContentToolBar state={this.state.state} save onSave={this.onSave}/>
                            {!this.state.isLoading &&
                            <BoundaryDetails
                                boundary={boundary}
                                soilmodel={this.props.soilmodel}
                                geometry={model.geometry}
                                onChange={this.onChangeBoundary}
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
        model: ModflowModel.fromObject(state.T03.model),
        boundaries: BoundaryCollection.fromObject(state.T03.boundaries),
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
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Boundaries));
