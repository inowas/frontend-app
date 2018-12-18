import React from 'react';
import PropTypes from 'prop-types';
import {Button, Divider, Dropdown, Form, Grid, Header, Icon, List} from 'semantic-ui-react';

import BoundaryMap from '../../maps/boundaryMap';
import {Boundary, ModflowModel, MultipleOPBoundary, Soilmodel} from 'core/model/modflow';
import BoundaryValuesDataTable from './boundaryValuesDataTable';
import BoundaryGeometryEditor from './boundaryGeometryEditor';
import ObservationPointEditor from './observationPointEditor';

class BoundaryDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showBoundaryEditor: false,
            showObservationPointEditor: false,
            observationPointId: null
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.boundary) {
            return;
        }

        if ((nextProps.boundary instanceof MultipleOPBoundary) && !this.state.observationPointId) {
            return this.setState({
                observationPointId: nextProps.boundary.observationPoints[0].id
            })
        }
    }

    handleChange = (e, {name, value}) => {
        const boundary = this.props.boundary;
        boundary[name] = value;
        this.props.onChange(boundary);
    };

    layerOptions = () => {
        if (!(this.props.soilmodel instanceof Soilmodel)) {
            return [];
        }

        return this.props.soilmodel.layersCollection.all.map(l => (
            {key: l.id, value: l.number, text: l.name}
        ))
    };

    render() {
        const {boundary, model} = this.props;
        const {geometry, stressperiods} = model;
        const {observationPointId} = this.state;

        if (!boundary || !geometry) {
            return null;
        }

        return (
            <div>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={6}>
                            <Header as={'h3'}>Properties</Header>
                            <Divider/>
                            <Form>
                                <Form.Input
                                    label={'Name'}
                                    name={'name'}
                                    value={boundary.name}
                                    onChange={this.handleChange}
                                />

                                <Form.Dropdown
                                    loading={!(this.props.soilmodel instanceof Soilmodel)}
                                    label={'Selected layers'}
                                    style={{zIndex: 1000}}
                                    selection
                                    fluid
                                    options={this.layerOptions()}
                                    value={boundary.affectedLayers[0]}
                                    name={'affectedLayers'}
                                    onChange={this.handleChange}
                                />

                                {boundary.subTypes &&
                                <Form.Dropdown
                                    label={boundary.subTypes.name}
                                    style={{zIndex: 1000}}
                                    selection
                                    fluid
                                    options={boundary.subTypes.types.map(t => (
                                        {key: t.value, value: t.value, text: t.name}
                                    ))}
                                    value={boundary.subType}
                                    name={'subType'}
                                    onChange={this.handleChange}
                                />
                                }
                            </Form>
                            <List horizontal style={{marginTop: '20px'}}>
                                <List.Item
                                    as='a'
                                    onClick={() => this.setState({showBoundaryEditor: true})}
                                >Edit on map</List.Item>
                            </List>
                            <BoundaryMap
                                geometry={geometry}
                                boundary={boundary}
                                selectedObservationPointId={observationPointId}
                            />
                        </Grid.Column>
                        <Grid.Column width={10}>
                            {(boundary instanceof MultipleOPBoundary) &&
                            <div>
                                <Header as={'h3'}>Observation Points</Header>
                                <Divider/>
                                <Button as={'div'} labelPosition={'left'} fluid>
                                    <Dropdown
                                        fluid
                                        selection
                                        value={this.state.observationPointId}
                                        options={boundary.observationPoints.map(op => (
                                            {key: op.id, value: op.id, text: op.name})
                                        )}
                                        onChange={(e, {value}) => this.setState({observationPointId: value})}
                                    />
                                    <Button icon><Icon name='edit'/></Button>
                                    <Button icon><Icon name='add'/></Button>
                                    <Button icon><Icon name='trash'/></Button>
                                </Button>
                            </div>
                            }
                            <BoundaryValuesDataTable
                                boundary={boundary}
                                onChange={this.props.onChange}
                                stressperiods={stressperiods}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                {this.state.showBoundaryEditor &&
                <BoundaryGeometryEditor
                    boundary={boundary}
                    model={model}
                    onCancel={() => this.setState({showBoundaryEditor: false})}
                    onChange={this.props.onChange}
                    readOnly={this.props.readOnly}
                />
                }
                {this.state.showObservationPointEditor &&
                <ObservationPointEditor
                    boundary={boundary}
                    model={model}
                    observationPointId={this.state.observationPointId}
                    onCancel={() => this.setState({showObservationPointEditor: false})}
                    onChange={this.props.onChange}
                    readOnly={this.props.readOnly}
                />
                }
            </div>
        )
    }
}

BoundaryDetails.proptypes = {
    boundary: PropTypes.instanceOf(Boundary).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    soilmodel: PropTypes.instanceOf(Soilmodel).isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired
};

export default BoundaryDetails;
