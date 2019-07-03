import React from 'react';
import {BoundaryCollection, ModflowModel} from '../../../../../core/model/modflow';
import {updatePackages, updateTransport} from '../../../actions/actions';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Substance, Transport} from '../../../../../core/model/modflow/transport';
import PropTypes from 'prop-types';
import {Button, Grid, Menu, Segment} from 'semantic-ui-react';
import SubstanceList from './SubstanceList';
import ContentToolBar from '../../../../shared/ContentToolbar';
import SubstanceDetails from './SubstanceDetails';
import {sendCommand} from '../../../../../services/api';
import Command from '../../../commands/modflowModelCommand';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';

class TransportUi extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isDirty: false,
            isError: false,
            isLoading: false,
            selectedSubstanceId: null
        };
    }

    componentDidMount() {
        if (!this.state.selectedSubstanceId && this.props.transport.substances.length > 0) {
            this.handleSubstanceListClick(this.props.transport.substances.first.id);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.selectedSubstanceId && nextProps.transport.substances.length > 0) {
            this.handleSubstanceListClick(nextProps.transport.substances.first.id);
        }
    }

    handleAddSubstance = () => {
        const substance = Substance.create('new substance');
        const transport = this.props.transport;
        transport.addSubstance(substance);
        transport.enabled = true;
        this.props.updateTransport(transport);
        return this.setState({selectedSubstanceId: substance.id});
    };


    handleSubstanceListClick = selectedSubstanceId => {
        return this.setState({selectedSubstanceId: selectedSubstanceId})
    };

    handleRemoveSubstance = substanceId => {
        console.log('handleRemoveSubstance');
        const transport = this.props.transport;
        transport.removeSubstanceById(substanceId);
        this.props.updateTransport(transport);

        if (transport.substances.length === 0) {
            return this.setState({selectedSubstanceId: null});
        }

        return this.setState({selectedSubstanceId: transport.substances.first.id});
    };

    handleChangeSubstance = substance => {
        const transport = this.props.transport;
        transport.updateSubstance(substance);
        this.props.updateTransport(transport);
        return this.setState({selectedSubstanceId: substance.id, isDirty: true});
    };

    handleToggleEnabled = () => {
        const transport = this.props.transport;
        transport.enabled = !transport.enabled;
        this.props.updateTransport(transport);
        return this.setState({isDirty: true});
    };

    onSave = () => {
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
                sendCommand(Command.updateFlopyPackages(this.props.model.id, packages))
            }
        );
    };

    render() {
        const {boundaries, model, transport} = this.props;

        if (!(transport instanceof Transport)) {
            return null;
        }

        const {substances} = transport;
        const {readOnly} = model;

        const {selectedSubstanceId, isDirty, isError} = this.state;
        const selectedSubstance = substances.findById(selectedSubstanceId);

        return (
            <Segment color={'grey'}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <Menu fluid vertical tabular>
                                <Menu.Item>
                                    <Button
                                        negative={!transport.enabled}
                                        positive={transport.enabled}
                                        icon={transport.enabled ? 'toggle on' : 'toggle off'}
                                        labelPosition='left'
                                        onClick={this.handleToggleEnabled}
                                        content={transport.enabled ? 'Enabled' : 'Disabled'}
                                        style={{marginLeft: '-20px', width: '200px'}}
                                    />
                                </Menu.Item>
                                <SubstanceList
                                    addSubstance={this.handleAddSubstance}
                                    onClick={this.handleSubstanceListClick}
                                    onRemove={this.handleRemoveSubstance}
                                    selected={selectedSubstanceId}
                                    substances={substances}
                                />
                            </Menu>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <div>
                                <ContentToolBar
                                    isDirty={isDirty}
                                    isError={isError || (selectedSubstance && selectedSubstance.boundaryConcentrations.length === 0)}
                                    visible={!readOnly}
                                    message={(selectedSubstance && selectedSubstance.boundaryConcentrations.length === 0) ?
                                            {warning: true, content: 'No Boundary'} : null}
                                    save
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
        )
    }
}

const mapStateToProps = state => {
    return {
        boundaries: BoundaryCollection.fromObject(state.T03.boundaries),
        model: ModflowModel.fromObject(state.T03.model),
        packages: FlopyPackages.fromObject(state.T03.packages),
        transport: Transport.fromObject(state.T03.transport),
    };
};

const mapDispatchToProps = {
    updatePackages,
    updateTransport
};

Transport.propTypes = {
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    packages: PropTypes.instanceOf(FlopyPackages).isRequired,
    transport: PropTypes.instanceOf(Transport).isRequired,
    updatePackages: PropTypes.func.isRequired,
    updateTransport: PropTypes.func.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TransportUi));
