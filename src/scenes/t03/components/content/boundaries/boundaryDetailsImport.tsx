import React, {ChangeEvent, SyntheticEvent} from 'react';
import {DropdownProps, Header, InputOnChangeData, Label, Segment} from 'semantic-ui-react';
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

const rechargeOptions = [
    {key: 0, value: 1, text: '1: Top grid layer'},
    {key: 1, value: 2, text: '2: Specified layer'},
    {key: 2, value: 3, text: '3: Highest active cell'}
];

class BoundaryDetailsImport extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            showBoundaryEditor: false,
            showObservationPointEditor: false,
            observationPointId: props.boundary instanceof LineBoundary ?
                props.boundary.observationPoints[0].id : undefined
        };
    }

    // eslint-disable-next-line react/no-deprecated
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore // todo
        boundary[name] = value;
        return this.props.onChange(boundary);
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const multipleLayers = ['chd', 'ghb'].includes(boundary.type);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let options = {enabled: false, label: '', name: ''};

        switch (boundary.type) {
            case 'rch':
                options = {enabled: true, label: 'Recharge option', name: 'nrchop'};
                break;
            case 'evt':
                options = {enabled: true, label: 'Evapotranspiration option', name: 'nevtop'};
                break;
            default:
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                options = {enabled: false, label: '', name: ''};
                break;
        }

        if (!boundary.layers || ['riv'].includes(boundary.type)) {
            return null;
        }

        return (
            <React.Fragment>
                {(boundary instanceof RechargeBoundary || boundary instanceof EvapotranspirationBoundary) &&
                <Label basic={true} horizontal={true}>
                    {rechargeOptions.filter((o) => o.value === boundary.optionCode)[0].text}
                </Label>
                }
                <Label basic={true} horizontal={true}>
                    {boundary.layers.map(
                        (l: number) => (this.props.soilmodel.layersCollection.toObject()[l].name)
                    ).join(', ')}
                </Label>
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
                <Segment basic={true} style={{padding: '0'}}>
                    <Label basic={true} horizontal={true}>
                        {boundary.type.toUpperCase()}
                    </Label>

                    <Label basic={true} horizontal={true}>
                        {boundary.name}
                    </Label>

                    {boundary.type === 'wel' && boundary instanceof WellBoundary &&
                    <Label basic={true} horizontal={true}>
                        Well type:
                        <Label.Detail>
                            {WellBoundary.wellTypes.types
                                .filter((wt) => wt.value === boundary.wellType)[0].name}
                        </Label.Detail>
                    </Label>
                    }

                    {this.renderLayerSelection()}
                </Segment>

                <BoundaryMap
                    geometry={geometry}
                    boundary={boundary}
                    boundaries={boundaries}
                    selectedObservationPointId={observationPointId}
                />

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
                    soilmodel={this.props.soilmodel}
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

export default BoundaryDetailsImport;
