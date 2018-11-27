import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {fetchUrl} from 'services/api';
import {Grid, List, Segment} from 'semantic-ui-react';


class Boundaries extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            name: null,
            activeCells: null,
            boundingBox: null,
            description: null,
            geometry: null,
            gridSize: null,
            isPublic: null,
            permissions: null,
            boundaries: [],
            isLoading: true,
            dirty: false,
            error: false
        }
    }

    componentDidMount() {
        fetchUrl(
            `modflowmodels/${this.props.match.params.id}`,
            model => this.setState({
                id: model.id,
                name: model.name,
                description: model.description,
                activeCells: model.active_cells,
                boundingBox: model.bounding_box,
                geometry: model.geometry,
                gridSize: model.grid_size,
                lengthUnit: model.length_unit,
                timeUnit: model.time_unit,
                isPublic: model.public,
                permissions: model.permissions,
                isLoading: false
            }),
            error => this.setState({error, isLoading: false})
        );

        fetchUrl(
            `modflowmodels/${this.props.match.params.id}/boundaries`,
            boundaries => this.setState({boundaries}),
            error => this.setState({error, isLoading: false})
        );
    }

    render() {
        if (this.state.isLoading) {
            return (
                <Segment color={'grey'} loading/>
            )
        }

        const boundaryList = this.state.boundaries.map(b => (
            <List.Item key={b.id}>{b.name}</List.Item>
        ));

        return (
            <Segment color={'grey'} loading={this.state.isLoading}>
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column width={6}>
                            <List link>{boundaryList}</List>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            DETAILS
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        )
    }
}

Boundaries.proptypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(Boundaries);
