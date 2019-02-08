import PropTypes from 'prop-types';
import React from 'react';
import {Criterion, Rule} from 'core/model/mcda/criteria';
import {Button, Form, Grid, Icon, Message, Radio, Table} from 'semantic-ui-react';
import CriteriaRasterMap from './criteriaRasterMap';
import {rainbowFactory} from '../../../shared/rasterData/helpers';
import {heatMapColors} from '../../defaults/gis';

class CriteriaDataConstraints extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            criterion: props.criterion.toObject()
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            criterion: nextProps.criterion.toObject()
        })
    }

    handleDismiss = () => this.setState({showInfo: false});

    handleAddConstraint = () => {
        const rule = new Rule();
        rule.value = 0;
        const criterion = Criterion.fromObject(this.state.criterion);
        criterion.constraintRules.add(rule);
        this.setState({
            criterion: criterion.toObject()
        });
    };

    handleLocalChange = (id, recalculate = false) => (e, {name, value}) => {
        const criterion = Criterion.fromObject(this.state.criterion);
        criterion.constraintRules.items = criterion.constraintRules.all.map(c => {
            if (c.id === id) {
                c[name] = value;
            }
            return c;
        });
        this.setState({
            criterion: criterion.toObject()
        }, () => {
            if (recalculate) {
                this.handleChange();
            }
        });
    };

    handleChange = () => {
        const criterion = Criterion.fromObject(this.state.criterion);
        criterion.calculateConstraints();
        this.props.onChange(criterion);
    };

    handleRemoveRule = id => {
        const criterion = Criterion.fromObject(this.state.criterion);
        criterion.constraintRules.items = criterion.constraintRules.all.filter(rule => rule.id !== id);
        criterion.calculateConstraints();
        return this.props.onChange(criterion);
    };

    handleToggleRule = rule => {
        if (!(rule instanceof Rule)) {
            throw new Error('Rule expected to be instance of Rule.');
        }
        rule.value = rule.value === 1 ? 0 : 1;
        const criterion = this.props.criterion;
        criterion.constraintRules.update(rule);
        criterion.constraintRaster = criterion.suitability;
        criterion.calculateConstraints();
        return this.props.onChange(criterion);
    };

    renderEditorDiscrete() {
        const criterion = this.props.criterion;
        const constraints = criterion.constraintRules.orderBy('from', 'asc');
        const legend = rainbowFactory({min: 0, max: 1}, heatMapColors.default);

        return (
            <Grid.Row>
                <Grid.Column width={5}>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Value</Table.HeaderCell>
                                <Table.HeaderCell textAlign='center'>Suitable?</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {constraints.all.map((rule, key) =>
                                <Table.Row key={key}>
                                    <Table.Cell textAlign='right'>{rule.from}</Table.Cell>
                                    <Table.Cell textAlign='center'>
                                        <Radio checked={rule.value === 1} onChange={() => this.handleToggleRule(rule)}
                                               toggle/>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </Grid.Column>
                <Grid.Column width={11}>
                    <CriteriaRasterMap
                        legend={legend}
                        raster={criterion.constraintRaster}
                        showBasicLayer={false}
                    />
                </Grid.Column>
            </Grid.Row>
        );
    }

    renderEditorContinuous() {
        const criterion = Criterion.fromObject(this.state.criterion);
        const constraints = criterion.constraintRules.orderBy('from', 'asc');
        const legend = rainbowFactory({min: 0, max: 1}, heatMapColors.default);

        return (
            <Grid.Row>
                <Grid.Column width={8}>
                    {constraints.length > 0 &&
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>From</Table.HeaderCell>
                                <Table.HeaderCell>To</Table.HeaderCell>
                                <Table.HeaderCell/>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {constraints.all.map((rule, key) =>
                                <Table.Row key={key}>
                                    <Table.Cell>
                                        <Form>
                                            <Form.Group widths='equal'>
                                                <Form.Select
                                                    fluid
                                                    options={[
                                                        {key: 0, text: '>', value: '>'},
                                                        {key: 1, text: '>=', value: '>='}
                                                    ]}
                                                    placeholder='Operator'
                                                    name={'fromOperator'}
                                                    onChange={this.handleLocalChange(rule.id, true)}
                                                    value={rule.fromOperator}
                                                />
                                                <Form.Input
                                                    fluid
                                                    name='from'
                                                    onBlur={this.handleChange}
                                                    onChange={this.handleLocalChange(rule.id)}
                                                    type='number'
                                                    value={rule.from}
                                                />
                                            </Form.Group>
                                        </Form>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Form>
                                            <Form.Group widths='equal'>
                                                <Form.Select
                                                    fluid
                                                    options={[
                                                        {key: 0, text: '<', value: '<'},
                                                        {key: 1, text: '<=', value: '<='}
                                                    ]}
                                                    placeholder='Operator'
                                                    name='toOperator'
                                                    onChange={this.handleLocalChange(rule.id, true)}
                                                    value={rule.toOperator}
                                                />
                                                <Form.Input
                                                    fluid
                                                    type='number'
                                                    onBlur={this.handleChange}
                                                    onChange={this.handleLocalChange(rule.id)}
                                                    name='to'
                                                    value={rule.to}
                                                />
                                            </Form.Group>
                                        </Form>
                                    </Table.Cell>
                                    <Table.Cell textAlign='right'>
                                        <Button.Group>
                                            <Button onClick={() => this.handleRemoveRule(rule.id)} icon='trash'/>
                                        </Button.Group>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    }
                    <Button primary icon fluid labelPosition='left' onClick={this.handleAddConstraint}>
                        <Icon name='add'/>
                        Add Rule
                    </Button>
                </Grid.Column>
                <Grid.Column width={8}>
                    <CriteriaRasterMap
                        legend={legend}
                        raster={criterion.constraintRaster}
                        showBasicLayer={false}
                    />
                </Grid.Column>
            </Grid.Row>
        );
    }

    render() {
        const {criterion} = this.props;
        const raster = criterion.tilesCollection.first;

        return (
            <div>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            {this.state.showInfo &&
                            <Message onDismiss={this.handleDismiss}>
                                <Message.Header>Constraints</Message.Header>
                                <p>You can add constraints for the criterion, for which it is totally unsuitable.</p>
                                <p>[{raster.min.toFixed(3)}, {raster.max.toFixed(3)}]</p>
                            </Message>
                            }
                        </Grid.Column>
                    </Grid.Row>
                    {criterion.type === 'continuous'
                        ?
                        this.renderEditorContinuous()
                        :
                        this.renderEditorDiscrete()
                    }
                </Grid>
            </div>
        );
    }
}

CriteriaDataConstraints.propTypes = {
    criterion: PropTypes.instanceOf(Criterion).isRequired,
    onChange: PropTypes.func.isRequired
};

export default CriteriaDataConstraints;
