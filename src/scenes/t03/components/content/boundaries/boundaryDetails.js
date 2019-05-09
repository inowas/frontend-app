import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import {Button, Dropdown, Form, Header, List, Popup} from 'semantic-ui-react';

import BoundaryMap from '../../maps/boundaryMap';
import {Boundary, BoundaryCollection, LineBoundary, ModflowModel, Soilmodel} from 'core/model/modflow';
import BoundaryValuesDataTable from './boundaryValuesDataTable';
import BoundaryGeometryEditor from './boundaryGeometryEditor';
import ObservationPointEditor from './observationPointEditor';
import NoContent from '../../../../shared/complexTools/noContent';

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

        if (nextProps.boundary instanceof LineBoundary) {
            if (null === this.state.observationPointId) {
                return this.setState({
                    observationPointId: nextProps.boundary.observationPoints[0].id
                })
            }

            try {
                nextProps.boundary.findObservationPointById(this.state.observationPointId);
            } catch (err) {
                return this.setState({
                    observationPointId: nextProps.boundary.observationPoints[0].id
                })
            }
        }
    }

    handleChange = (e, {name, value}) => {
        if (name === 'layers' && typeof value === 'number') {
            value = [value]
        }

        const boundary = this.props.boundary;
        boundary[name] = value;
        this.props.onChange(boundary);
    };

    handleCloneClick = () => {
        const boundary = this.props.boundary;
        const newOpId = uuid.v4();
        boundary.cloneObservationPoint(this.state.observationPointId, newOpId);
        this.setState({
            observationPointId: newOpId,
            showObservationPointEditor: true
        });
        this.props.onChange(boundary);
    };

    handleRemoveClick = () => {
        const boundary = this.props.boundary;
        boundary.removeObservationPoint(this.state.observationPointId);
        this.setState({
            observationPointId: boundary.observationPoints[0].id
        });
        this.props.onChange(boundary);
    };

    layerOptions = () => {
        if (!(this.props.soilmodel instanceof Soilmodel)) {
            return [];
        }

        return this.props.soilmodel.layersCollection.all.map((l, idx) => (
            {key: l.id, value: idx, text: l.name}
        ))
    };

    render() {
        const {boundary, boundaries, model} = this.props;
        const {geometry, stressperiods} = model;
        const {observationPointId} = this.state;

        if (!boundary || !geometry) {
            return <NoContent message={'No boundaries.'}/>;
        }

        const multipleLayers = ['chd', 'ghb'].includes(boundary.type);

        return (
            <div>
                <Form>
                    <Form.Group widths='equal'>
                        <Form.Input
                            value={boundary.type.toUpperCase()}
                            label='Type'
                            readOnly
                            width={5}
                        />

                        <Form.Input
                            label={'Name'}
                            name={'name'}
                            value={boundary.name}
                            onChange={this.handleChange}
                        />

                        <Form.Select
                            disabled={['rch', 'riv'].includes(boundary.type)}
                            loading={!(this.props.soilmodel instanceof Soilmodel)}
                            label={'Selected layers'}
                            style={{zIndex: 1000}}
                            multiple={multipleLayers}
                            selection
                            options={this.layerOptions()}
                            value={multipleLayers ? boundary.layers : boundary.layers[0]}
                            name={'layers'}
                            onChange={this.handleChange}
                        />

                        {boundary.type === 'wel' &&
                        <Form.Dropdown
                            label={'Well type'}
                            style={{zIndex: 1000}}
                            selection
                            options={boundary.wellTypes.types.map(t => (
                                {key: t.value, value: t.value, text: t.name}
                            ))}
                            value={boundary.wellType}
                            name={'wellType'}
                            onChange={this.handleChange}
                        />
                        }
                    </Form.Group>
                </Form>

                <List horizontal>
                    <List.Item
                        as='a'
                        onClick={() => this.setState({showBoundaryEditor: true})}
                    >Edit boundary on map</List.Item>
                </List>
                <BoundaryMap
                    geometry={geometry}
                    boundary={boundary}
                    boundaries={boundaries}
                    selectedObservationPointId={observationPointId}
                    onClick={this.props.onClick}
                />
                {(boundary instanceof LineBoundary) &&
                <div>
                    <Button as={'div'} labelPosition={'left'} fluid>
                        <Popup trigger={
                            <Dropdown
                                fluid
                                selection
                                value={this.state.observationPointId}
                                options={boundary.observationPoints.map(op => (
                                    {key: op.id, value: op.id, text: op.name})
                                )}
                                onChange={(e, {value}) => this.setState({observationPointId: value})}
                            />
                        }
                               size='mini'
                               content='Select Observation Point'/>
                        <Popup trigger={
                            <Button icon={'edit'}
                                    onClick={() => this.setState({showObservationPointEditor: true})}
                            />
                        }
                               size='mini'
                               content='Edit point'/>
                        <Popup trigger={
                            <Button icon={'clone'}
                                    onClick={this.handleCloneClick}/>
                        }
                               size='mini'
                               content='Clone point'/>
                        <Popup trigger={
                            <Button icon='trash'
                                    onClick={this.handleRemoveClick}
                                    disabled={this.props.boundary.observationPoints.length === 1}
                            />
                        }
                               size='mini'
                               content='Delete point'/>
                    </Button>
                </div>
                }
                <Header as={'h4'}>Time dependent boundary values at observation point</Header>
                <BoundaryValuesDataTable
                    boundary={boundary}
                    boundaries={boundaries}
                    onChange={this.props.onChange}
                    readOnly={this.props.readOnly}
                    selectedOP={observationPointId}
                    stressperiods={stressperiods}
                />

                {this.state.showBoundaryEditor &&
                <BoundaryGeometryEditor
                    boundary={boundary}
                    boundaries={boundaries}
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

BoundaryDetails.propTypes = {
    boundary: PropTypes.instanceOf(Boundary).isRequired,
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    soilmodel: PropTypes.instanceOf(Soilmodel).isRequired,
    onChange: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,


};

export default BoundaryDetails;
