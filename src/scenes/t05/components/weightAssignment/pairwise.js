import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import {Grid, Message, Segment, Table} from 'semantic-ui-react';
import {MCDA} from 'core/mcda';
import Slider from 'rc-slider';

const WAMETHOD = 'pwc';

class PairwiseComparison extends React.Component {
    constructor(props) {
        super();

        props.mcda.addWeightAssignmentMethod(WAMETHOD);

        console.log(props);

        this.state = {
            relations: this.prepareState(props)
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState = {
            relations: this.prepareState(nextProps)
        };
    }

    prepareState = (props) => {
        let relations = [];

        props.mcda.weights.findByMethod(WAMETHOD).forEach(weight =>
            relations = relations.concat(
                weight.relations.map((relation, key) => {
                    return {
                        id: uuidv4(),
                        from: weight.criteria,
                        to: props.mcda.criteria.findById(relation.to),
                        value: relation.value
                    }
                })
            )
        );

        return relations;
    };

    handleChange = weights => {
        const weightsCollection = this.props.mcda.weights;
        weightsCollection.weights = weights;
        weightsCollection.calculateWeights(WAMETHOD);

        return this.props.handleChange({
            name: 'weights',
            value: weightsCollection
        });
    };

    handleChangeSlider = id => value => {
        console.log('CHANGE SLIDE', id, value);

        return this.setState({
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

        console.log('PAIRWISE STATE', this.state);

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
                                            <Slider
                                                defaultValue={0}
                                                disabled={readOnly}
                                                min={-9}
                                                max={9}
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
                                {this.props.mcda.weights.findByMethod(WAMETHOD).map((w, key) =>
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

PairwiseComparison.propTypes = {
    mcda: PropTypes.instanceOf(MCDA).isRequired,
    handleChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    routeTo: PropTypes.func
};

export default PairwiseComparison;