import React from 'react';
import PropTypes from 'prop-types';
import {Message, Radio, Segment, Table} from 'semantic-ui-react';
import {MCDA} from 'core/model/mcda';

const styles = {
    noMargin: {
        margin: 0
    },
    tableWrapper: {
        marginBottom: '10px'
    }
};

class WeightAssignmentTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showInfo: true
        }
    }

    handleDismiss = () => this.setState({showInfo: false});

    render() {
        const {mcda} = this.props;
        const {showInfo} = this.state;

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
                                <Table.Cell><Radio name={wa.id} onChange={this.props.handleChange()}
                                                   checked={wa.isActive}/></Table.Cell>
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

        const mainCriteria = mcda.criteriaCollection.findBy('parentId', null, {returnCollection: true});
        const mainCriteriaMethods = mcda.weightAssignmentsCollection.findBy('parent', null, {returnCollection: true});

        return (
            <div>
                {showInfo &&
                <Message onDismiss={this.handleDismiss}>
                    <Message.Header>Suitability</Message.Header>
                    {mcda.withAhp ?
                        <p>Select a weight assignment method for each criteria set: the main criteria and each group of
                            sub criteria. Click on the 'Start Calculation' button afterwards.</p> :
                        <p>Select the desired assignment method and click on the 'Start Calculation' button
                            afterwards.</p>
                    }
                </Message>
                }
                <Segment textAlign='center' inverted color='grey' secondary style={styles.noMargin}>
                    Main Criteria
                </Segment>
                <div style={styles.tableWrapper}>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell/>
                                <Table.HeaderCell>Method</Table.HeaderCell>
                                {mainCriteria.all.map((c, ckey) =>
                                    <Table.HeaderCell key={ckey}>{c.name}</Table.HeaderCell>
                                )}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {mainCriteriaMethods.all.map((wa, cKey) =>
                                <Table.Row key={cKey}>
                                    <Table.Cell>
                                        <Radio name={wa.id} onChange={this.props.handleChange('main')}
                                               checked={wa.isActive}/>
                                    </Table.Cell>
                                    <Table.Cell>{wa.name}</Table.Cell>
                                    {wa.weightsCollection.all.map((w, wKey) =>
                                        <Table.Cell key={wKey}>{w.value.toFixed(3)}</Table.Cell>
                                    )}
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </div>
                {mainCriteria.all.map((mc, mcKey) =>
                    <div key={mcKey} style={styles.tableWrapper}>
                        <Segment textAlign='center' inverted color='grey' secondary style={styles.noMargin}>
                            {mc.name}
                        </Segment>
                        <Table style={styles.noMargin}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell/>
                                    <Table.HeaderCell>Method</Table.HeaderCell>
                                    {mcda.criteriaCollection.findBy('parentId', mc.id).map((c, ckey) =>
                                        <Table.HeaderCell key={ckey}>{c.name}</Table.HeaderCell>
                                    )}
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {mcda.weightAssignmentsCollection.findBy('parent', mc.id).map((wa, cKey) =>
                                    <Table.Row key={cKey}>
                                        <Table.Cell>
                                            <Radio name={wa.id} onChange={this.props.handleChange(mc.id)}
                                                   checked={wa.isActive}/>
                                        </Table.Cell>
                                        <Table.Cell>{wa.name}</Table.Cell>
                                        {wa.weightsCollection.all.map((w, wKey) =>
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

    }
}

WeightAssignmentTable.proptypes = {
    handleChange: PropTypes.func.isRequired,
    mcda: PropTypes.instanceOf(MCDA).isRequired,
};

export default WeightAssignmentTable;