import React, {ChangeEvent, SyntheticEvent} from 'react';
import {Button, Dropdown, DropdownProps, Form, Header, InputOnChangeData, List, Popup} from 'semantic-ui-react';
import uuid from 'uuid';
import {ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {Boundary, BoundaryCollection, LineBoundary} from '../../../../../core/model/modflow/boundaries';
import {RechargeBoundary, WellBoundary} from '../../../../../core/model/modflow/boundaries';
import EvapotranspirationBoundary from '../../../../../core/model/modflow/boundaries/EvapotranspirationBoundary';
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
    onClick: (bid: string) => any;
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
        // @ts-ignore
        boundary[name] = value;
        return this.props.onChange(boundary);
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

    public renderLayerSelection = () => {
        const {boundary} = this.props;
        const multipleLayers = ['chd', 'ghb'].includes(boundary.type);

        let options = {enabled: false, label: '', name: ''};

        switch (boundary.type) {
            case 'rch':
                options = {enabled: true, label: 'Recharge option', name: 'nrchop'};
                break;
            case 'evt':
                options = {enabled: true, label: 'Evapotranspiration option', name: 'nevtop'};
                break;
            default:
                options = {enabled: false, label: '', name: ''};
                break;
        }

        if (!boundary.layers || ['riv'].includes(boundary.type)) {
            return null;
        }

        return (
            <React.Fragment>
                {(boundary instanceof RechargeBoundary || boundary instanceof EvapotranspirationBoundary) &&
                <Form.Dropdown
                    label={boundary.type === 'rch' ? 'Recharge option' : 'Evapotranspiration option'}
                    style={{zIndex: 1000}}
                    selection={true}
                    options={[
                        {key: 0, value: 1, text: '1: Top grid layer'},
                        {key: 1, value: 2, text: '2: Specified layer'},
                        {key: 2, value: 3, text: '3: Highest active cell'}
                    ]}
                    value={boundary.optionCode}
                    name={'optionCode'}
                    onChange={this.handleChange}
                />
                }
                <Form.Select
                    disabled={(boundary instanceof RechargeBoundary ||
                        boundary instanceof EvapotranspirationBoundary) && boundary.optionCode !== 2}
                    loading={!(this.props.soilmodel instanceof Soilmodel)}
                    label={multipleLayers ? 'Selected layers' : 'Selected layer'}
                    style={{zIndex: 1000}}
                    multiple={multipleLayers}
                    selection={true}
                    options={this.layerOptions()}
                    value={multipleLayers ? boundary.layers : boundary.layers[0]}
                    name={'layers'}
                    onChange={this.handleChange}
                />
            </React.Fragment>
        );
    };

    public render() {
        const {boundary, boundaries, model} = this.props;
        const {geometry, stressperiods} = model;
        const {observationPointId} = this.state;

        if (!boundary || !geometry) {
            return <NoContent message={'No objects.'}/>;
        }

        if (!boundary.layers || boundary.layers.length === 0) {
            return <NoContent message={'No layers.'}/>;
        }

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

                        {this.renderLayerSelection()}

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
                        onClick={this.handleClickShowBoundaryEditor}
                    >
                        Edit boundary on map
                    </List.Item>
                </List>
                <BoundaryMap
                    geometry={geometry}
                    boundary={boundary}
                    boundaries={boundaries}
                    selectedObservationPointId={observationPointId}
                    onClick={this.handleClickBoundary}
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
                    onCancel={this.handleCancelGeometryEditor}
                    onChange={this.props.onChange}
                    readOnly={this.props.readOnly}
                />
                }
                {(this.state.showObservationPointEditor && boundary instanceof LineBoundary) &&
                <ObservationPointEditor
                    boundary={boundary}
                    model={model}
                    observationPointId={this.state.observationPointId}
                    onCancel={this.handleCancelObservationPointEditor}
                    onChange={this.props.onChange}
                    readOnly={this.props.readOnly}
                />
                }
            </div>
        );
    }

    private handleCancelGeometryEditor = () => this.setState({showBoundaryEditor: false});
    private handleCancelObservationPointEditor = () => this.setState({showObservationPointEditor: false});
    private handleClickBoundary = (id: string) => this.props.onClick(id);
    private handleClickShowBoundaryEditor = () => this.setState({showBoundaryEditor: true});
    private handleEditPoint = () => this.setState({showObservationPointEditor: true});
    private handleSelectObservationPoint = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        if (data.value && typeof data.value === 'string') {
            return this.setState({
                observationPointId: data.value
            });
        }
    };
}

export default BoundaryDetails;
