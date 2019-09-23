import Slider from 'rc-slider';
import React, {ChangeEvent, useState} from 'react';
import {Form, Grid, InputOnChangeData, Message, Segment, Table} from 'semantic-ui-react';
import {CriteriaCollection, WeightAssignment, WeightsCollection} from '../../../../core/model/mcda/criteria';
import {ICriteriaRelation} from '../../../../core/model/mcda/criteria/CriteriaRelation.type';
import {IWeightAssignment} from '../../../../core/model/mcda/criteria/WeightAssignment.type';

interface IProps {
    criteriaCollection: CriteriaCollection;
    weightAssignment: WeightAssignment;
    handleChange: (wa: WeightAssignment) => any;
    readOnly: boolean;
}

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

const fromSliderValue = (value: number) => {
    if (value < 0) {
        return -1 * (value - 1);
    }
    return 1 / (value + 1);
};

const toSliderValue = (value: number) => {
    if (value >= 1) {
        return -1 * value + 1;
    }
    return Math.pow(value, -1) - 1;
};

const pairwiseComparison = (props: IProps) => {
    const prepareState = () => {
        let cRelations: ICriteriaRelation[] = [];

        props.weightAssignment.weightsCollection.all.forEach((weight) => {
            cRelations = relations.concat(
                weight.relations.map((relation) => {
                    const toCriterion = props.criteriaCollection.findById(relation.to);
                    const nRelation: ICriteriaRelation = {
                        id: relation.id,
                        to: toCriterion ? toCriterion.id : '',
                        value: relation.value
                    };
                    return nRelation;
                })
            );
        });

        return cRelations;
    };

    const [relations, setRelations] = useState(prepareState());
    const [wa, setWa] = useState<IWeightAssignment>(props.weightAssignment.toObject());
    const [showInfo, setShowInfo] = useState<boolean>(true);

    const handleDismiss = () => setShowInfo(false);

    const handleAfterChange = (id: string | null) => (value: number) => {
        if (props.readOnly) {
            return;
        }
        const weights = props.weightAssignment.weightsCollection;
        const newWeights = weights.all.map((weight) => {
            weight.relations = weight.relations.map((relation) => {
                if (relation.id === id) {
                    relation.value = fromSliderValue(value);
                }
                return relation;
            });
            return weight;
        });

        const cWeightAssignment = WeightAssignment.fromObject(wa);
        cWeightAssignment.weightsCollection = WeightsCollection.fromObject(newWeights);
        cWeightAssignment.calculateWeights();
        return props.handleChange(cWeightAssignment);
    };

    const handleChangeSlider = (id: string) => (value: number) => {
        if (props.readOnly) {
            return;
        }
        return setRelations(relations.map((r) => {
            if (r.id === id) {
                r.value = fromSliderValue(value);
            }
            return r;
        }));
    };

    const handleLocalChange = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        if (props.readOnly) {
            return;
        }
        return setWa({
            ...wa,
            [name]: value
        });
    };

    const tipFormatter = (value: number) => value < 0 ? value - 1 : value + 1;

    let consistency = null;
    const weightAssignment = WeightAssignment.fromObject(wa);

    if (weightAssignment.meta && weightAssignment.meta.consistency) {
        consistency = weightAssignment.meta.consistency;
    }

    return (
        <div>
            {showInfo &&
            <Message onDismiss={handleDismiss}>
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
                    <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
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
                                            dots={true}
                                            dotStyle={styles.dot}
                                            trackStyle={styles.track}
                                            defaultValue={1}
                                            disabled={props.readOnly}
                                            min={-8}
                                            max={8}
                                            onAfterChange={handleAfterChange(relation.id)}
                                            onChange={handleChangeSlider(relation.id)}
                                            value={toSliderValue(relation.value)}
                                            tipFormatter={tipFormatter}
                                        />
                                    </Grid.Column>
                                    <Grid.Column width={5} textAlign="right">
                                        {relation.to.name}
                                    </Grid.Column>
                                </Grid.Row>
                            )}
                        </Grid>
                    </Segment>
                </Grid.Column>
                <Grid.Column width={7}>
                    <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                        Settings
                    </Segment>
                    <Form>
                        <Form.Field>
                            <Form.Input
                                fluid={true}
                                onBlur={handleAfterChange(null)}
                                onChange={handleLocalChange}
                                name="name"
                                type="text"
                                label="Name"
                                readOnly={props.readOnly}
                                value={wa.name}
                            />
                        </Form.Field>
                    </Form>
                    <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                        Resulting Weights
                    </Segment>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Criteria</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Sum Weight [%]</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {weightAssignment.weightsCollection.all.map((w, key) =>
                                <Table.Row key={key}>
                                    <Table.Cell>{w.criterion.name}</Table.Cell>
                                    <Table.Cell
                                        textAlign="center"
                                    >
                                        {(w.value * 100).toFixed(2)}
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    {!!consistency &&
                    <div>
                        <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
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
};

export default pairwiseComparison;
