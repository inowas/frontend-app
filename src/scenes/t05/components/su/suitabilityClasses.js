import React from 'react';
import PropTypes from 'prop-types';
import {MCDA} from '../../../../core/model/mcda';
import {Button, Grid, Icon, Message, Segment, Table} from 'semantic-ui-react';
import {Rule} from 'core/model/mcda/criteria';
import CriteriaReclassificationModal from '../cd/criteriaReclassificationModal';

class SuitabilityClasses extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedRule: null,
            showInfo: true
        }
    }

    handleCloseModal = () => this.setState({selectedRule: null});

    handleDismiss = () => this.setState({showInfo: false});

    handleAddRule = () => {
        const rule = new Rule();
        this.setState({
            selectedRule: rule.toObject()
        });
    };

    handleEditRule = id => {
        const rule = this.props.mcda.suitability.rulesCollection.findById(id);

        if (rule) {
            this.setState({
                selectedRule: rule.toObject()
            });
        }
    };

    handleChangeRule = rule => {
        if (!(rule instanceof Rule)) {
            throw new Error('Rule expected to be instance of Rule.');
        }
        rule.from = parseFloat(rule.from);
        rule.to = parseFloat(rule.to);
        const mcda = this.props.mcda;
        mcda.suitability.rulesCollection.update(rule);
        this.handleCloseModal();
        return this.props.handleChange(mcda);
    };

    handleRemoveRule = id => {
        const mcda = this.props.mcda;
        mcda.suitability.rulesCollection.remove(id);
        return this.props.handleChange(mcda);
    };

    render() {
        const {mcda} = this.props;
        const {selectedRule, showInfo} = this.state;
        const rules = mcda.suitability.rulesCollection;

        return (
            <div>
                {showInfo &&
                <Message onDismiss={this.handleDismiss}>
                    <Message.Header>Suitability Classes</Message.Header>
                    <p>...</p>
                </Message>
                }
                {selectedRule &&
                <CriteriaReclassificationModal
                    onSave={this.handleChangeRule}
                    onClose={this.handleCloseModal}
                    rule={Rule.fromObject(selectedRule)}
                    valueIsStatic={true}
                />
                }
                <Grid>
                    <Grid.Column width={5}>
                        <Segment textAlign='center' inverted color='grey' secondary>
                            Commands
                        </Segment>
                        <Segment>
                            <Button primary icon fluid labelPosition='left' onClick={this.handleAddRule}>
                                <Icon name='add'/>
                                Add Rule
                            </Button>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell/>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>From</Table.HeaderCell>
                                    <Table.HeaderCell>To</Table.HeaderCell>
                                    <Table.HeaderCell/>
                                </Table.Row>
                                {rules.all.map((rule, key) =>
                                    <Table.Row key={key}>
                                        <Table.Cell>
                                            <Icon name='circle' style={{color: rule.color}}/>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {rule.name}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {rule.fromOperator} {rule.from}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {rule.toOperator} {rule.to}
                                        </Table.Cell>
                                        <Table.Cell textAlign='right'>
                                            <Button.Group>
                                                {rules.isError(rule) &&
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
                </Grid>
            </div>
        );
    }
}

SuitabilityClasses.proptypes = {
    handleChange: PropTypes.func.isRequired,
    mcda: PropTypes.instanceOf(MCDA).isRequired,
};

export default SuitabilityClasses;