import React, {ChangeEvent} from 'react';
import {Button, Form, Modal} from 'semantic-ui-react';
import {LineBoundary, ModflowModel} from '../../../../../core/model/modflow';
import Boundary from '../../../../../core/model/modflow/boundaries/Boundary';
import ObservationPoint from '../../../../../core/model/modflow/boundaries/ObservationPoint';
import {IObservationPoint} from '../../../../../core/model/modflow/boundaries/ObservationPoint.type';
import ObservationPointMap from '../../maps/observationPointEditorMap';

interface IProps {
    model: ModflowModel;
    boundary: LineBoundary;
    observationPointId?: string;
    onCancel: () => any;
    onChange: (boundary: Boundary) => any;
}

interface IState {
    observationPoint: IObservationPoint | null;
}

class ObservationPointEditor extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            observationPoint: null
        };
    }

    public componentWillMount() {
        const {boundary, observationPointId} = this.props;
        if (!observationPointId || !(boundary instanceof LineBoundary)) {
            return null;
        }

        const observationPoint = boundary.findObservationPointById(observationPointId);
        if (observationPoint) {
            return this.setState({observationPoint});
        }
    }

    public componentWillReceiveProps(nextProps: IProps) {
        const {boundary, observationPointId} = nextProps;
        if (!observationPointId || !(boundary instanceof LineBoundary)) {
            return null;
        }

        const observationPoint = boundary.findObservationPointById(observationPointId);
        if (observationPoint) {
            return this.setState({observationPoint});
        }
    }

    public handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!this.state.observationPoint) {
            return;
        }
        const observationPoint = ObservationPoint.fromObject(this.state.observationPoint);
        observationPoint[e.target.name] = e.target.value;
        this.setState({
            observationPoint: observationPoint.toObject()
        });
    };

    public handleChangeObservationPoint = (observationPoint: ObservationPoint) => {
        this.setState({
            observationPoint: observationPoint.toObject()
        });
    };

    public isValid = (observationPoint: ObservationPoint) => (!!observationPoint.geometry);

    public render() {
        const {boundary, model} = this.props;

        if (!this.state.observationPoint) {
            return null;
        }

        const observationPoint = ObservationPoint.fromObject(this.state.observationPoint);
        const {geometry} = observationPoint;
        const latitude = geometry ? geometry.coordinates[1] : '';
        const longitude = geometry ? geometry.coordinates[0] : '';

        return (
            <Modal size={'large'} open={true} dimmer={'inverted'}>
                <Modal.Header>Add observation point</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Group>
                            <Form.Input
                                label="Name"
                                placeholder="Observation point name"
                                value={observationPoint.name}
                                onChange={this.handleChange}
                                name={'name'}
                                width={10}
                            />
                            <Form.Field>
                                <label>Latitude</label>
                                <input readOnly={true} value={latitude} width={3}/>
                            </Form.Field>
                            <Form.Field>
                                <label>Longitude</label>
                                <input readOnly={true} value={longitude} width={3}/>
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
                        positive={true}
                        onClick={this.handleClickApply}
                        disabled={!this.isValid(observationPoint)}
                    >
                        Apply
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }

    private handleApply = (op: ObservationPoint) => {
        const {boundary} = this.props;
        boundary.updateObservationPoint(op.id, op.name, op.geometry, op.spValues);
        this.props.onChange(boundary);
    };

    private handleClickApply = () => {
        if (this.state.observationPoint !== null) {
            const observationPoint = ObservationPoint.fromObject(this.state.observationPoint);
            this.handleApply(observationPoint);
        }
        return this.props.onCancel();
    };
}

export default ObservationPointEditor;
