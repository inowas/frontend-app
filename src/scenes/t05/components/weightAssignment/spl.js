import React from 'react';
import PropTypes from 'prop-types';
import {Form, Grid, Input, Message, Segment, Table} from 'semantic-ui-react';
import {WeightAssignment} from 'core/model/mcda/criteria';

class SimpleWeightAssignment extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            sum: props.weightAssignment.weightsCollection.sumBy('value'),
            wa: props.weightAssignment.toObject(),
            showInfo: true
        };
    }

    handleDismiss = () => this.setState({showInfo: false});

    onLocalChange = (e, {name, value}) => this.setState(prevState => ({
        wa: {
            ...prevState.wa,
            [name]: value
        }
    }));

    onBlurValue = () => {
        const wa = WeightAssignment.fromObject(this.state.wa);
        wa.calculateWeights();
        return this.props.handleChange(wa);
    };

    onChangeValue = (e, {name, value}) => {
        const wa = this.state.wa;
        wa.weights = wa.weights.map(weight => {
            if (name === weight.id) {
                weight.initialValue = value;
            }
            return weight;
        });
        return this.setState({
            wa: wa
        });
    };

    render() {
        const {readOnly} = this.props;
        const {wa} = this.state;

        return (
            <div>
                {this.state.showInfo &&
                <Message onDismiss={this.handleDismiss}>
                    <Message.Header>Weight Assignment: Free Input</Message.Header>
                    <p>Assign values to each criterion completely free by filling the input fields. The given values are
                        then normalized and calculated to weights between 0 and 1 in relation to the other values.</p>
                </Message>
                }

                {wa.weights.length > 0 &&
                <Grid columns={2}>
                    <Grid.Column>
                        <Segment textAlign='center' inverted color='grey' secondary>
                            Editor
                        </Segment>
                        <Segment>
                            <Grid>
                                {wa.weights.map((weight, key) =>
                                    <Grid.Row key={key}>
                                        <Grid.Column width={5}>
                                            {weight.criterion.name}
                                        </Grid.Column>
                                        <Grid.Column width={11}>
                                            <Input
                                                type='number'
                                                disabled={readOnly}
                                                name={weight.id}
                                                onBlur={this.onBlurValue}
                                                onChange={this.onChangeValue}
                                                value={weight.initialValue}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                )}
                            </Grid>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <Segment textAlign='center' inverted color='grey' secondary>
                            Settings
                        </Segment>
                        <Form>
                            <Form.Input
                                fluid
                                onBlur={this.onBlurValue}
                                onChange={this.onLocalChange}
                                name='name'
                                type='text'
                                label='Name'
                                value={wa.name}
                            />
                        </Form>
                        <Segment textAlign='center' inverted color='grey' secondary>
                            Weight Assignment
                        </Segment>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Criteria</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Sum Weight [%]</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.props.weightAssignment.weightsCollection.all.map((w, key) =>
                                    <Table.Row key={key}>
                                        <Table.Cell>{w.criterion.name}</Table.Cell>
                                        <Table.Cell
                                            textAlign='center'>
                                            {(100 * w.value).toFixed(2)}
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid>
                }
            </div>
        );
    }

}

SimpleWeightAssignment.propTypes = {
    weightAssignment: PropTypes.instanceOf(WeightAssignment).isRequired,
    handleChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool
};

export default SimpleWeightAssignment;