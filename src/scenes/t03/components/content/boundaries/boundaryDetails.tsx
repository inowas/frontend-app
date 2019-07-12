import React, {ChangeEvent, SyntheticEvent} from 'react';
import {Button, Dropdown, DropdownProps, Form, Header, InputOnChangeData, List, Popup} from 'semantic-ui-react';
import uuid from 'uuid';
import {Boundary, BoundaryCollection, LineBoundary, ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {WellBoundary} from '../../../../../core/model/modflow/boundaries';
import NoContent from '../../../../shared/complexTools/noContent';
import BoundaryMap from '../../maps/boundaryMap';
import BoundaryGeometryEditor from './boundaryGeometryEditor';
import BoundaryValuesDataTable from './boundaryValuesDataTable';
import ObservationPointEditor from './observationPointEditor';

interface IProps {
    boundary: Boundary;
    boundaries: BoundaryCollection;
    model: ModflowModel;
    soilmodel: Soilmodel;
    onChange: (boundary: Boundary) => any;
    onClick: () => any;
    readOnly: boolean;
}

interface IState {
    showBoundaryEditor: boolean;
    showObservationPointEditor: boolean;
    observationPointId?: string;
}

class BoundaryDetails extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            showBoundaryEditor: false,
            showObservationPointEditor: false,
            observationPointId: props.boundary instanceof LineBoundary ?
                props.boundary.observationPoints[0].id : undefined
        };
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (!nextProps.boundary) {
            return;
        }

        if (nextProps.boundary instanceof LineBoundary) {
            if (null === this.state.observationPointId) {
                return this.setState({
                    observationPointId: nextProps.boundary.observationPoints[0].id
                });
            }

            try {
                nextProps.boundary.findObservationPointById(this.state.observationPointId || '');
            } catch (err) {
                return this.setState({
                    observationPointId: nextProps.boundary.observationPoints[0].id
                });
            }
        }
    }

    public handleChange = (e: SyntheticEvent<HTMLElement, Event> | ChangeEvent<HTMLInputElement>,
                           data: DropdownProps | InputOnChangeData) => {
        let value = data.value;
        const name = data.name;
        if (name === 'layers' && data.value && typeof data.value === 'number') {
            value = [data.value];
        }

        const boundary = this.props.boundary;
        boundary[name] = value;
        this.props.onChange(boundary);
    };

    public handleCloneClick = () => {
        if (this.props.boundary instanceof LineBoundary && this.state.observationPointId) {
            const boundary = this.props.boundary;
            const newOpId = uuid.v4();
            boundary.cloneObservationPoint(this.state.observationPointId, newOpId);
            this.setState({
                observationPointId: newOpId,
                showObservationPointEditor: true
            });
            this.props.onChange(boundary);
        }
    };

    public handleRemoveClick = () => {
        if (this.props.boundary instanceof LineBoundary && this.state.observationPointId) {
            const boundary = this.props.boundary;
            boundary.removeObservationPoint(this.state.observationPointId);
            this.setState({
                observationPointId: boundary.observationPoints[0].id
            });
            this.props.onChange(boundary);
        }
    };

    public layerOptions = () => {
        if (!(this.props.soilmodel instanceof Soilmodel)) {
            return [];
        }

        return this.props.soilmodel.layersCollection.all.map((l, idx) => (
            {key: l.id, value: idx, text: l.name}
        ));
    };

    public render() {
        const {boundary, boundaries, model} = this.props;
        const {geometry, stressperiods} = model;
        const {observationPointId} = this.state;

        if (!boundary || !geometry) {
            return <NoContent message={'No objects.'}/>;
        }

        const multipleLayers = ['chd', 'drn', 'evt', 'ghb'].includes(boundary.type);

        return (
            <div>
                <Form style={{marginTop: '1rem'}}>
                    <Form.Group widths="equal">
                        <Form.Input
                            value={boundary.type.toUpperCase()}
                            label="Type"
                            readOnly={true}
                            width={5}
                        />

                        <Form.Input
                            label={'Name'}
                            name={'name'}
                            value={boundary.name}
                            onChange={this.handleChange}
                            readOnly={this.props.readOnly}
                        />

                        <Form.Select
                            disabled={['rch', 'riv'].includes(boundary.type)}
                            loading={!(this.props.soilmodel instanceof Soilmodel)}
                            label={'Selected layers'}
                            style={{zIndex: 1000}}
                            multiple={multipleLayers}
                            selection={true}
                            options={this.layerOptions()}
                            value={multipleLayers ? boundary.layers : boundary.layers[0]}
                            name={'layers'}
                            onChange={this.handleChange}
                        />

                        {boundary.type === 'wel' && boundary instanceof WellBoundary &&
                        <Form.Dropdown
                            label={'Well type'}
                            style={{zIndex: 1000}}
                            selection={true}
                            options={WellBoundary.wellTypes.types.map((t) => (
                                {key: t.value, value: t.value, text: t.name}
                            ))}
                            value={boundary.wellType}
                            name={'wellType'}
                            onChange={this.handleChange}
                        />
                        }
                    </Form.Group>
                </Form>

                <List horizontal={true}>
                    <List.Item
                        as="a"
                        onClick={() => this.setState({showBoundaryEditor: true})}
                    >
                        Edit boundary on map
                    </List.Item>
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
                    <Button as={'div'} labelPosition={'left'} fluid={true}>
                        <Popup
                            trigger={
                                <Dropdown
                                    fluid={true}
                                    selection={true}
                                    value={this.state.observationPointId}
                                    options={boundary.observationPoints.map((op) => (
                                        {key: op.id, value: op.id, text: op.name})
                                    )}
                                    onChange={this.handleSelectObservationPoint}
                                />
                            }
                            size="mini"
                            content="Select Observation Point"
                        />
                        <Popup
                            trigger={
                                <Button
                                    icon={'edit'}
                                    onClick={this.handleEditPoint}
                                />
                            }
                            size="mini"
                            content="Edit point"
                        />
                        <Popup
                            trigger={
                                <Button
                                    icon={'clone'}
                                    onClick={this.handleCloneClick}
                                />
                            }
                            size="mini"
                            content="Clone point"
                        />
                        {boundary instanceof LineBoundary &&
                        <Popup
                            trigger={
                                <Button
                                    icon="trash"
                                    onClick={this.handleRemoveClick}
                                    disabled={boundary.observationPoints.length === 1}
                                />
                            }
                            size="mini"
                            content="Delete point"
                        />
                        }
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
        );
    }

    private handleEditPoint = () => this.setState({showObservationPointEditor: true});
    private handleSelectObservationPoint = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) =>
        this.setState({
            observationPointId: data.value
        });
}

export default BoundaryDetails;
