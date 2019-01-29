import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Input, Message, Segment, Table} from 'semantic-ui-react';
import {WeightsCollection, WeightAssignment} from 'core/model/mcda/criteria';
import {cloneDeep} from 'lodash';

class SimpleWeightAssignment extends React.Component {

    constructor(props) {
        super();

        this.state = {
            sum: props.weightAssignment.weightsCollection.sumBy('value'),
            weights: props.weightAssignment.weightsCollection.toArray()
        };
    }

    handleChange = weights => {
        const weightAssignment = this.props.weightAssignment;
        weightAssignment.weightsCollection = WeightsCollection.fromArray(weights);

        return this.props.handleChange({
            name: 'weights',
            value: weightAssignment
        });
    };

    onBlur = () => {
        const sum = WeightsCollection.fromArray(this.state.weights).sumBy('value');
        const newWeights = cloneDeep(this.state.weights).map(w => {
            w.value = w.value / sum;
            return w;
        });
        this.handleChange(newWeights);
    };

    onChange = (e, {name, value}) => {
        const newWeights = this.state.weights.map(weight => {
            if (name === weight.id) {
                weight.value = parseFloat(value);
            }
            return weight;
        });
        return this.setState({
            weights: newWeights
        });
    };

    render() {
        const {readOnly} = this.props;

        return (
            <div>
                <Message>
                    <Message.Header>Weight Assignment: Simple</Message.Header>
                    <p>You can perform more of the weight assignment methods and compare the results in the end.</p>
                    <p>Simple Assignment: assign weights to the criteria completely free by filling the input
                        fields.</p>
                </Message>

                {this.state.weights.length > 0 &&
                <Grid columns={2}>
                    <Grid.Column>
                        <Segment textAlign='center' inverted color='grey' secondary>
                            Editor
                        </Segment>
                        <Segment>
                            <Grid>
                                {this.state.weights.map((weight, key) =>
                                    <Grid.Row key={key}>
                                        <Grid.Column width={5}>
                                            {weight.criterion.name}
                                        </Grid.Column>
                                        <Grid.Column width={11}>
                                            <Input
                                                type='number'
                                                disabled={readOnly}
                                                name={weight.id}
                                                onBlur={this.onBlur}
                                                onChange={this.onChange}
                                                value={weight.value}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                )}
                            </Grid>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
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