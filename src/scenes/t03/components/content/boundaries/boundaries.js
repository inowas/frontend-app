import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {fetchUrl} from 'services/api';
import {Grid, Segment} from 'semantic-ui-react';
import BoundaryList from './boundaryList';
import BoundaryFactory from 'core/model/modflow/boundaries/BoundaryFactory';
import BoundaryDetails from './boundaryDetails';
import {ModflowModel} from 'core/model/modflow';
import {connect} from 'react-redux';
import {updateBoundaries, updateModel} from '../../../actions/actions';

const baseUrl = '/tools/T03';

class Boundaries extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boundaries: props.boundaries,
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
            boundaries: nextProps.boundaries
        })
    }

    fetchBoundary = (modelId, boundaryId) => {
        return (
            fetchUrl(`modflowmodels/${modelId}/boundaries/${boundaryId}`, this.handleChangeBoundary)
        )
    };

    handleChangeBoundary = boundary => this.setState({
        boundaries: this.state.boundaries.map(b => {
            if (b.id === boundary.id) {
                return boundary;
            }

            return b;
        })
    });

    save = () => {
    };

    handleClickBoundary = (bid) => {
        const {id, property, type} = this.props.match.params;
        this.props.history.push(`${baseUrl}/${id}/${property}/${type || '!'}/${bid}`);
    };

    render() {
        const model = ModflowModel.fromObject(this.props.model);
        const {pid} = this.props.match.params;
        const boundary = BoundaryFactory.fromObjectData(this.state.boundaries.filter(b => b.id === pid)[0]);

        return (
            <div>
                <Segment color={'grey'} loading={this.state.isLoading}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={4}>
                                <BoundaryList
                                    boundaries={this.state.boundaries}
                                    onChange={this.handleClickBoundary}
                                    selected={pid}
                                />
                            </Grid.Column>
                            <Grid.Column width={12}>
                                {!this.state.isLoading &&
                                <BoundaryDetails
                                    boundary={boundary}
                                    geometry={model.geometry}
                                    onChange={this.handleChangeBoundary}
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
        model: state.T03.model,
        boundaries: state.T03.boundaries
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
    boundaries: PropTypes.array.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Boundaries));
