import PropTypes from 'prop-types';
import React from 'react';
import {Criterion, Rule} from '../../../../core/model/mcda/criteria';
import {Button, Grid, Icon, Message, Segment, Table} from 'semantic-ui-react';
import CriteriaReclassificationModal from './criteriaReclassificationModal';
import {CartesianGrid, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import * as math from 'mathjs'
import CriteriaReclassificationDiscrete from './criteriaReclassificationDiscrete';
import {dropData} from '../../../../services/api';

class CriteriaReclassification extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedRule: null,
            showInfo: true
        }
    }

    saveRaster(criterion) {
        dropData(
            criterion.suitability.data,
            response => {
                criterion.suitability.url = response.filename;
                this.props.onChange(criterion);
            },
            response => {
                throw new Error(response);
            }
        );
    }

    handleCloseModal = () => this.setState({selectedRule: null});

    handleDismiss = () => this.setState({showInfo: false});

    handleAddRule = () => {
        if (this.props.readOnly) {
            return null;
        }
        const rule = new Rule();
        this.setState({
            selectedRule: rule.toObject()
        });
    };

    handleEditRule = id => {
        if (this.props.readOnly) {
            return null;
        }
        const rule = this.props.criterion.rulesCollection.findById(id);
        if (rule) {
            this.setState({
                selectedRule: rule.toObject()
            });
        }
    };

    handleRemoveRule = id => {
        if (this.props.readOnly) {
            return null;
        }
        const criterion = this.props.criterion;
        criterion.rulesCollection.items = criterion.rulesCollection.all.filter(rule => rule.id !== id);
        criterion.calculateSuitability();
        criterion.step = 2;
        return this.props.onChange(criterion);
    };

    handleClickCalculate = () => {
        if (this.props.readOnly) {
            return null;
        }
        const criterion = this.props.criterion;
        criterion.calculateSuitability();
        criterion.step = 3;
        return this.saveRaster(criterion);
    };

    handleChangeRule = rule => {
        if (this.props.readOnly) {
            return null;
        }
        if (!(rule instanceof Rule)) {
            throw new Error('Rule expected to be instance of Rule.');
        }
        rule.from = parseFloat(rule.from);
        rule.to = parseFloat(rule.to);
        const criterion = this.props.criterion;
        criterion.rulesCollection.update(rule);
        criterion.step = 2;
        this.handleCloseModal();
        return this.props.onChange(criterion);
    };

    renderEditorContinuous() {
        const {showInfo} = this.state;
        const {criterion, readOnly} = this.props;
        const raster = criterion.raster;

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
                {showInfo &&
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Message onDismiss={this.handleDismiss}>
                            <Message.Header>Reclassification for continuous values</Message.Header>
                            <p>
                                Classes are defined by intervals of cell values and a corresponding suitability value
                                or formula to calculate the suitability value. All cells, which are not covered by the
                                rules, will be set with value 1. In formula you can use following commands:
                            </p>
                            <p>
                                x ... current value | max ... maximum value | min ... minimum value | sqrt(x) ... square
                                root | sin(x), cos(x), etc. ... mathematical functions <br/> x + 1, x - 1, x / max, -1 *
                                x ... basic mathematical operations | x^(-1*sin(x/max)) ... complex equations
                            </p>
                            <p>
                                It is also possible to choose a color and name for each value for a better
                                visualization of the criteria data in the next step. It is necessary to click on the
                                'Perform Reclassification' button after making changes.
                            </p>
                            <p>Data interval: [{raster.min.toFixed(3)}, {raster.max.toFixed(3)}]</p>
                        </Message>
                    </Grid.Column>
                </Grid.Row>
                }
                <Grid.Row>
                    <Grid.Column width={5}>
                            <Segment textAlign='center' inverted color='grey' secondary>
                                Commands
                            </Segment>
                            <Segment>
                                <Button disabled={readOnly} primary icon fluid labelPosition='left' onClick={this.handleAddRule}>
                                    <Icon name='add'/>
                                    Add Class
                                </Button>
                                <br/>
                                <Button disabled={readOnly} positive icon fluid labelPosition='left' onClick={this.handleClickCalculate}>
                                    <Icon name='calculator'/>
                                    Perform reclassification
                                </Button>
                            </Segment>
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell/>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>From</Table.HeaderCell>
                                    <Table.HeaderCell>To</Table.HeaderCell>
                                    <Table.HeaderCell>Class</Table.HeaderCell>
                                    <Table.HeaderCell/>
                                </Table.Row>
                                {rules.all.map((rule, key) =>
                                    <Table.Row key={key}>
                                        <Table.Cell>
                                            <Icon name='circle' style={{color: rule.color}}/>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {rule.name}
                                        </Table.Cell>
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
                                            {!readOnly &&
                                            <Button.Group>
                                                {this.props.criterion.rulesCollection.isError(rule) &&
                                                <Button negative icon='warning sign'/>
                                                }
                                                <Button onClick={() => this.handleEditRule(rule.id)} icon='edit'/>
                                                <Button onClick={() => this.handleRemoveRule(rule.id)} icon='trash'/>
                                            </Button.Group>
                                            }
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
                            <YAxis type="number" dataKey={'y'} domain={[0, 1]} name='suitability'/>
                            <Scatter
                                name="Suitability"
                                line={{stroke: '#8884d8', strokeWidth: 1}}
                                data={data}
                                shape={() => {
                                    return null;
                                }}
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
        const {criterion, readOnly} = this.props;
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
                    criterion={criterion}
                    onChange={this.props.onChange}
                    readOnly={readOnly}
                />
                }
            </div>
        );
    }
}

CriteriaReclassification.propTypes = {
    criterion: PropTypes.instanceOf(Criterion).isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool
};

export default CriteriaReclassification;
