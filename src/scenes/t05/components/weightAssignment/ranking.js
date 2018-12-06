import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Message, Segment, Table} from 'semantic-ui-react';
import DragAndDropList from '../shared/dragAndDropList';
import {MCDA} from 'core/mcda';

const WAMETHOD = 'ranking';

class Ranking extends React.Component {
    constructor(props) {
        super();

        props.mcda.addWeightAssignmentMethod(WAMETHOD);

        this.state = {
            weights: props.mcda.weights.all
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            weights: nextProps.mcda.weights.all
        });
    }

    handleChange = weights => {
        const weightsCollection = this.props.mcda.weights;
        weightsCollection.weights = weights;
        weightsCollection.calculateWeights(WAMETHOD);

        return this.props.handleChange({
            name: 'weights',
            value: weightsCollection
        });
    };

    onDragEnd = (items) => {
        const newWeights = [];

        items.forEach(item => {
            const weight = this.state.weights.filter(w => w.id === item.id)[0];

            if (weight) {
                weight.rank = item.rank;
                newWeights.push(weight);
            }
        });

        this.handleChange(newWeights);
    };

    render() {
        const {readOnly} = this.props;
        const {weights} = this.state;

        const items = weights.map(weight => {
            return {
                id: weight.id,
                data: weight.criteria.name,
                rank: weight.rank + 1
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
                            items={items}
                            onDragEnd={this.onDragEnd}
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
                                {weights.map((w, key) =>
                                    <Table.Row key={key}>
                                        <Table.Cell>{w.criteria.name}</Table.Cell>
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
    mcda: PropTypes.instanceOf(MCDA).isRequired,
    handleChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    routeTo: PropTypes.func
};

export default Ranking;