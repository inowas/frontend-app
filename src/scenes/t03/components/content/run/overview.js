import React from 'react';
import PropTypes from 'prop-types';

import {ModflowModel} from 'core/model/modflow';
import {Button, Grid, Header, List, Segment} from 'semantic-ui-react';
import RunModelOverviewMap from '../../maps/runModelOverviewMap';
import {connect} from 'react-redux';
import CalculationStatus from './CalculationStatus';

class Overview extends React.Component {

    state = {
        canBeCalculated: true,
        canBeCanceled: false,
    };

    render() {
        const {model} = this.props;

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
                            {this.state.canBeCalculated && <Button positive fluid onClick={() => {}}>
                                Calculate
                            </Button>}

                            {this.state.canBeCanceled && <Button negative fluid onClick={() => {
                            }}>
                                Cancel calculation
                            </Button>}

                            <Header as={'h3'}>Progress</Header>
                            <CalculationStatus calculation={model.calculation}/>
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

const mapStateToProps = state => {
    return {
        model: ModflowModel.fromObject(state.T03.model),
        calculation: state.T03.calculation
    };
};

Overview.proptypes = {
    model: PropTypes.instanceOf(ModflowModel).isRequired
};

export default connect(mapStateToProps)(Overview);
