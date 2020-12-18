import {BoundaryCollection} from '../../../core/model/modflow/boundaries';
import {FluxDataTable, SubstanceEditor} from '../components/content/optimization/shared';
import {Form, Grid, Icon, Segment} from 'semantic-ui-react';
import {ModflowModel} from '../../../core/model/modflow';
import {Optimization, OptimizationObject} from '../../../core/model/modflow/optimization';
import {clear, updateBoundaries, updateModel, updateOptimization} from '../actions/actions';
import {connect} from 'react-redux';
import {fetchUrl} from '../../../services/api';
import {getActiveCellFromCoordinate} from '../../../services/geoTools';
import {withRouter} from 'react-router-dom';
import AppContainer from '../../shared/AppContainer';
import OptimizationMap from '../components/maps/optimizationMap';
import PropTypes from 'prop-types';
import React from 'react';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.hydro.tu-dresden.de/tools/t02-groundwater-mounding-hantush/',
    icon: <Icon name="file"/>
}];

class CreateOptimizationObject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            object: new OptimizationObject()
        }
    }

    componentDidMount() {
        const {id} = this.props.match.params;

        return this.setState({isLoading: true},
            () => this.fetchModel(id)
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        const {id} = nextProps.match.params;
        if (!this.props.model || this.props.model.id !== id) {
            if (!this.state.isLoading) {
                return this.setState({isLoading: true},
                    () => this.fetchModel(id)
                )
            }
        }
    }

    fetchModel(id) {
        if (this.props.model && this.props.model.id !== id) {
            this.props.clear();
        }
        fetchUrl(
            `modflowmodels/${id}`,
            data => {
                this.props.updateModel(ModflowModel.fromQuery(data));
                this.setState({isLoading: false}, () => {
                    this.fetchBoundaries(id);
                    this.fetchOptimization(id);
                });
            },
            error => this.setState(
                {error, isLoading: false},
                () => this.handleError(error)
            )
        );
    }

    fetchBoundaries(id) {
        fetchUrl(`modflowmodels/${id}/boundaries`,
            data => this.props.updateBoundaries(this.props.model, BoundaryCollection.fromQuery(data)),
            error => this.setState(
                {error, isLoading: false},
                () => this.handleError(error)
            )
        );
    }

    fetchOptimization(id) {
        fetchUrl(`modflowmodels/${id}/optimization`,
            data => this.props.updateOptimization(Optimization.fromQuery(data)),
            error => this.setState(
                {error, isLoading: false},
                () => this.handleError(error)
            )
        );
    }

    handleError = error => {
        const {response} = error;
        const {status} = response;

        if (status === 422) {
            this.props.history.push('/tools');
        }
    };

    onLocalChange = (e, {name, value}) => {
        const object = this.state.object;
        object[name] = value;
        this.setState({
            object: object
        });
    };

    onEditPath = e => {
        const layers = e.layers;

        layers.eachLayer(layer => {
            const geoJson = layer.toGeoJSON();
            const geometry = geoJson.geometry;

            // Latitude (S/N)
            let ymin = 90;
            let ymax = -90;
            // Longitude (E/W)
            let xmin = 180;
            let xmax = -180;

            geometry.coordinates[0].forEach(c => {
                if (c[0] <= xmin) {
                    xmin = c[0];
                }
                if (c[0] >= xmax) {
                    xmax = c[0];
                }
                if (c[1] <= ymin) {
                    ymin = c[1];
                }
                if (c[1] >= ymax) {
                    ymax = c[1];
                }
            });

            const cmin = getActiveCellFromCoordinate([xmin, ymax], this.props.model.boundingBox, this.props.model.gridSize);
            const cmax = getActiveCellFromCoordinate([xmax, ymin], this.props.model.boundingBox, this.props.model.gridSize);

            const p = {
                row: {
                    min: cmin[1],
                    max: cmax[1]
                },
                col: {
                    min: cmin[0],
                    max: cmax[0]
                }
            };

            const object = this.state.object;
            object.position.row = p.row;
            object.position.col = p.col;

            return this.setState({
                object: object
            });
        });
    };

    render() {
        const {isLoading, object} = this.state;

        if (!this.props.model) {
            return (
                <AppContainer navbarItems={navigation}>
                    <Segment color='grey' loading={isLoading}>
                        Please Wait
                    </Segment>
                </AppContainer>
            );
        }

        const {model} = this.props;
        const substances = [];

        const typeOptions = [
            {key: 'type1', text: 'Well', value: 'wel'},
        ];

        const fluxConfig = [
            {property: 'min', label: 'Min'},
            {property: 'max', label: 'Max'}
        ];

        let fluxRows = null;

        if (object) {
            fluxRows = model.stressperiods.dateTimes.map((dt, key) => {
                return {
                    id: key,
                    date_time: dt,
                    min: object.flux[key] ? object.flux[key].min : 0,
                    max: object.flux[key] ? object.flux[key].max : 0
                };
            });
        }

        return (
            <AppContainer navbarItems={navigation}>
                <Segment color={'grey'}>
                    <Grid padded>
                        <Grid.Row>
                            <Grid.Column>
                                <Form>
                                    <Form.Group widths="equal">
                                        <Form.Field>
                                            <label>Type</label>
                                            <Form.Select
                                                name="type"
                                                value={object.type}
                                                placeholder="type ="
                                                options={typeOptions}
                                                onChange={this.onLocalChange}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Name</label>
                                            <Form.Input
                                                type="text"
                                                name="name"
                                                value={object.name}
                                                placeholder="name ="
                                                onChange={this.onLocalChange}
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <OptimizationMap
                                model={this.props.model}
                                object={this.state.object}
                                onEditPath={this.onEditPath}
                                readOnly={this.props.model.readOnly}
                            />
                        </Grid.Row>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <FluxDataTable
                                    config={fluxConfig}
                                    readOnly={false}
                                    rows={fluxRows}
                                    onChange={this.handleChangeFlux}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <SubstanceEditor
                                    object={OptimizationObject.fromObject(object)}
                                    stressPeriods={model.stressPeriods}
                                    substances={substances || []}
                                    onChange={this.handleChangeSubstances}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </AppContainer>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        boundaries: state.T03.boundaries && BoundaryCollection.fromObject(state.T03.boundaries),
        model: state.T03.model && ModflowModel.fromObject(state.T03.model),
        optimization: state.T03.optimization && Optimization.fromObject(state.T03.optimization)
    };
};

const mapDispatchToProps = {
    clear, updateBoundaries, updateOptimization, updateModel
};

CreateOptimizationObject.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    optimization: PropTypes.instanceOf(Optimization).isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateOptimizationObject));
