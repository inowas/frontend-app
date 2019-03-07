import React from 'react';
import PropTypes from 'prop-types';

import {Button, Form, Modal} from 'semantic-ui-react';

import ObservationPointMap from '../../maps/observationPointEditorMap';
import {ModflowModel, LineBoundary} from 'core/model/modflow';
import ObservationPoint from '../../../../../core/model/modflow/boundaries/ObservationPoint';

class ObservationPointEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            observationPoint: null
        };
    }

    componentWillMount() {
        const {boundary, observationPointId} = this.props;
        if (!(boundary instanceof LineBoundary)) {
            return null;
        }

        let observationPoint = boundary.findObservationPointById(observationPointId);
        if (observationPoint) {
            return this.setState({observationPoint});
        }
    }

    componentWillReceiveProps(nextProps) {
        const {boundary, observationPointId} = nextProps;
        if (!(boundary instanceof LineBoundary)) {
            return null;
        }

        let observationPoint = boundary.findObservationPointById(observationPointId);
        if (observationPoint) {
            return this.setState({observationPoint});
        }
    }

    handleChange = e => {
        const observationPoint = ObservationPoint.fromObject(this.state.observationPoint);
        observationPoint[e.target.name] = e.target.value;
        this.setState({
            observationPoint: observationPoint.toObject()
        });
    };

    handleChangeObservationPoint = observationPoint => {
        this.setState({
            observationPoint: observationPoint.toObject()
        });
    };

    handleApply = op => {
        const {boundary} = this.props;
        boundary.updateObservationPoint(op.id, op.name, op.geometry, op.spValues);
        this.props.onChange(boundary);
    };

    isValid = observationPoint => (!!observationPoint.geometry);

    render() {
        const {boundary, model, onCancel} = this.props;

        if (!this.state.observationPoint) {
            return null;
        }

        const observationPoint = ObservationPoint.fromObject(this.state.observationPoint);
        const {geometry} = observationPoint;
        const latitude = geometry ? geometry.coordinates[1] : '';
        const longitude = geometry ? geometry.coordinates[0] : '';

        return (
            <Modal size={'large'} open dimmer={'inverted'}>
                <Modal.Header>Add observation point</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Group>
                            <Form.Input label='Name'
                                        placeholder="Observation point name"
                                        value={observationPoint.name}
                                        onChange={this.handleChange}
                                        name={'name'}
                                        width={10}
                            />
                            <Form.Field>
                                <label>Latitude</label>
                                <input readOnly value={latitude} width={3}/>
                            </Form.Field>
                            <Form.Field>
                                <label>Longitude</label>
                                <input readOnly value={longitude} width={3}/>
                            </Form.Field>
                        </Form.Group>
                    </Form>
                    <ObservationPointMap
                        area={model.geometry}
                        boundary={boundary}
                        observationPoint={observationPoint}
                        onChange={this.handleChangeObservationPoint}
                    />

                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.props.onCancel}>Cancel</Button>
                    <Button
                        positive
                        onClick={() => {
                            this.handleApply(observationPoint);
                            onCancel()
                        }}
                        disabled={!this.isValid(observationPoint)}
                    >
                        Apply
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

ObservationPointEditor.propTypes = {
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    boundary: PropTypes.instanceOf(LineBoundary).isRequired,
    observationPointId: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default ObservationPointEditor;
