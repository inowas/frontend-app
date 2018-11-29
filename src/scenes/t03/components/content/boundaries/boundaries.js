import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {fetchUrl} from 'services/api';
import {Grid, Segment} from 'semantic-ui-react';
import ToolMetaData from 'scenes/shared/simpleTools/ToolMetaData';
import {includes} from 'lodash';
import BoundaryList from './boundaryList';
import BoundaryFactory from 'core/model/modflow/boundaries/BoundaryFactory';
import BoundaryDetails from './boundaryDetails';
import {Geometry} from 'core/model/modflow';

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
            boundaries => this.setState({
                boundaries: boundaries.map(b => BoundaryFactory.fromObjectData(b))
            }),
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

    render() {
        const {isDirty} = this.state;
        const {pid} = this.props.match.params;
        const readOnly = !includes(this.state.permissions, 'w');

        const boundary = this.state.boundaries.filter(b=>b.id === pid)[0];
        const geometry = Geometry.fromObject(this.state.geometry);

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
                                {!this.state.isLoading && <BoundaryDetails boundary={boundary} geometry={geometry}/>}
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
