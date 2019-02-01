import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {MCDA} from 'core/model/mcda';
import {WeightAssignmentsCollection} from 'core/model/mcda/criteria';
import {Button, Grid, Message, Radio, Segment, Table} from 'semantic-ui-react';
import {heatMapColors} from '../../defaults/gis';
import CriteriaRasterMap from '../cd/criteriaRasterMap';

class Suitability extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showInfo: true
        }
    }

    handleDismiss = () => this.setState({showInfo: false});

    handleChangeWA = (e, {name}) => {
        const wac = this.props.mcda.weightAssignmentsCollection.toArray().map(wa => {
            wa.isActive = wa.id === name;
            return wa;
        });
        return this.props.handleChange({
            name: 'weights',
            value: WeightAssignmentsCollection.fromArray(wac)
        });
    };

    handleClickCalculation = () => {
        const mcda = this.props.mcda.calculate();
        return this.props.handleChange({
            name: 'mcda',
            value: mcda
        });
    };

    renderWATable() {
        const {mcda} = this.props;

        if (!mcda.withAhp) {
            return (
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell/>
                            <Table.HeaderCell>Method</Table.HeaderCell>
                            {mcda.criteriaCollection.all.map((c, ckey) =>
                                <Table.HeaderCell key={ckey}>{c.name}</Table.HeaderCell>
                            )}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {mcda.weightAssignmentsCollection.all.map((wa, waKey) =>
                            <Table.Row key={waKey}>
                                <Table.Cell><Radio name={wa.id} onChange={this.handleChangeWA} checked={wa.isActive}/></Table.Cell>
                                <Table.Cell>{wa.name}</Table.Cell>
                                {wa.weightsCollection.all.map((w, wKey) =>
                                    <Table.Cell key={wKey}>{w.value.toFixed(3)}</Table.Cell>
                                )}
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            );
        }
        return (<div>WITH AHP</div>);
    }

    render() {
        const {mcda} = this.props;
        const {showInfo} = this.state;

        return (
            <div>
                {showInfo &&
                <Message onDismiss={this.handleDismiss}>
                    <Message.Header>Suitability</Message.Header>
                    <p>...</p>
                </Message>
                }
                <Grid columns={2}>
                    <Grid.Column>
                        <Segment textAlign='center' inverted color='grey' secondary>
                            Select Weight Assignment
                        </Segment>
                        {this.renderWATable()}
                        <Button
                            disabled={mcda.weightAssignmentsCollection.findBy('isActive', true).length < 1}
                            onClick={this.handleClickCalculation}
                            primary
                            fluid
                        >
                            Start Calculation
                        </Button>
                    </Grid.Column>
                    <Grid.Column>
                        {mcda.suitability && mcda.suitability.data.length > 0 &&
                            <CriteriaRasterMap
                                colors={heatMapColors['default']}
                                raster={mcda.suitability}
                                showBasicLayer={true}
                            />
                        }
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

Suitability.proptypes = {
    handleChange: PropTypes.func.isRequired,
    mcda: PropTypes.instanceOf(MCDA).isRequired,
};

export default withRouter(Suitability);
