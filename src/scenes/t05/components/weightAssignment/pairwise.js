import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Message, Segment, Table} from 'semantic-ui-react';
import Slider from 'rc-slider';
import {CriteriaCollection, WeightAssignment, WeightsCollection} from 'core/model/mcda/criteria';

const styles = {
    dot: {
        border: '1px solid #e9e9e9',
        borderRadius: 0,
        marginLeft: 0,
        width: '1px'
    },
    track: {
        backgroundColor: '#e9e9e9'
    }
};

const SliderWithTooltip = Slider.createSliderWithTooltip(Slider);

class PairwiseComparison extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            relations: this.prepareState(props)
        };
    }

    prepareState = (props) => {
        let relations = [];

        props.weightAssignment.weightsCollection.all.forEach(weight => {
            relations = relations.concat(
                weight.relations.map((relation) => {
                    return {
                        id: relation.id,
                        from: weight.criterion,
                        to: props.criteriaCollection.findById(relation.to),
                        value: relation.value
                    }
                })
            )
        });

        return relations;
    };

    handleAfterChange = id => value => {
        const weights = this.props.weightAssignment.weightsCollection;
        const newWeights = weights.all.map(weight => {
            weight.relations = weight.relations.map(relation => {
                if (relation.id === id) {
                    relation.value = value;
                }
                return relation;
            });
            return weight;
        });

        const weightAssignment = this.props.weightAssignment;
        weightAssignment.weightsCollection = WeightsCollection.fromArray(newWeights);
        weightAssignment.calculateWeights();

        this.props.handleChange({
            name: 'weights',
            value: weightAssignment
        });
    };

    handleChangeSlider = id => value => {
        this.setState({
            relations: this.state.relations.map(r => {
                if (r.id === id) {
                    r.value = value;
                }
                return r;
            })
        });
    };

    render() {
        const {readOnly} = this.props;
        const {relations} = this.state;

        return (
            <div>
                <Message>
                    <Message.Header>Weight Assignment: Pairwise comparison method</Message.Header>
                    <p>You can perform more of the weight assignment methods and compare the results in the end.</p>
                    <p>...</p>
                </Message>

                {relations.length > 0 &&
                <Grid>
                    <Grid.Column width={9}>
                        <Segment textAlign='center' inverted color='grey' secondary>
                            Comparison
                        </Segment>
                        <Segment>
                            <Grid>
                                {relations.map((relation, key) =>
                                    <Grid.Row key={key}>
                                        <Grid.Column width={5}>
                                            {relation.from.name}
                                        </Grid.Column>
                                        <Grid.Column width={6}>
                                            <SliderWithTooltip
                                                dots
                                                dotStyle={styles.dot}
                                                trackStyle={styles.track}
                                                defaultValue={0}
                                                disabled={readOnly}
                                                min={-9}
                                                max={9}
                                                onAfterChange={this.handleAfterChange(relation.id)}
                                                onChange={this.handleChangeSlider(relation.id)}
                                                value={relation.value}
                                            />
                                        </Grid.Column>
                                        <Grid.Column width={5} textAlign='right'>
                                            {relation.to.name}
                                        </Grid.Column>
                                    </Grid.Row>
                                )}
                            </Grid>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={7}>
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

PairwiseComparison.propTypes = {
    criteriaCollection: PropTypes.instanceOf(CriteriaCollection).isRequired,
    weightAssignment: PropTypes.instanceOf(WeightAssignment).isRequired,
    handleChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool
};

export default PairwiseComparison;