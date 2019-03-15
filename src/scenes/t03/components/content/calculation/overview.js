import React from 'react';
import PropTypes from 'prop-types';

import {Calculation, ModflowModel} from 'core/model/modflow';
import {Button, Grid, Header, List, Segment} from 'semantic-ui-react';
import RunModelOverviewMap from '../../maps/runModelOverviewMap';
import {connect} from 'react-redux';
import CalculationStatus, {CALCULATION_STATE_NEW} from './CalculationStatus';
import {sendCalculationRequest, sendCommand} from 'services/api';
import {updateCalculation} from '../../../actions/actions';
import FlopyPackages from 'core/model/flopy/packages/FlopyPackages';
import ModflowModelCommand from '../../../commands/modflowModelCommand';

class Overview extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            canBeCalculated: true,
            canBeCanceled: false,
            sending: false
        };
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

    calculationButton = canBeCalculated => {
        const {sendingCommand} = this.state;

        if (canBeCalculated) {
            return (
                <Button
                    positive
                    fluid
                    onClick={this.onStartCalculationClick}
                    loading={sendingCommand}
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


    render() {
        const {model, calculation, packages} = this.props;
        const {calculationId} = model;

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
                        <Header as={'h3'}>Overview</Header>
                        <Segment color={'green'}>
                            <List>
                                <List.Item icon='users' content={model.name}/>
                                <List.Item icon='marker' content={'...'}/>
                                <List.Item icon='mail' content={'...'}/>
                                <List.Item icon='linkify' content={'...'}/>
                            </List>
                        </Segment>
                        <Header as={'h3'}>Calculation</Header>
                        <Segment>
                            {this.calculationButton(canBeCalculated)}
                            <Header as={'h3'}>Progress</Header>
                            {calculation && <CalculationStatus calculation={calculation}/>}
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Header as={'h3'}>Map</Header>
                        <Segment color={'red'}>
                            <RunModelOverviewMap model={model}/>
                        </Segment>
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
    model: ModflowModel.fromObject(state.T03.model),
    packages: FlopyPackages.fromObject(state.T03.packages),
    calculation: state.T03.calculation ? Calculation.fromObject(state.T03.calculation) : null,
});

const mapDispatchToProps = {
    updateCalculation
};

Overview.proptypes = {
    calculation: PropTypes.instanceOf(Calculation).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    packages: PropTypes.instanceOf(FlopyPackages).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
