import PropTypes from 'prop-types';
import React from 'react';
import {Criterion} from 'core/model/mcda/criteria';
import {Button, Grid, Icon, Message, Segment, Table} from 'semantic-ui-react';

class CriteriaReclassificationDiscrete extends React.Component {

    constructor(props) {
        super(props);

        const criterion = props.criterion;
        console.log('CRITERION', criterion);


        //if (criterion.rulesCollection.length === 0) {
            const uniqueValues = criterion.tilesCollection.uniqueValues;
            console.log('UNIQUE', uniqueValues);
        //}

        this.state = {
            selectedRule: null,
            showInfo: true
        }
    }

    render() {
        const {showInfo} = this.state;
        const rules = [];

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        {showInfo &&
                        <Message onDismiss={this.handleDismiss}>
                            <Message.Header>Reclassification for discrete values</Message.Header>
                            <p>All suitabilities, whose raster values are not covered by the rules, will be set with
                                0.</p>
                        </Message>
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={5}>
                        <Segment textAlign='center' inverted color='grey' secondary>
                            Commands
                        </Segment>
                        <Segment>
                            <Button positive icon fluid labelPosition='left' onClick={this.handleClickCalculate}>
                                <Icon name='calculator'/>
                                Calculate Suitability
                            </Button>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>From</Table.HeaderCell>
                                    <Table.HeaderCell>To</Table.HeaderCell>
                                    <Table.HeaderCell>Suitability Index</Table.HeaderCell>
                                    <Table.HeaderCell/>
                                </Table.Row>
                                {rules.map((rule, key) =>
                                    <Table.Row key={key}>
                                        <Table.Cell>
                                            {rule.fromOperator} {rule.from}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {rule.toOperator} {rule.to}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {rule.type === 'calc' ? rule.expression : rule.value}
                                        </Table.Cell>
                                        <Table.Cell textAlign='right'>
                                            <Button.Group>
                                                {this.props.criterion.rulesCollection.isError(rule) &&
                                                <Button negative icon='warning sign'/>
                                                }
                                                <Button onClick={() => this.handleEditRule(rule.id)} icon='edit'/>
                                                <Button onClick={() => this.handleRemoveRule(rule.id)} icon='trash'/>
                                            </Button.Group>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Header>
                        </Table>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

CriteriaReclassificationDiscrete.propTypes = {
    criterion: PropTypes.instanceOf(Criterion).isRequired,
    onChange: PropTypes.func.isRequired
};

export default CriteriaReclassificationDiscrete;