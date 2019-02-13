import React from 'react';
import PropTypes from 'prop-types';

import {Button, Form, Modal} from 'semantic-ui-react';

import ObservationPointMap from '../../maps/observationPointEditorMap';
import {ModflowModel, MultipleOPBoundary} from 'core/model/modflow';

class ObservationPointEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            observationPoint: null
        };
    }

    componentWillMount() {
        const {boundary, observationPointId} = this.props;
        if (!(boundary instanceof MultipleOPBoundary)) {
            return null;
        }

        let observationPoint = boundary.getObservationPointById(observationPointId);
        if (observationPoint) {
            return this.setState({observationPoint});
        }
    }

    componentWillReceiveProps(nextProps) {
        const {boundary, observationPointId} = nextProps;
        if (!(boundary instanceof MultipleOPBoundary)) {
            return null;
        }

        let observationPoint = boundary.getObservationPointById(observationPointId);
        if (observationPoint) {
            return this.setState({observationPoint});
        }
    }

    handleChange = e => {
        const observationPoint = {...this.state.observationPoint, [e.target.name]: e.target.value};
        this.handleChangeObservationPoint(observationPoint);
    };

    handleChangeObservationPoint = observationPoint => {
        this.setState({observationPoint});
    };

    handleApply = observationPoint => {
        const {boundary} = this.props;
        boundary.updateObservationPoint(observationPoint);
        this.props.onChange(boundary);
    };

    isValid = observationPoint => (!!observationPoint.geometry);

    render() {
        const {boundary, model, onCancel} = this.props;
        const {observationPoint} = this.state;

        if (!observationPoint) {
            return null;
        }

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
    boundary: PropTypes.instanceOf(MultipleOPBoundary).isRequired,
    observationPointId: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default ObservationPointEditor;
