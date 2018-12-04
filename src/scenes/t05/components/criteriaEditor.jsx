import React from 'react';
import PropTypes from 'prop-types';
import {Button, Header, Input, Message, Segment, Select, Table} from 'semantic-ui-react';

import {Criteria, CriteriaCollection} from 'core/mcda/criteria';

class CriteriaEditor extends React.Component {
    constructor(props) {
        super();

        this.state = {
            criteriaCollection: props.mcda.criteria
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            criteriaCollection: nextProps.mcda.criteria
        });
    }

    handleChange = criteriaCollection => {
        return this.props.handleChange({
            name: 'criteria',
            value: criteriaCollection
        });
    };

    handleLocalChange = id => (e, {name, value}) => this.setState({
        criteria: this.state.criteria.map(c => {
            if (c.id === id) {
                c[name] = value;
            }
            return c;
        })
    });

    handleSelectChange = id => (e, {name, value}) => this.handleChange(
        this.state.criteria.map(c => {
            if (c.id === id) {
                c[name] = value;
            }
            return c;
        })
    );

    onBlur = () => this.handleChange(this.state.criteria);

    onClickAddCriteria = () => {
        const criteriaCollection = CriteriaCollection.fromObject(this.state.criteriaCollection);
        criteriaCollection.add(new Criteria());

        this.handleChange(criteriaCollection);
    };

    onClickRemoveCriteria = id => this.handleChange(this.state.criteria.filter(c => c.id !== id));

    render() {
        const {readOnly} = this.props;
        const {criteriaCollection} = this.state;

        return (
            <Segment>
                <Header as='h3'>Criteria Editor</Header>

                <Message>
                    <Message.Header>Choose your criteria</Message.Header>
                    <p>If you are unsure which criteria to use, please refer to the review on criteria used in
                        literature: <a href='#'>T04</a></p>
                </Message>

                {criteriaCollection.all.length > 0 &&
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
                        {criteriaCollection.all.map((c, key) =>
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
                                            onClick={() => this.onClickRemoveCriteria(c.id)}
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
                        onClick={this.onClickAddCriteria}
                    >
                        Add new criteria
                    </Button>
                }
            </Segment>
        );
    }

}

CriteriaEditor.propTypes = {
    mcda: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    routeTo: PropTypes.func
};

export default CriteriaEditor;