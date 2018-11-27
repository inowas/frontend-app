import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {fetchUrl} from 'services/api';
import {Accordion, Grid, List, Menu, Segment} from 'semantic-ui-react';

const baseUrl = '/tools/T03';
const boundaryTypes = [
    {name: 'Constant Head', type: 'chd'},
    {name: 'General Head', type: 'ghb'},
    {name: 'River Boundaries', type: 'riv'},
    {name: 'Recharge Boundaries', type: 'rch'},
    {name: 'Wells', type: 'wel'},
];

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

    handleClickType = (e, titleProps) => {
        const {index} = titleProps;
        const {id, property} = this.props.match.params;
        this.props.history.push(`${baseUrl}/${id}/${property}/${index}`);
    };

    handleClickBoundary = (bid) => {
        const {id, property, type} = this.props.match.params;
        this.props.history.push(`${baseUrl}/${id}/${property}/${type || '!'}/${bid}`);
    };

    boundaryList = (type) => {
        const {pid} = this.props.match.params;
        let selectedBoundaries = [];

        if (!type) {
            selectedBoundaries = this.state.boundaries;
        }

        if (['chd', 'ghb', 'rch', 'riv', 'wel'].indexOf(type) > -1) {
            selectedBoundaries = this.state.boundaries.filter(b => b.type === type)
        }

        return selectedBoundaries.map(b => (
            <List.Item
                key={b.id}
                onClick={() => this.handleClickBoundary(b.id)}
                active={pid === b.id}
            >
                {b.name}
            </List.Item>
        ));
    };

    menu = (type) => {
        return (
            <Accordion as={Menu} vertical style={{width: '100%'}}>
                {boundaryTypes.map(b => (
                    <Menu.Item key={b.type}>
                        <Accordion.Title
                            active={type === b.type}
                            content={b.name}
                            index={b.type}
                            onClick={this.handleClickType}
                        />
                        <Accordion.Content active={type === b.type} content={this.boundaryList(b.type)}/>
                    </Menu.Item>
                ))}
            </Accordion>
        )
    };

    render() {
        if (this.state.isLoading) {
            return (<Segment color={'grey'} loading/>)
        }

        return (
            <Segment color={'grey'} loading={this.state.isLoading}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            {this.menu(this.props.match.params.type)}
                        </Grid.Column>
                        <Grid.Column width={12}>
                            BoundaryList or BoundaryDetails
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
