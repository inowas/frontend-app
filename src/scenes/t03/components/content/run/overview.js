import React from 'react';
import PropTypes from 'prop-types';

import {Calculation, ModflowModel} from 'core/model/modflow';
import {Button, Grid, Header, List, Segment} from 'semantic-ui-react';
import RunModelOverviewMap from '../../maps/runModelOverviewMap';
import {connect} from 'react-redux';
import CalculationStatus, {CALCULATION_STATE_STARTED} from './CalculationStatus';
import {sendCommand} from 'services/api';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import {updateCalculation} from '../../../actions/actions';

class Overview extends React.Component {

    state = {
        canBeCalculated: true,
        canBeCanceled: false,
        sendingCommand: false
    };

    onStartCalculationClick = () => {
        const {model, calculation} = this.props;
        calculation.state = CALCULATION_STATE_STARTED;
        this.setState({sendingCommand: true});
        sendCommand(
            ModflowModelCommand.calculateModflowModel(model.id),
            () => {
                this.setState({sendingCommand: false});
                this.props.updateCalculation(calculation);
            }
        )
    };

    render() {
        const {calculation, model} = this.props;

        if (!(calculation instanceof Calculation)) {
            return null;
        }

        let canBeCalculated = true;
        if (calculation.state > 0 && calculation.state < 6) {
            canBeCalculated = false;
        }

        const {sendingCommand} = this.state;

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
                        <Header as={'h3'}>Validation</Header>
                        <Segment>
                        </Segment>
                        <Header as={'h3'}>Calculation</Header>
                        <Segment>
                            {canBeCalculated &&
                            <Button
                                positive
                                fluid
                                onClick={this.onStartCalculationClick}
                                loading={sendingCommand}
                            >
                                Calculate
                            </Button>}
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
    calculation: state.T03.calculation ? Calculation.fromObject(state.T03.calculation) : null,
    model: ModflowModel.fromObject(state.T03.model)
});

const mapDispatchToProps = {
    updateCalculation
};


Overview.proptypes = {
    calculation: PropTypes.instanceOf(Calculation),
    model: PropTypes.instanceOf(ModflowModel).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
