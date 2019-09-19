import React, {useState} from 'react';
import {Button, Grid, Icon, Message, Segment, Table} from 'semantic-ui-react';
import {MCDA} from '../../../../core/model/mcda';
import {Rule} from '../../../../core/model/mcda/criteria';
import {IRule} from '../../../../core/model/mcda/criteria/Rule.type';
import CriteriaReclassificationModal from '../cd/criteriaReclassificationModal';

interface IProps {
    handleChange: (mcda: MCDA) => any;
    mcda: MCDA;
    readOnly: boolean;
}

const suitabilityClasses = (props: IProps) => {
    const [selectedRule, setSelectedRule] = useState<IRule | null>(null);
    const [showInfo, setShowInfo] = useState<boolean>(true);

    const {mcda, readOnly} = props;

    const handleCloseModal = () => setSelectedRule(null);

    const handleDismiss = () => setShowInfo(false);

    const handleAddRule = () => {
        if (props.readOnly) {
            return;
        }

        const rule = Rule.fromDefaults();
        setSelectedRule(rule.toObject());
    };

    const handleEditRule = (id: string) => {
        if (props.readOnly) {
            return;
        }
        const rule = props.mcda.suitability.rulesCollection.findById(id);

        if (rule) {
            setSelectedRule(rule);
        }
    };

    const handleChangeRule = (rule: Rule) => {
        if (props.readOnly) {
            return;
        }

        mcda.suitability.rulesCollection.update(rule);
        handleCloseModal();
        return props.handleChange(mcda);
    };

    const handleRemoveRule = (id: string) => {
        if (props.readOnly) {
            return;
        }

        mcda.suitability.rulesCollection.removeById(id);
        return props.handleChange(mcda);
    };

    const handleClickEditRule = (id: string) => () => handleEditRule(id);
    const handleClickRemoveRule = (id: string) => () => handleRemoveRule(id);

    const rules = mcda.suitability.rulesCollection;

    return (
        <div>
            {showInfo &&
            <Message onDismiss={handleDismiss}>
                <Message.Header>Suitability Classes</Message.Header>
                <p>...</p>
            </Message>
            }
            {!readOnly && selectedRule &&
            <CriteriaReclassificationModal
                onSave={handleChangeRule}
                onClose={handleCloseModal}
                rule={Rule.fromObject(selectedRule)}
                valueIsStatic={true}
            />
            }
            <Grid>
                <Grid.Column width={5}>
                    <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                        Commands
                    </Segment>
                    <Segment>
                        <Button
                            disabled={readOnly}
                            primary={true}
                            icon={true}
                            fluid={true}
                            labelPosition="left"
                            onClick={handleAddRule}
                        >
                            <Icon name="add"/>
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
                                        <Icon name="circle" style={{color: rule.color}}/>
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
                                    <Table.Cell textAlign="right">
                                        {!readOnly &&
                                        <Button.Group>
                                            {rules.isError(Rule.fromObject(rule)) &&
                                            <Button negative={true} icon="warning sign"/>
                                            }
                                            <Button onClick={handleClickEditRule(rule.id)} icon="edit"/>
                                            <Button onClick={handleClickRemoveRule(rule.id)} icon="trash"/>
                                        </Button.Group>
                                        }
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Header>
                    </Table>
                </Grid.Column>
            </Grid>
        </div>
    );
};
export default suitabilityClasses;
