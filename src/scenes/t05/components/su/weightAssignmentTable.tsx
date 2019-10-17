import React, {FormEvent, useState} from 'react';
import {CheckboxProps, Message, Radio, Segment, Table} from 'semantic-ui-react';
import {MCDA} from '../../../../core/model/mcda';
import {WeightsCollection} from '../../../../core/model/mcda/criteria';

const styles = {
    noMargin: {
        margin: 0
    },
    tableWrapper: {
        marginBottom: '10px'
    }
};

interface IProps {
    handleChange: (id: string) => any;
    mcda: MCDA;
    readOnly: boolean;
}

const weightAssignmentTable = (props: IProps) => {
    const [showInfo, setShowInfo] = useState<boolean>(true);
    const {mcda} = props;

    const handleDismiss = () => setShowInfo(false);

    const handleChangeRadioButton = (e: FormEvent<HTMLInputElement>, {name}: CheckboxProps) => {
        return props.handleChange(name ? name : '');
    };

    if (!mcda.withAhp) {
        return (
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell/>
                        <Table.HeaderCell>Method</Table.HeaderCell>
                        {mcda.criteriaCollection.orderBy('id').all.map((c, ckey) =>
                            <Table.HeaderCell key={ckey}>{c.name}</Table.HeaderCell>
                        )}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {mcda.weightAssignmentsCollection.all.map((wa, waKey) =>
                        <Table.Row key={waKey}>
                            <Table.Cell>
                                <Radio
                                    name={wa.id}
                                    onChange={handleChangeRadioButton}
                                    checked={wa.isActive}
                                    readOnly={props.readOnly}
                                />
                            </Table.Cell>
                            <Table.Cell>{wa.name}</Table.Cell>
                            {WeightsCollection.fromObject(wa.weights).orderBy('criterion.id').all.map((w, wKey) =>
                                <Table.Cell key={wKey}>{w.value.toFixed(3)}</Table.Cell>
                            )}
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        );
    }

    const mainCriteria = mcda.criteriaCollection.orderBy('id', 'asc').findBy('parent', null);
    const mainCriteriaMethods = mcda.weightAssignmentsCollection.findBy('parent', null);

    return (
        <div>
            {showInfo &&
            <Message onDismiss={handleDismiss}>
                <Message.Header>Suitability</Message.Header>
                {mcda.withAhp ?
                    <p>Select a weight assignment method for each criteria set: the main criteria and each group of
                        sub criteria. Click on the 'Start Calculation' button afterwards.</p> :
                    <p>Select the desired assignment method and click on the 'Start Calculation' button
                        afterwards.</p>
                }
            </Message>
            }
            <Segment textAlign="center" inverted={true} color="grey" secondary={true} style={styles.noMargin}>
                Main Criteria
            </Segment>
            <div style={styles.tableWrapper}>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell/>
                            <Table.HeaderCell>Method</Table.HeaderCell>
                            {
                                mainCriteria.map((c, ckey) =>
                                    <Table.HeaderCell key={ckey}>{c.name}</Table.HeaderCell>
                                )
                            }
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {mainCriteriaMethods.map((wa, cKey) =>
                            <Table.Row key={cKey}>
                                <Table.Cell>
                                    <Radio
                                        name={wa.id}
                                        onChange={props.handleChange('main')}
                                        checked={wa.isActive}
                                        readOnly={props.readOnly}
                                    />
                                </Table.Cell>
                                <Table.Cell>{wa.name}</Table.Cell>
                                {WeightsCollection.fromObject(wa.weights)
                                    .orderBy('criterion.id', 'asc').all.map((w, wKey) =>
                                    <Table.Cell key={wKey}>{w.value.toFixed(3)}</Table.Cell>
                                )}
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </div>
            {mainCriteria.map((mc, mcKey) =>
                <div key={mcKey} style={styles.tableWrapper}>
                    <Segment textAlign="center" inverted={true} color="grey" secondary={true} style={styles.noMargin}>
                        {mc.name}
                    </Segment>
                    <Table style={styles.noMargin}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell/>
                                <Table.HeaderCell>Method</Table.HeaderCell>
                                {mcda.criteriaCollection.orderBy('id').findBy('parent', mc.id).map((c, ckey) =>
                                    <Table.HeaderCell key={ckey}>{c.name}</Table.HeaderCell>
                                )}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {mcda.weightAssignmentsCollection.findBy('parent', mc.id).map((wa, cKey) =>
                                <Table.Row key={cKey}>
                                    <Table.Cell>
                                        <Radio
                                            name={wa.id}
                                            onChange={props.handleChange(mc.id)}
                                            checked={wa.isActive}
                                            readOnly={props.readOnly}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>{wa.name}</Table.Cell>
                                    {WeightsCollection.fromObject(wa.weights)
                                        .orderBy('criterion.id').all.map((w, wKey) =>
                                        <Table.Cell key={wKey}>{w.value.toFixed(3)}</Table.Cell>
                                    )}
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default weightAssignmentTable;
