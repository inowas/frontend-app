import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {fetchUrl} from 'services/api';
import {Grid, Segment} from 'semantic-ui-react';
import BoundaryList from './boundaryList';
import BoundaryFactory from 'core/model/modflow/boundaries/BoundaryFactory';
import BoundaryDetails from './boundaryDetails';
import {ModflowModel} from 'core/model/modflow';

const baseUrl = '/tools/T03';

class Boundaries extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boundaries: [],
            isDirty: false,
            isLoading: true,
            error: false
        }
    }

    componentDidMount() {
        fetchUrl(
            `modflowmodels/${this.props.match.params.id}/boundaries`,
            boundaries => this.setState({
                boundaries: boundaries.map(b => BoundaryFactory.fromObjectData(b)),
                isLoading: false
            }),
            error => this.setState({error, isLoading: false})
        );
    }

    save = () => {
    };

    handleClickBoundary = (bid) => {
        const {id, property, type} = this.props.match.params;
        this.props.history.push(`${baseUrl}/${id}/${property}/${type || '!'}/${bid}`);
    };

    render() {
        const {model} = this.props;
        const {pid} = this.props.match.params;
        const boundary = this.state.boundaries.filter(b=>b.id === pid)[0];

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
                                {!this.state.isLoading && <BoundaryDetails boundary={boundary} geometry={model.geometry}/>}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
        )
    }
}

Boundaries.proptypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
};

export default withRouter(Boundaries);
