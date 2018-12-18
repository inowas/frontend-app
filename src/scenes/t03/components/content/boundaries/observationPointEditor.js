import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import {cloneDeep, first} from 'lodash';

import {Button, Grid, Form, Header, Modal, Segment} from 'semantic-ui-react';

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

        observationPoint = cloneDeep(boundary.observation_points[0]);
        observationPoint.id = uuid.v4();
        observationPoint.name = 'New observation point';
        observationPoint.geometry = null;
        observationPoint.date_time_values = [first(observationPoint.date_time_values)];

        return this.setState({observationPoint});
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
        const {geometry} = observationPoint;
        const latitude = geometry.coordinates ? geometry.coordinates[1] : '';
        const longitude = geometry.coordinates ? geometry.coordinates[0] : '';

        return (
            <Modal size={'large'} open onClose={onCancel}>
                <Modal.Header>Add observation point</Modal.Header>
                <Modal.Content>
                    <Grid divided={'vertically'}>
                        <Grid.Row columns={2}>
                            <Grid.Column width={6}>
                                <Segment color="blue">
                                    <Header as="h3" dividing>Observation point properties</Header>
                                    <Form>
                                        <Form.Field>
                                            <label>Name</label>
                                            <input
                                                placeholder="Observation point name"
                                                value={observationPoint.name}
                                                onChange={this.handleChange}
                                                name={'name'}
                                            />
                                        </Form.Field>
                                        <Form.Group widths="equal">
                                            <Form.Field>
                                                <label>Latitude</label>
                                                <input disabled placeholder="Latitude" value={latitude}/>
                                            </Form.Field>
                                            <Form.Field>
                                                <label>Longitude</label>
                                                <input disabled placeholder="Longitude" value={longitude}/>
                                            </Form.Field>
                                        </Form.Group>
                                    </Form>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <Segment color="blue">
                                    <ObservationPointMap
                                        area={model.geometry}
                                        boundary={boundary}
                                        observationPoint={observationPoint}
                                        onChange={this.handleChangeObservationPoint}
                                    />
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        negative
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
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
