import React from 'react';
import PropTypes from 'prop-types';
import {Form, Grid, Message, Segment, Table} from 'semantic-ui-react';
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

const fromSliderValue = value => {
    if (value < 0) {
        return -1 * (value - 1);
    }
    return 1 / (value + 1);
};

const toSliderValue = value => {
    if (value >= 1) {
        return -1 * value + 1;
    }
    return Math.pow(value, -1) - 1;
};

class PairwiseComparison extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            relations: this.prepareState(props),
            wa: this.props.weightAssignment.toObject(),
            showInfo: true
        };
    }

    handleDismiss = () => this.setState({showInfo: false});

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
        if (this.props.readOnly) {
            return;
        }
        const weights = this.props.weightAssignment.weightsCollection;
        const newWeights = weights.all.map(weight => {
            weight.relations = weight.relations.map(relation => {
                if (relation.id === id) {
                    relation.value = fromSliderValue(value);
                }
                return relation;
            });
            return weight.toObject();
        });

        const weightAssignment = WeightAssignment.fromObject(this.state.wa);
        weightAssignment.weightsCollection = WeightsCollection.fromArray(newWeights);
        weightAssignment.calculateWeights();
        return this.props.handleChange(weightAssignment);
    };

    handleChangeSlider = id => value => {
        if (this.props.readOnly) {
            return;
        }
        this.setState({
            relations: this.state.relations.map(r => {
                if (r.id === id) {
                    r.value = fromSliderValue(value);
                }
                return r;
            })
        });
    };

    handleLocalChange = (e, {name, value}) => {
        if (this.props.readOnly) {
            return;
        }
        return this.setState(prevState => ({
            wa: {
                ...prevState.wa,
                [name]: value
            }
        }));
    };

    render() {
        const {readOnly, weightAssignment} = this.props;
        const {relations} = this.state;

        let consistency = null;

        if (weightAssignment.meta && weightAssignment.meta.consistency) {
            consistency = weightAssignment.meta.consistency;
        }

        return (
            <div>
                {this.state.showInfo &&
                <Message onDismiss={this.handleDismiss}>
                    <Message.Header>Weight Assignment: Pairwise Comparison</Message.Header>
                    <p>Compare all criteria with each other, by moving the slider to either the left or the right side,
                        depending which criterion is more and for instance how much more important. The further
                        the slider is at one side, the bigger is the importance of the related criterion in comparison
                        to the criterion on the other side. The slider values can be translated by following key:</p>
                    <p>0: Equally important | 3: Slightly more important | 5: Much more important | 7: Far more
                        important | 8: Extremely more important</p>
                    <p>If there are more than two criteria, the consistency ratio is printed on the bottom right. Its
                        value should be smaller than 0.1, to have consistent weights.</p>
                </Message>
                }
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
                                                defaultValue={1}
                                                disabled={readOnly}
                                                min={-8}
                                                max={8}
                                                onAfterChange={this.handleAfterChange(relation.id)}
                                                onChange={this.handleChangeSlider(relation.id)}
                                                value={toSliderValue(relation.value)}
                                                tipFormatter={value => value < 0 ? value - 1 : value + 1}
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
                            Settings
                        </Segment>
                        <Form>
                            <Form.Field>
                                <Form.Input
                                    fluid
                                    onBlur={this.handleAfterChange(null)}
                                    onChange={this.handleLocalChange}
                                    name='name'
                                    type='text'
                                    label='Name'
                                    readOnly={readOnly}
                                    value={this.state.wa.name}
                                />
                            </Form.Field>
                        </Form>
                        <Segment textAlign='center' inverted color='grey' secondary>
                            Resulting Weights
                        </Segment>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Criteria</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Sum Weight [%]</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {weightAssignment.weightsCollection.all.map((w, key) =>
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
                        {!!consistency &&
                        <div>
                            <Segment textAlign='center' inverted color='grey' secondary>
                                Consistency Ratio
                            </Segment>
                            <Message
                                negative={consistency >= 0.1}
                                positive={consistency < 0.1}
                                style={{textAlign: 'center'}}
                            >
                                <Message.Header>
                                    CR = {consistency.toFixed(3)} {consistency >= 0.1 ? '>=' : '<'} 0.100
                                </Message.Header>
                                {consistency < 0.1
                                    ?
                                    <p>Your comparisons are reasonably consistent.</p>
                                    :
                                    <p>Inconsistent result: Please check your comparison values.</p>
                                }
                            </Message>
                        </div>
                        }
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