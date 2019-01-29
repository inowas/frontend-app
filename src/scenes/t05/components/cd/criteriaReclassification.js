import PropTypes from 'prop-types';
import React from 'react';
import {Criterion, Rule} from 'core/model/mcda/criteria';
import {Button, Grid, Icon, Message, Segment, Table} from 'semantic-ui-react';
import CriteriaReclassificationModal from './criteriaReclassificationModal';
import {CartesianGrid, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import * as math from 'mathjs'
import CriteriaReclassificationDiscrete from './criteriaReclassificationDiscrete';

class CriteriaReclassification extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedRule: null,
            showInfo: true
        }
    }

    handleCloseModal = () => this.setState({selectedRule: null});

    handleDismiss = () => this.setState({showInfo: false});

    handleAddRule = () => {
        const rule = new Rule();
        this.setState({
            selectedRule: rule.toObject()
        });
    };

    handleEditRule = id => {
        const rule = this.props.criterion.rulesCollection.findById(id);
        if (rule) {
            this.setState({
                selectedRule: rule.toObject()
            });
        }
    };

    handleRemoveRule = id => {
        const criterion = this.props.criterion;
        criterion.rulesCollection.items = criterion.rulesCollection.all.filter(rule => rule.id !== id);
        criterion.calculateSuitability();
        return this.props.onChange(criterion);
    };

    handleClickCalculate = () => {
        const criterion = this.props.criterion;
        criterion.calculateSuitability();
        return this.props.onChange(criterion);
    };

    handleChangeRule = rule => {
        if (!(rule instanceof Rule)) {
            throw new Error('Rule expected to be instance of Rule.');
        }
        rule.from = parseFloat(rule.from);
        rule.to = parseFloat(rule.to);
        const criterion = this.props.criterion;
        criterion.rulesCollection.update(rule);
        criterion.calculateSuitability();
        this.handleCloseModal();
        return this.props.onChange(criterion);
    };

    renderEditorContinuous() {
        const {showInfo} = this.state;
        const criterion = this.props.criterion;
        const raster = criterion.tilesCollection.first;

        if (!criterion.rulesCollection || criterion.rulesCollection.length === 0) {
            return (
                <Message warning>
                    <Message.Header>No data found</Message.Header>
                    <p>You need to upload a raster file before adding reclassification rules.</p>
                </Message>
            )
        }

        const rules = criterion.rulesCollection.orderBy('to', 'desc');

        const data = [];
        for (let x = raster.min; x <= raster.max; x += (raster.max - raster.min) / 100) {
            const filteredRules = rules.findByValue(x);
            if (filteredRules.length > 0) {
                const rule = filteredRules[0];
                if (rule.type === 'calc') {
                    const value = math.eval(rule.expression, {min: raster.min, max: raster.max, x: x});
                    data.push({x: x, y: value});
                }
                if (rule.type === 'fixed') {
                    data.push({x: x, y: parseFloat(rule.value)});
                }
            }
            if (filteredRules.length === 0) {
                data.push({x: x, y: 0});
            }
        }

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        {showInfo &&
                        <Message onDismiss={this.handleDismiss}>
                            <Message.Header>Reclassification for continuous values</Message.Header>
                            <p>All suitabilities, whose raster values are not covered by the rules, will be set with
                                0.</p>
                            <p>[{raster.min.toFixed(3)}, {raster.max.toFixed(3)}]</p>
                        </Message>
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={5}>
                        <Segment textAlign='center' inverted color='grey' secondary>
                            Commands
                        </Segment>
                        <Segment>
                            <Button primary icon fluid labelPosition='left' onClick={this.handleAddRule}>
                                <Icon name='add'/>
                                Add Rule
                            </Button>
                            <br/>
                            <Button positive icon fluid labelPosition='left' onClick={this.handleClickCalculate}>
                                <Icon name='calculator'/>
                                Calculate Suitability
                            </Button>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>From</Table.HeaderCell>
                                    <Table.HeaderCell>To</Table.HeaderCell>
                                    <Table.HeaderCell>Suitability Index</Table.HeaderCell>
                                    <Table.HeaderCell/>
                                </Table.Row>
                                {rules.all.map((rule, key) =>
                                    <Table.Row key={key}>
                                        <Table.Cell>
                                            {rule.fromOperator} {rule.from}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {rule.toOperator} {rule.to}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {rule.type === 'calc' ? rule.expression : rule.value}
                                        </Table.Cell>
                                        <Table.Cell textAlign='right'>
                                            <Button.Group>
                                                {this.props.criterion.rulesCollection.isError(rule) &&
                                                <Button negative icon='warning sign'/>
                                                }
                                                <Button onClick={() => this.handleEditRule(rule.id)} icon='edit'/>
                                                <Button onClick={() => this.handleRemoveRule(rule.id)} icon='trash'/>
                                            </Button.Group>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Header>
                        </Table>
                    </Grid.Column>
                </Grid.Row>
                {rules.length > 0 &&
                <Grid.Row>
                    <Grid.Column width={16}>
                        <ScatterChart
                            width={900}
                            height={250}
                            margin={{top: 5, right: 30, left: 20, bottom: 5}}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis type="number" dataKey={'x'} domain={[Math.floor(raster.min), Math.ceil(raster.max)]}
                                   name='criterion'/>
                            <YAxis type="number" dataKey={'y'} name='suitability'/>
                            <Scatter
                                name="Suitability"
                                line={{stroke: '#8884d8', strokeWidth: 1}}
                                data={data}
                                shape={() => {
                                    return null;
                                }} //<circle cx={1} cy={1} r={2} stroke="black" strokeWidth={1} fill="#8884d8"/>
                                dataKey='suitability'
                            />
                        </ScatterChart>
                    </Grid.Column>
                </Grid.Row>
                }
            </Grid>
        );
    }

    render() {
        const {criterion} = this.props;
        const rule = this.state.selectedRule;

        return (
            <div>
                {rule &&
                <CriteriaReclassificationModal
                    onSave={this.handleChangeRule}
                    onClose={this.handleCloseModal}
                    rule={Rule.fromObject(rule)}
                />
                }
                {criterion.type === 'continuous' &&
                this.renderEditorContinuous()
                }
                {criterion.type === 'discrete' &&
                <CriteriaReclassificationDiscrete
                    criterion={this.props.criterion}
                    onChange={() => null}
                />
                }
            </div>
        );
    }
}

CriteriaReclassification.propTypes = {
    criterion: PropTypes.instanceOf(Criterion).isRequired,
    onChange: PropTypes.func.isRequired
};

export default CriteriaReclassification;
