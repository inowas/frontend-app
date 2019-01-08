import React from 'react';
import PropTypes from 'prop-types';
import {Button, Input, Message, Select, Table} from 'semantic-ui-react';

import {MCDA} from 'core/mcda';
import {Criterion, CriteriaCollection} from 'core/mcda/criteria';

class CriteriaEditor extends React.Component {
    constructor(props) {
        super();

        this.state = {
            criteria: props.mcda.criteriaCollection.toArray()
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            criteria: nextProps.mcda.criteriaCollection.toArray()
        });
    }

    handleAddCriteria = () => {
        const criteriaCollection = CriteriaCollection.fromArray(this.state.criteria);
        criteriaCollection.add(new Criterion());
        return this.handleChange(criteriaCollection);
    };

    handleChange = criteriaCollection => {
        if (!(criteriaCollection instanceof CriteriaCollection)) {
            throw new Error('CriteriaCollection expected to be of type CriteriaCollection.');
        }

        return this.props.handleChange({
            name: 'criteria',
            value: criteriaCollection
        });
    };

    handleLocalChange = id => (e, {name, value}) => {
        const criteriaCollection = CriteriaCollection.fromArray(this.state.criteria);
        const criterion = criteriaCollection.findById(id);

        if (!criterion) {
            return;
        }

        criterion[name] = value;

        return this.setState({
            criteria: criteriaCollection.update(criterion).toArray()
        });
    };

    handleRemoveCriteria = id => this.handleChange(
        CriteriaCollection.fromArray(this.state.criteria).remove(id)
    );

    handleSelectChange = id => (e, {name, value}) => {
        const criteriaCollection = CriteriaCollection.fromArray(this.state.criteria);
        const criterion = criteriaCollection.findById(id);

        if (!criterion) {
            return;
        }

        criterion[name] = value;

        return this.handleChange(criteriaCollection.update(criterion));
    };

    onBlur = () => this.handleChange(
        CriteriaCollection.fromArray(this.state.criteria)
    );

    render() {
        const {readOnly} = this.props;
        const {criteria} = this.state;

        return (
            <div>
                <Message>
                    <Message.Header>Choose your criteria</Message.Header>
                    <p>If you are unsure which criteria to use, please refer to the review on criteria used in
                        literature: T04</p>
                </Message>

                {this.props.mcda.weightAssignmentsCollection.length > 0 &&
                <Message
                    content='To change, delete or add criteria, you have to delete all weight assignments first or start
                        a new project.'
                    icon='lock'
                    warning
                />
                }

                {criteria.length > 0 &&
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell/>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Type</Table.HeaderCell>
                            <Table.HeaderCell/>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {criteria.map((c, key) =>
                            <Table.Row key={key}>
                                <Table.Cell>{key + 1}</Table.Cell>
                                <Table.Cell>
                                    <Input
                                        name='name'
                                        disabled={readOnly}
                                        value={c.name}
                                        onBlur={this.onBlur}
                                        onChange={this.handleLocalChange(c.id)}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Select
                                        name='type'
                                        disabled={readOnly}
                                        value={c.type}
                                        onChange={this.handleSelectChange(c.id)}
                                        options={[
                                            {key: 'discrete', value: 'discrete', text: 'Discrete'},
                                            {key: 'continuous', value: 'continuous', text: 'Continuous'}
                                        ]}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    {!readOnly &&
                                    <Button
                                        negative
                                        icon='trash'
                                        onClick={() => this.handleRemoveCriteria(c.id)}
                                    />
                                    }
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
                }
                {!readOnly &&
                <Button
                    fluid
                    onClick={this.handleAddCriteria}
                >
                    Add new criteria
                </Button>
                }
            </div>
        );
    }

}

CriteriaEditor.propTypes = {
    mcda: PropTypes.instanceOf(MCDA).isRequired,
    handleChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    routeTo: PropTypes.func
};

export default CriteriaEditor;