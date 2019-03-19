import React from 'react';
import PropTypes from 'prop-types';

import {Calculation, ModflowModel, Soilmodel} from 'core/model/modflow';
import {Button, Grid, Header, Segment} from 'semantic-ui-react';
import RunModelOverviewMap from '../../maps/runModelOverviewMap';
import {connect} from 'react-redux';
import CalculationStatus, {CALCULATION_STATE_NEW} from './CalculationStatus';
import {sendCalculationRequest, sendCommand} from 'services/api';
import {updateCalculation, updatePackages} from '../../../actions/actions';
import FlopyPackages from 'core/model/flopy/packages/FlopyPackages';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import {BoundaryCollection} from 'core/model/modflow/boundaries';
import Terminal from '../../../../shared/complexTools/Terminal';

class Overview extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            canBeCalculated: true,
            canBeCanceled: false,
            sending: false,
            file: null,
            fetchingFile: false
        };
    }

    componentDidMount() {
        const {boundaries, model, soilmodel} = this.props;
        const packages = FlopyPackages.fromObject(this.props.packages.toObject());
        packages.mf.recalculate(model, soilmodel, boundaries);
        this.props.updatePackages(packages);
    }

    onStartCalculationClick = () => {
        const calculationId = this.props.packages.calculation_id;
        this.setState({sending: true},
            () => sendCalculationRequest(this.props.packages,
                () => {
                    sendCommand(ModflowModelCommand.updateModflowModelCalculationId(this.props.model.id, calculationId),
                        () => this.props.updateCalculation(Calculation.fromCalculationIdAndState(calculationId, CALCULATION_STATE_NEW)),
                        e => console.error(e));
                })
        );
    };

    renderCalculationButton = canBeCalculated => {
        const {sending} = this.state;

        if (canBeCalculated) {
            return (
                <Button
                    positive
                    fluid
                    onClick={this.onStartCalculationClick}
                    loading={sending}
                >
                    Calculate
                </Button>
            )
        }

        return (
            <Button
                color={'green'}
                disabled
                fluid
            >
                Calculation finished
            </Button>
        )
    };

    renderCalculationProgress = calculation => {
        const {packages, model} = this.props;
        const {calculationId} = model;

        let showProgress = false;

        if (calculation instanceof Calculation) {
            if (calculation.state > 0 && calculation.state < 100) {
                showProgress = true;
            }
        }

        if (calculationId === packages.calculation_id) {
            showProgress = true;
        }

        if (showProgress) {
            return (
                <div style={{marginTop: 20}}>
                    <Header as={'h3'}>Progress</Header>
                    <Segment>
                        {calculation && <CalculationStatus calculation={calculation}/>}
                    </Segment>
                </div>
            )
        }

        return null;
    };

    renderMapOrLog = calculation => {
        const {packages, model} = this.props;
        const {calculationId} = model;

        if (calculationId === packages.calculation_id && calculation && calculation.state >= 200) {
            return (
                <div>
                    <Header as={'h3'}>Log</Header>
                    <Segment color={'black'} loading={this.state.fetchingFile}>
                        <Terminal content={calculation.message}/>
                    </Segment>
                </div>
            )
        }

        return (
            <div>
                <Header as={'h3'}>Map</Header>
                <Segment color={'red'}>
                    <RunModelOverviewMap model={model}/>
                </Segment>
            </div>
        )
    };

    render() {
        const {model, calculation, packages} = this.props;
        const {calculationId} = model;

        if (!(packages instanceof FlopyPackages)) {
            return null;
        }

        let canBeCalculated = true;
        if (calculation instanceof Calculation) {
            if (calculation.state > 0 && calculation.state < 100) {
                canBeCalculated = false;
            }
        }

        if (calculationId === packages.calculation_id) {
            canBeCalculated = false;
        }

        return (
            <Grid padded>
                <Grid.Row>
                    <Grid.Column width={6}>
                        <Header as={'h3'}>Calculation</Header>
                        {this.renderCalculationButton(canBeCalculated)}
                        {this.renderCalculationProgress(calculation)}

                    </Grid.Column>
                    <Grid.Column width={10}>
                        {this.renderMapOrLog(calculation)}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16}>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

const mapStateToProps = state => ({
    boundaries: BoundaryCollection.fromObject(state.T03.boundaries),
    calculation: state.T03.calculation ? Calculation.fromObject(state.T03.calculation) : null,
    model: ModflowModel.fromObject(state.T03.model),
    packages: FlopyPackages.fromObject(state.T03.packages),
    soilmodel: Soilmodel.fromObject(state.T03.soilmodel),
});

const mapDispatchToProps = {
    updateCalculation, updatePackages
};

Overview.proptypes = {
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    calculation: PropTypes.instanceOf(Calculation),
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    packages: PropTypes.instanceOf(FlopyPackages).isRequired,
    soilmodel: PropTypes.instanceOf(Soilmodel).isRequired,
    updateCalculation: PropTypes.func.isRequired,
    updatePackages: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
