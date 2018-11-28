import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {fetchUrl} from 'services/api';
import {Dropdown, Grid, Menu, Segment} from 'semantic-ui-react';
import ToolMetaData from '../../../shared/simpleTools/ToolMetaData';
import {includes} from 'lodash';

const baseUrl = '/tools/T03';

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
            public: null,
            permissions: null,
            boundaries: [],
            isLoading: true,
            isDirty: false,
            error: false,
            selectedType: null
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
                public: model.public,
                permissions: model.permissions,
                stressPeriods: model.stress_periods,
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

    save = () => {
    };

    metaData = () => ({
        type: 'T03',
        name: this.state.name,
        description: this.state.description,
        public: this.state.public
    });

    onChangeMetaData = (metaData) => {
        this.setState({
            name: metaData.name,
            description: metaData.description,
            public: metaData.public,
            isDirty: true
        })
    };

    handleClickBoundary = (bid) => {
        const {id, property, type} = this.props.match.params;
        this.props.history.push(`${baseUrl}/${id}/${property}/${type || '!'}/${bid}`);
    };

    list = (type) => {
        let selectedBoundaries = this.state.boundaries;
        if (type) {
            selectedBoundaries = this.state.boundaries.filter(b => b.type === type);
        }

        return (
            <Menu fluid vertical tabular>
                {selectedBoundaries.map(b => (
                    <Menu.Item
                        name={b.name}
                        key={b.id}
                        active={b.id === this.props.match.params.pid}
                        onClick={() => this.handleClickBoundary(b.id)}
                    />
                ))}
            </Menu>
        )
    };

    render() {
        if (this.state.isLoading) {
            return (<Segment color={'grey'} loading/>)
        }

        const {isDirty, selectedType} = this.state;
        const readOnly = !includes(this.state.permissions, 'w');

        return (
            <div>
                <ToolMetaData
                    isDirty={isDirty}
                    onChange={this.onChangeMetaData}
                    onSave={this.save}
                    readOnly={readOnly}
                    tool={this.metaData()}
                />
                <Segment color={'grey'} loading={this.state.isLoading}>
                    <Grid padded>
                        <Grid.Row>
                            <Grid.Column width={4}>
                                <Dropdown selection options={[{ key: 'AL', value: 'AL', text: 'Alabama' }]}/>
                                <Dropdown selection search options={[{ key: 'AL', value: 'AL', text: 'Alabama' }]}/>
                                {this.list(selectedType)}
                            </Grid.Column>
                            <Grid.Column width={12}>
                                BoundaryList or BoundaryDetails
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
};

export default withRouter(Boundaries);
