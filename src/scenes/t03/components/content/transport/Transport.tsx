import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Button, Grid, Menu, Segment} from 'semantic-ui-react';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';
import {BoundaryCollection, ModflowModel} from '../../../../../core/model/modflow';
import {Substance, Transport} from '../../../../../core/model/modflow/transport';
import {sendCommand} from '../../../../../services/api';
import ContentToolBar from '../../../../shared/ContentToolbar';
import {updatePackages, updateTransport} from '../../../actions/actions';
import Command from '../../../commands/modflowModelCommand';
import SubstanceDetails from './SubstanceDetails';
import SubstanceList from './SubstanceList';

interface IOwnProps {
    history: any;
    location: any;
    match: any;
    readOnly?: boolean;
}

interface IDispatchProps {
    updatePackages: (packages: FlopyPackages) => any;
    updateTransport: (transport: Transport) => any;
}

interface IStateProps {
    boundaries: BoundaryCollection;
    model: ModflowModel;
    packages: FlopyPackages;
    transport: Transport;
}

type Props = IStateProps & IDispatchProps & IOwnProps;

interface IState {
    isDirty: boolean;
    isError: boolean;
    isLoading: boolean;
    selectedSubstanceId: string | null;
}

class TransportUi extends React.Component<Props, IState> {

    constructor(props: Props) {
        super(props);
        this.state = {
            isDirty: false,
            isError: false,
            isLoading: false,
            selectedSubstanceId: null
        };
    }

    public componentDidMount() {
        if (!this.state.selectedSubstanceId && this.props.transport.substances.length > 0) {
            this.handleSubstanceListClick(this.props.transport.substances.first.id);
        }
    }

    public componentWillReceiveProps(nextProps: Props) {
        if (!this.state.selectedSubstanceId && nextProps.transport.substances.length > 0) {
            this.handleSubstanceListClick(nextProps.transport.substances.first.id);
        }
    }

    public handleAddSubstance = () => {
        const substance = Substance.create('new substance');
        const transport = this.props.transport;
        transport.addSubstance(substance);
        transport.enabled = true;
        this.props.updateTransport(transport);
        return this.setState({selectedSubstanceId: substance.id});
    };

    public handleSubstanceListClick = (selectedSubstanceId: string) => {
        return this.setState({selectedSubstanceId});
    };

    public handleRemoveSubstance = (substanceId: string) => {
        const transport = this.props.transport;
        transport.removeSubstanceById(substanceId);
        this.props.updateTransport(transport);

        if (transport.substances.length === 0) {
            return this.setState({selectedSubstanceId: null});
        }

        return this.setState({selectedSubstanceId: transport.substances.first.id});
    };

    public handleChangeSubstance = (substance: Substance) => {
        const transport = this.props.transport;
        transport.updateSubstance(substance);
        this.props.updateTransport(transport);
        return this.setState({selectedSubstanceId: substance.id, isDirty: true});
    };

    public handleToggleEnabled = () => {
        const transport = this.props.transport;
        transport.enabled = !transport.enabled;
        this.props.updateTransport(transport);
        return this.setState({isDirty: true});
    };

    public onSave = () => {
        const {boundaries, packages, transport} = this.props;
        this.setState({isLoading: true});
        return sendCommand(
            Command.updateTransport({
                id: this.props.model.id,
                transport: transport.toObject(),
            }), () => {
                this.props.updateTransport(transport);
                this.setState({
                    isDirty: false,
                    isLoading: false
                });

                const mt = packages.mt;
                mt.recalculate(transport, boundaries);
                packages.mt = mt;

                this.props.updatePackages(packages);
                sendCommand(Command.updateFlopyPackages(this.props.model.id, packages));
            }
        );
    };

    public render() {
        const {boundaries, model, transport} = this.props;

        if (!(transport instanceof Transport)) {
            return null;
        }

        const {substances} = transport;
        const {readOnly} = model;

        const {selectedSubstanceId, isDirty, isError} = this.state;
        const selectedSubstance = selectedSubstanceId ?
            substances.findById(selectedSubstanceId) || undefined : undefined;
        const noBoundaryError = substances.all.filter((s) => s.boundaryConcentrations.length === 0).length > 0;

        return (
            <Segment color={'grey'}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <Menu fluid={true} vertical={true} tabular={true}>
                                <Menu.Item>
                                    <Button
                                        negative={!transport.enabled}
                                        positive={transport.enabled}
                                        icon={transport.enabled ? 'toggle on' : 'toggle off'}
                                        labelPosition="left"
                                        onClick={this.handleToggleEnabled}
                                        content={transport.enabled ? 'Enabled' : 'Disabled'}
                                        style={{marginLeft: '-20px', width: '200px'}}
                                    />
                                </Menu.Item>
                                <SubstanceList
                                    addSubstance={this.handleAddSubstance}
                                    onClick={this.handleSubstanceListClick}
                                    onRemove={this.handleRemoveSubstance}
                                    selected={selectedSubstanceId || undefined}
                                    substances={substances}
                                />
                            </Menu>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <div>
                                <ContentToolBar
                                    isDirty={isDirty}
                                    isError={isError || noBoundaryError}
                                    visible={!readOnly}
                                    message={noBoundaryError ? {warning: true, content: 'No Boundary'} : null}
                                    save={true}
                                    onSave={this.onSave}
                                />
                                <SubstanceDetails
                                    substance={selectedSubstance}
                                    boundaries={boundaries}
                                    onChange={this.handleChangeSubstance}
                                    readOnly={readOnly}
                                    stressperiods={model.stressperiods}
                                />
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        boundaries: BoundaryCollection.fromObject(state.T03.boundaries),
        model: ModflowModel.fromObject(state.T03.model),
        packages: FlopyPackages.fromObject(state.T03.packages),
        transport: Transport.fromObject(state.T03.transport)
    };
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    updatePackages: (packages: FlopyPackages) => dispatch(updatePackages(packages)),
    updateTransport: (transport: Transport) => dispatch(updateTransport(transport))
});

export default withRouter(connect<IStateProps, IDispatchProps, IOwnProps>(
    mapStateToProps,
    mapDispatchToProps)
(TransportUi));
