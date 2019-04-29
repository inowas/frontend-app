import React from 'react';
import PropTypes from 'prop-types';
import {Form, Grid, Message, Segment, Table} from 'semantic-ui-react';
import DragAndDropList from '../shared/dragAndDropList';
import {WeightAssignment, WeightsCollection} from 'core/model/mcda/criteria';
import {pure} from 'recompose';
import AbstractCollection from 'core/model/collection/AbstractCollection';

class Ranking extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            wa: props.weightAssignment.toObject(),
            showInfo: true
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            wa: nextProps.weightAssignment.toObject()
        })
    }

    handleDismiss = () => this.setState({showInfo: false});

    handleChangeState = () => this.props.handleChange(WeightAssignment.fromObject(this.state.wa));

    handleChangeSubMethod = (e, {name, value}) => {
        if (this.props.readOnly) {
            return;
        }
        const wa = WeightAssignment.fromObject(this.state.wa);

        if (value === 'exp') {
            wa.subParam = 2;
        }

        wa[name] = value;
        wa.calculateWeights();
        this.props.handleChange(wa);
    };

    handleChangeSubParam = () => {
        if (this.props.readOnly) {
            return;
        }
        const wa = WeightAssignment.fromObject(this.state.wa);
        wa.calculateWeights();
        this.props.handleChange(wa);
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

    handleChange = weights => {
        if (this.props.readOnly) {
            return;
        }
        const weightAssignment = WeightAssignment.fromObject(this.state.wa);
        weightAssignment.weightsCollection = WeightsCollection.fromArray(weights);
        weightAssignment.calculateWeights();

        return this.props.handleChange(weightAssignment);
    };

    handleChangeOrder = (items) => {
        if (this.props.readOnly) {
            return;
        }
        const newWeights = [];

        items.all.forEach(item => {
            const weight = this.props.weightAssignment.weightsCollection.findById(item.id);

            if (weight) {
                weight.initialValue = item.rank;
                newWeights.push(weight.toObject());
            }
        });

        this.handleChange(newWeights);
    };

    render() {
        const {readOnly} = this.props;
        const weights = this.props.weightAssignment.weightsCollection.orderBy('initialValue');

        const items = weights.all.map(weight => {
            return {
                id: weight.id,
                data: weight.criterion.name,
                rank: weight.initialValue
            };
        });

        return (
            <div>
                {this.state.showInfo &&
                <Message onDismiss={this.handleDismiss}>
                    <Message.Header>Weight Assignment: Ranking</Message.Header>
                    <p>Place the criteria in your preferred order by drag and drop or using the arrow buttons. The
                        higher a position of a criterion, the more important and the higher is its weight. You can
                        choose between two methods:</p>
                    <p><b>Rank sum weight:</b> (n - rj + 1) / &Sigma;(n - rj + 1)</p>
                    <p><b>Reciprocal weight:</b> (1 / rj) / &Sigma;(1 / rj)</p>
                    <p><b>Exponential weight:</b> (n - rj + 1) ^ z / &Sigma;(n - rj + 1) ^ z</p>
                    <p>... for n = number of criteria, j = 1...n, rj = rank of criteria j and &Sigma; sum from j to n, exponent z</p>
                </Message>
                }
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
                            Settings
                        </Segment>
                        <Form>
                            <Form.Field>
                                <Form.Input
                                    fluid
                                    onBlur={this.handleChangeState}
                                    onChange={this.handleLocalChange}
                                    name='name'
                                    type='text'
                                    label='Name'
                                    readOnly={readOnly}
                                    value={this.state.wa.name}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Form.Select
                                    fluid
                                    label='Method'
                                    onChange={this.handleChangeSubMethod}
                                    options={[
                                        {key: 'sum', text: 'Rank sum weight', value: 'sum'},
                                        {key: 'rec', text: 'Rank reciprocal weight', value: 'rec'},
                                        {key: 'exp', text: 'Rank exponent', value: 'exp'}
                                    ]}
                                    name='subMethod'
                                    readOnly={readOnly}
                                    value={!this.state.wa.subMethod || this.state.wa.subMethod}
                                />
                            </Form.Field>
                            {this.state.wa.subMethod === 'exp' &&
                                <Form.Field>
                                    <Form.Input
                                        fluid
                                        onBlur={this.handleChangeSubParam}
                                        onChange={this.handleLocalChange}
                                        name='subParam'
                                        type='number'
                                        label='Exponent'
                                        readOnly={readOnly}
                                        value={this.state.wa.subParam}
                                    />
                                </Form.Field>
                            }
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