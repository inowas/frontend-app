import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import {Button, Grid, Form, Header, Modal, Segment} from 'semantic-ui-react';
import ObservationPointMap from '../../maps/observationPointEditorMap';
import {cloneDeep, first} from 'lodash';

class ObservationPointEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            observationPoint: null
        };
    }

    componentWillMount() {
        const {boundary, observationPointId} = this.props;
        if (boundary.hasObservationPoint(observationPointId)) {
            const observationPoint = boundary.observation_points.filter(op => (op.id === observationPointId))[0];
            return this.setState({observationPoint: observationPoint});
        }

        const newObservationPoint = cloneDeep(boundary.observation_points[0]);
        newObservationPoint.id = uuid.v4();
        newObservationPoint.name = 'New observation point';
        newObservationPoint.geometry.coordinates = null;
        newObservationPoint.date_time_values = [first(newObservationPoint.date_time_values)];

        return this.setState({observationPoint: newObservationPoint});
    }

    boundaryContainsObservationPoint = (boundary, opId) => {
        return boundary.observation_points.filter(op => op.id === opId).length > 0;
    };

    handleChangeName = e => {
        this.setState({
            observationPoint: {...this.state.observationPoint, name: e.target.value}
        });
    };

    handleChangeCoordinates = latLng => {
        const coordinates = [
            latLng.lng,
            latLng.lat
        ];

        this.setState({
            observationPoint: {
                ...this.state.observationPoint,
                geometry: {...this.state.observationPoint.geometry, coordinates}
            }
        });
    };

    isValid = observationPoint => {
        const { geometry } = observationPoint;
        return (geometry.coordinates && !isNaN(geometry.coordinates[0]) && !isNaN(geometry.coordinates[1]));
    };

    render() {
        const {area, boundary, onCancel, onSave, mapStyles} = this.props;
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
                                            <input placeholder="Observation point name" value={observationPoint.name}
                                                   onChange={this.handleChangeName}/>
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
                                        area={area}
                                        boundary={boundary}
                                        mapStyles={mapStyles}
                                        observationPoint={observationPoint}
                                        onChange={this.handleChangeCoordinates}
                                    />
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={onCancel}>Cancel</Button>
                    <Button positive onClick={() => onSave(observationPoint)} disabled={!this.isValid(observationPoint)}>Save</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

ObservationPointEditor.propTypes = {
    area: PropTypes.object.isRequired,
    boundary: PropTypes.object.isRequired,
    observationPointId: PropTypes.string,
    mapStyles: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default ObservationPointEditor;
