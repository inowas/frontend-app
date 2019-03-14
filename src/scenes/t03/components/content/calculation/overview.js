import React from 'react';
import PropTypes from 'prop-types';

import {Calculation, ModflowModel} from 'core/model/modflow';
import {Button, Grid, Header, List, Segment} from 'semantic-ui-react';
import RunModelOverviewMap from '../../maps/runModelOverviewMap';
import {connect} from 'react-redux';
import CalculationStatus, {CALCULATION_STATE_QUEUED} from './CalculationStatus';
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
        const calculation = Calculation.fromObject(this.props.calculation.toObject());
        calculation.state = CALCULATION_STATE_QUEUED;
        calculation.id = this.props.packages.calculation_id;

        this.setState({sending: true},
            () => sendCalculationRequest(this.props.packages,
                () => {
                    sendCommand(ModflowModelCommand.updateModflowModelCalculation(this.props.model.id, calculation));
                    this.props.updateCalculation(calculation)
                },
                e => console.error(e)
            )
        );
    };

    render() {
        const {calculation, model} = this.props;

        if (!(calculation instanceof Calculation)) {
            return null;
        }

        let canBeCalculated = true;
        if (calculation.state > 0 && calculation.state < 100) {
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
    model: ModflowModel.fromObject(state.T03.model),
    packages: FlopyPackages.fromObject(state.T03.packages)
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
