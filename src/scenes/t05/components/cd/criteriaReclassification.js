import PropTypes from 'prop-types';
import React from 'react';
import {Criterion, Rule} from 'core/mcda/criteria';
import {Button, Icon, Message, Table} from 'semantic-ui-react';
import CriteriaReclassificationModal from './criteriaReclassificationModal';

class CriteriaReclassification extends React.Component {

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
        const rule = this.props.criterion.rulesCollection.findById(id);
        if (rule) {
            this.setState({
                selectedRule: rule.toObject()
            });
        }
    };

    handleRemoveRule = id => {
        const criterion = this.props.criterion;
        criterion.rulesCollection.items = criterion.rulesCollection.all.filter(rule => rule.id !== id);
        return this.props.onChange(criterion);
    };

    handleChangeRule = rule => {
        if (!(rule instanceof Rule)) {
            throw new Error('Rule expected to be instance of Rule.');
        }
        rule.from = parseFloat(rule.from);
        rule.to = parseFloat(rule.to);
        const criterion = this.props.criterion;
        criterion.rulesCollection.update(rule);
        this.handleCloseModal();
        return this.props.onChange(criterion);
    };

    renderEditorContinuous() {
        const {showInfo} = this.state;
        const criterion = this.props.criterion;

        if (!criterion.rulesCollection || criterion.rulesCollection.length === 0) {
            return (
                <Message warning>
                    <Message.Header>No data found</Message.Header>
                    <p>You need to upload a raster file before adding reclassification rules.</p>
                </Message>
            )
        }

        const rules = criterion.rulesCollection.orderBy('to', 'desc').toArray();

        return (
            <div>
                {showInfo &&
                <Message onDismiss={this.handleDismiss}>
                    <Message.Header>Reclassification for continuous values</Message.Header>
                    <p>All suitabilities, whose raster values are not covered by the rules, will be set with 0.</p>
                    <p>Min: {criterion.raster.min}</p>
                    <p>Max: {criterion.raster.max}</p>
                </Message>
                }
                <Button primary icon labelPosition='left' onClick={this.handleAddRule}>
                    <Icon name='add'/>
                    Add Rule
                </Button>
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
                                    {rule.value}
                                </Table.Cell>
                                <Table.Cell textAlign='right'>
                                    <Button.Group>
                                        {this.props.criterion.rulesCollection.isError(rule) &&
                                            <Button negative icon='warning sign' />
                                        }
                                        <Button onClick={() => this.handleEditRule(rule.id)} icon='edit'/>
                                        <Button onClick={() => this.handleRemoveRule(rule.id)} icon='trash'/>
                                    </Button.Group>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Header>
                </Table>
            </div>
        )
    }

    renderEditorDiscrete() {

    }

    render() {
        const {criterion} = this.props;
        const rule = this.state.selectedRule;

        return (
            <div>
                {rule &&
                <CriteriaReclassificationModal
                    onSave={this.handleChangeRule}
                    onClose={this.handleCloseModal}
                    rule={Rule.fromObject(rule)}
                />
                }
                {criterion.type === 'continuous' && this.renderEditorContinuous()}
                {criterion.type === 'discrete' && this.renderEditorDiscrete()}
            </div>
        );
    }
}

CriteriaReclassification.propTypes = {
    criterion: PropTypes.instanceOf(Criterion).isRequired,
    onChange: PropTypes.func.isRequired
};

export default CriteriaReclassification;
