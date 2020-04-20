import React, {ChangeEvent} from 'react';
import {Button, Form, Modal} from 'semantic-ui-react';
import {ModflowModel} from '../../../../../core/model/modflow';
import {Boundary, LineBoundary, ObservationPoint} from '../../../../../core/model/modflow/boundaries';
import {IObservationPoint} from '../../../../../core/model/modflow/boundaries/ObservationPoint.type';
import ObservationPointMap from '../../maps/observationPointEditorMap';

interface IProps {
    model: ModflowModel;
    boundary: LineBoundary;
    observationPointId?: string;
    onCancel: () => any;
    onChange: (boundary: Boundary) => any;
    readOnly: boolean;
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
        if (!observationPointId) {
            return null;
        }

        const observationPoint = boundary.findObservationPointById(observationPointId);
        if (observationPoint) {
            return this.setState({observationPoint: observationPoint.toObject()});
        }
    }

    public componentWillReceiveProps(nextProps: IProps) {
        const {boundary, observationPointId} = nextProps;
        if (!observationPointId) {
            return null;
        }

        const observationPoint = boundary.findObservationPointById(observationPointId);
        if (observationPoint) {
            return this.setState({observationPoint: observationPoint.toObject()});
        }
    }

    public handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!this.state.observationPoint) {
            return;
        }
        const observationPoint: ObservationPoint = ObservationPoint.fromObject(this.state.observationPoint);

        const {name, value} = e.target;

        if (name === 'name') {
            observationPoint[name] = value;
        }

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
                        </Form.Group>
                        <Form.Group>
                            <Form.Field>
                                <Form.Input label="Latitude" readOnly={true} value={latitude} />
                            </Form.Field>
                            <Form.Field>
                                <Form.Input label="Longitude" readOnly={true} value={longitude} />
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
        boundary.recalculateCellValues(this.props.model.boundingBox, this.props.model.gridSize);
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
