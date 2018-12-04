import React from 'react';
import PropTypes from 'prop-types';
import {Redirect, withRouter} from 'react-router-dom';
import {fetchUrl} from 'services/api';
import {Grid, Segment} from 'semantic-ui-react';
import BoundaryList from './boundaryList';
import BoundaryDetails from './boundaryDetails';
import {ModflowModel} from 'core/model/modflow';
import {connect} from 'react-redux';
import {updateBoundaries, updateModel} from '../../../actions/actions';
import {BoundaryCollection, Soilmodel} from 'core/model/modflow';

const baseUrl = '/tools/T03';

class Boundaries extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boundaries: props.boundaries.toObject(),
            isLoading: false,
            isDirty: false,
            error: false
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

        this.setState({
            boundaries: nextProps.boundaries.toObject()
        })
    }

    fetchBoundary = (modelId, boundaryId) => {
        return (
            fetchUrl(`modflowmodels/${modelId}/boundaries/${boundaryId}`, this.onChangeBoundary)
        )
    };

    onChangeBoundary = boundary => this.setState({
        boundaries: this.state.boundaries.map(b => {
            if (b.id === boundary.id) {
                return boundary;
            }
            return b;
        }, this.save)
    });

    handleBoundaryListClick = (bid) => {
        const {id, property, type} = this.props.match.params;
        this.props.history.push(`${baseUrl}/${id}/${property}/${type || '!'}/${bid}`);
    };

    save = () => {
    };

    render() {
        const model = ModflowModel.fromObject(this.props.model);
        const {pid} = this.props.match.params;

        // If no boundary is selected, redirect to the first.
        if (!pid && this.state.boundaries.length > 0) {
            const {id, property, type} = this.props.match.params;
            const bid = this.state.boundaries[0].id;
            return <Redirect to={`${baseUrl}/${id}/${property}/${type || '!'}/${bid}`}/>
        }

        const boundary = BoundaryCollection.fromObject(this.state.boundaries).findById(pid);
        return (
            <div>
                <Segment color={'grey'} loading={this.state.isLoading}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={4}>
                                <BoundaryList
                                    boundaries={this.state.boundaries}
                                    onChange={this.handleBoundaryListClick}
                                    selected={pid}
                                />
                            </Grid.Column>
                            <Grid.Column width={12}>
                                {!this.state.isLoading &&
                                <BoundaryDetails
                                    boundary={boundary}
                                    geometry={model.geometry}
                                    onChange={this.onChangeBoundary}
                                />}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        model: ModflowModel.fromObject(state.T03.model),
        boundaries: BoundaryCollection.fromObject(state.T03.boundaries)
    };
};

const mapDispatchToProps = {
    updateBoundaries, updateModel
};


Boundaries.proptypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    soilmodel: PropTypes.instanceOf(Soilmodel).isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Boundaries));
