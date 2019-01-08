import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Message, Segment, Table} from 'semantic-ui-react';
import DragAndDropList from '../shared/dragAndDropList';
import {WeightAssignment, WeightsCollection} from 'core/mcda/criteria';
import {pure} from 'recompose';
import AbstractCollection from 'core/AbstractCollection';

class Ranking extends React.Component {
    handleChange = weights => {
        const weightAssignment = this.props.weightAssignment;
        weightAssignment.weightsCollection = WeightsCollection.fromArray(weights);
        weightAssignment.calculateWeights();

        return this.props.handleChange({
            name: 'weights',
            value: weightAssignment
        });
    };

    handleChangeOrder = (items) => {
        const newWeights = [];

        items.all.forEach(item => {
            const weight = this.props.weightAssignment.weightsCollection.findById(item.id);

            if (weight) {
                weight.rank = item.rank;
                newWeights.push(weight);
            }
        });

        this.handleChange(newWeights);
    };

    render() {
        const {readOnly} = this.props;
        const weights = this.props.weightAssignment.weightsCollection.orderBy('rank');

        const items = weights.all.map(weight => {
            return {
                id: weight.id,
                data: weight.criterion.name,
                rank: weight.rank
            };
        });

        return (
            <div>
                <Message>
                    <Message.Header>Weight Assignment: Ranking Method</Message.Header>
                    <p>You can perform more of the weight assignment methods and compare the results in the end.</p>
                    <p>Ranking: place the criteria in your preferred order by drag and drop or using the arrow buttons
                        on the right.</p>
                </Message>

                {weights.length > 0 &&
                <Grid columns={2}>
                    <Grid.Column>
                        <Segment textAlign='center' inverted color='grey' secondary>
                            Most Important
                        </Segment>
                        <DragAndDropList
                            items={AbstractCollection.fromArray(items)}
                            onChange={this.handleChangeOrder}
                            readOnly={readOnly}
                        />
                        <Segment textAlign='center' inverted color='grey' secondary>
                            Least Important
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
                                {weights.all.map((w, key) =>
                                    <Table.Row key={key}>
                                        <Table.Cell>{w.criterion.name}</Table.Cell>
                                        <Table.Cell
                                            textAlign='center'>
                                            {(w.value * 100).toFixed(2)}
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

Ranking.propTypes = {
    weightAssignment: PropTypes.instanceOf(WeightAssignment).isRequired,
    handleChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool
};

export default pure(Ranking);