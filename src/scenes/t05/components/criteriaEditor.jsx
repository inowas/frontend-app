import React from "react";
import PropTypes from "prop-types";
import {Button, Header, Input, Message, Segment, Select, Table} from "semantic-ui-react";

import Criteria from "./Criteria";

class CriteriaEditor extends React.Component {
    constructor(props) {
        super();

        this.state = {
            criteria: props.mcda.criteria.map(c => c.toObject)
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            criteria: nextProps.mcda.criteria.map(c => c.toObject)
        });
    }

    handleChange = criteria => this.props.handleChange({
        name: 'criteria',
        value: criteria.map(c => Criteria.fromObject(c))
    });

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

    onClickAddCriteria = () => this.handleChange(this.state.criteria.concat((new Criteria()).toObject));

    onClickRemoveCriteria = id => this.handleChange(this.state.criteria.filter(c => c.id !== id));

    render() {
        return (
            <Segment>
                <Header as='h3'>Criteria Editor</Header>

                <Message>
                    <Message.Header>Choose your criteria</Message.Header>
                    <p>If you are unsure which criteria to use, please refer to the review on criteria used in
                        literature: <a href='#'>T04</a></p>
                </Message>

                {this.state.criteria.length > 0 &&
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
                        {this.state.criteria.map((c, key) =>
                            <Table.Row key={key}>
                                <Table.Cell>{key + 1}</Table.Cell>
                                <Table.Cell>
                                    <Input
                                        name='name'
                                        value={c.name}
                                        onBlur={this.onBlur}
                                        onChange={this.handleLocalChange(c.id)}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Select
                                        name='type'
                                        value={c.type}
                                        onChange={this.handleSelectChange(c.id)}
                                        options={[
                                            {key: 'discrete', value: 'discrete', text: 'Discrete'},
                                            {key: 'continuous', value: 'continuous', text: 'Continuous'}
                                        ]}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Button
                                        negative
                                        icon='trash'
                                        onClick={() => this.onClickRemoveCriteria(c.id)}
                                    />
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
                }
                <Button
                    fluid
                    onClick={this.onClickAddCriteria}
                >
                    Add new criteria
                </Button>
            </Segment>
        );
    }

}

CriteriaEditor.propTypes = {
    mcda: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    routeTo: PropTypes.func
};

export default CriteriaEditor;