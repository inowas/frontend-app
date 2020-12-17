import {Button, Form, Grid, Icon, Message, Segment, Table} from 'semantic-ui-react';
import {ModflowModel} from '../../../../../core/model/modflow';
import {OptimizationConstraint, OptimizationInput, OptimizationLocation} from '../../../../../core/model/modflow/optimization';
import {OptimizationMap} from './shared';
import ContentToolBar from '../../../../shared/ContentToolbar';
import PropTypes from 'prop-types';
import React from 'react';
import Slider, {createSliderWithTooltip} from 'rc-slider';

const Range = createSliderWithTooltip(Slider.Range);

const styles = {
    sliderDiv: {
        paddingBottom: 30
    },
    linkedCell: {
        cursor: 'pointer'
    }
};

class OptimizationConstraintsComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            optimizationInput: props.optimizationInput.toObject(),
            selectedConstraint: null
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            optimizationInput: nextProps.optimizationInput.toObject()
        });
    }

    handleClickBack = () => this.setState({
        selectedConstraint: null
    });

    handleClickDelete = (id) => {
        const input = OptimizationInput.fromObject(this.state.optimizationInput);
        input.constraintsCollection.remove(id);
        this.props.onChange(input, true);
    };

    handleClickNew = (e, {value}) => {
        const newConstraint = new OptimizationConstraint();
        newConstraint.type = value;
        newConstraint.location.ts.max = this.props.model.stressperiods.count - 1;

        const input = OptimizationInput.fromObject(this.state.optimizationInput);
        input.constraintsCollection.add(newConstraint);
        this.props.onChange(input);

        return this.setState({
            selectedConstraint: newConstraint.toObject()
        });
    };

    handleClickConstraint = (constraint) => this.setState({
        selectedConstraint: constraint
    });

    handleClickSave = () => {
        if (this.state.selectedConstraint) {
            const constraint = OptimizationConstraint.fromObject(this.state.selectedConstraint);
            const input = OptimizationInput.fromObject(this.state.optimizationInput);
            input.constraintsCollection.update(constraint);
            this.props.onChange(input);
        }

        this.props.onSave();
    };

    handleChange = () => {
        const input = OptimizationInput.fromObject(this.state.optimizationInput);

        if (this.state.selectedConstraint) {
            const constraint = OptimizationConstraint.fromObject(this.state.selectedConstraint);
            input.constraintsCollection.update(constraint);
        }

        this.props.onChange(input);
    };

    handleChangeSelect = (e, {name, value}) => {
        const input = OptimizationInput.fromObject(this.state.optimizationInput);
        const constraint = this.state.selectedConstraint;
        constraint[name] = value;

        input.constraintsCollection.update(OptimizationConstraint.fromObject(constraint));

        this.setState({
            selectedConstraint: constraint
        });

        return this.props.onChange(input);
    };

    handleChangeStressPeriods = (e) => {
        const input = OptimizationInput.fromObject(this.state.optimizationInput);
        const constraint = this.state.selectedConstraint;
        constraint.location.ts = {
            min: e[0],
            max: e[1]
        };
        input.constraintsCollection.update(OptimizationConstraint.fromObject(constraint));

        this.setState({
            selectedConstraint: constraint
        });

        // TODO: difference between onChange and onSliderEnd?
        return this.props.onChange(input);
    };

    handleLocalChange = (e, {name, value}) => {
        const constraint = this.state.selectedConstraint;
        constraint[name] = value;
        return this.setState({
            selectedConstraint: constraint
        });
    };

    formatTimestamp = (key) => this.props.model.stressperiods.dateTimes[key];

    sliderMarks = () => {
        let marks = {};
        this.props.model.stressperiods.dateTimes.forEach((dt, key) => {
            marks[key] = key;
        });
        return marks;
    };

    render() {
        const {model} = this.props;
        const {selectedConstraint} = this.state;
        const input = OptimizationInput.fromObject(this.state.optimizationInput);
        const constraints = input.constraintsCollection;

        const typeOptions = [
            {key: 'type1', text: 'Concentration', value: 'concentration'},
            {key: 'type2', text: 'Head', value: 'head'},
            {key: 'type3', text: 'Flux', value: 'flux'},
            {key: 'type4', text: 'Distance', value: 'distance'},
            {key: 'type5', text: 'Input Concentration', value: 'inputConc'}
        ];

        return (
            <div>
                <ContentToolBar
                    saveButton={!!selectedConstraint}
                    backButton={!!selectedConstraint}
                    onBack={this.handleClickBack}
                    onSave={this.handleClickSave}
                    dropdown={!selectedConstraint ? {
                        text: 'Add New',
                        icon: 'plus',
                        options: typeOptions,
                        onChange: this.handleClickNew
                    } : null}
                    isDirty={this.props.isDirty}
                    isError={false}
                />
                <Grid>
                    <Grid.Row columns={1}>
                        <Grid.Column>
                            {(!selectedConstraint && constraints.length < 1) &&
                            <Message>
                                <p>No optimization constraints</p>
                            </Message>
                            }
                            {(!selectedConstraint && constraints.length >= 1) &&
                            <Table celled striped>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Name</Table.HeaderCell>
                                        <Table.HeaderCell>Type</Table.HeaderCell>
                                        <Table.HeaderCell/>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {
                                        constraints.all.map((constraint) =>
                                            <Table.Row key={constraint.id}>
                                                <Table.Cell
                                                    width={9}
                                                    style={styles.linkedCell}
                                                    onClick={() => this.handleClickConstraint(constraint.toObject())}>
                                                    {constraint.name}
                                                </Table.Cell>
                                                <Table.Cell width={5}>{constraint.type}</Table.Cell>
                                                <Table.Cell width={2} textAlign="right">
                                                    <Button
                                                        icon
                                                        negative
                                                        onClick={() => this.handleClickDelete(constraint.id)}
                                                        size='small'
                                                    >
                                                        <Icon name="trash"/>
                                                    </Button>
                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    }
                                </Table.Body>
                            </Table>
                            }
                            {selectedConstraint &&
                            <Form>
                                <Form.Field>
                                    <label>Name</label>
                                    <Form.Input
                                        type="text"
                                        name="name"
                                        value={selectedConstraint.name}
                                        placeholder="name ="
                                        style={styles.inputFix}
                                        onChange={this.handleLocalChange}
                                        onBlur={this.handleChange}
                                    />
                                </Form.Field>
                                <Form.Group widths="equal">
                                    <Form.Field>
                                        <label>Constraint type</label>
                                        <Form.Select
                                            name="type"
                                            value={selectedConstraint.type}
                                            placeholder="type ="
                                            options={typeOptions}
                                            onChange={this.handleChangeSelect}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Method how each constraint scalar will be calculated.</label>
                                        <Form.Select
                                            name="summary_method"
                                            value={selectedConstraint.summary_method}
                                            placeholder="summary_method ="
                                            options={[
                                                {key: 'min', text: 'Min', value: 'min'},
                                                {key: 'max', text: 'Max', value: 'max'},
                                                {key: 'mean', text: 'Mean', value: 'mean'},
                                            ]}
                                            onChange={this.handleChangeSelect}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Field>
                                    <label>Constraint value</label>
                                    <Form.Input
                                        type="number"
                                        name="value"
                                        value={selectedConstraint.value}
                                        placeholder="value ="
                                        style={styles.inputFix}
                                        onChange={this.handleLocalChange}
                                        onBlur={this.handleChange}
                                        defaultChecked
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Operator that compares the observed value with the constraint
                                        value.</label>
                                    <Form.Select
                                        name="operator"
                                        value={selectedConstraint.operator}
                                        placeholder="operator ="
                                        options={[
                                            {key: 'more', text: 'More', value: 'more'},
                                            {key: 'less', text: 'Less', value: 'less'}
                                        ]}
                                        onChange={this.handleChangeSelect}
                                    />
                                </Form.Field>
                                {selectedConstraint.type !== 'distance' &&
                                <div>
                                    <Form.Field>
                                        <label>Stress Periods</label>
                                        <Segment style={styles.sliderDiv}>
                                            <Range
                                                min={0}
                                                max={model.stressperiods.count - 1}
                                                step={1}
                                                marks={this.sliderMarks()}
                                                onChange={this.handleChangeStressPeriods}
                                                defaultValue={[selectedConstraint.location.ts.min, selectedConstraint.location.ts.max]}
                                                tipFormatter={value => this.formatTimestamp(value)}
                                            />
                                        </Segment>
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Location</label>
                                        <Segment>
                                            <OptimizationMap
                                                name="location"
                                                model={this.props.model}
                                                location={OptimizationLocation.fromObject(selectedConstraint.location)}
                                                onlyObjects={selectedConstraint.type === 'flux' || selectedConstraint.type === 'inputConc'}
                                                objectsCollection={input.objectsCollection}
                                                onChange={this.handleChangeSelect}
                                                readOnly
                                            />
                                        </Segment>
                                    </Form.Field>
                                </div>
                                }
                                {selectedConstraint.type === 'distance' &&
                                <Form.Field>
                                    <label>Distance</label>
                                    <Segment>
                                        <Grid divided={'vertically'}>
                                            <Grid.Row columns={2}>
                                                <Grid.Column width={8}>
                                                    <OptimizationMap
                                                        name="location1"
                                                        label="Edit Location 1"
                                                        model={this.props.model}
                                                        location={OptimizationLocation.fromObject(selectedConstraint.location_1)}
                                                        onChange={this.handleChangeSelect}
                                                        readOnly
                                                    />
                                                </Grid.Column>
                                                <Grid.Column width={8}>
                                                    <OptimizationMap
                                                        name="location2"
                                                        label="Edit Location 2"
                                                        model={this.props.model}
                                                        location={OptimizationLocation.fromObject(selectedConstraint.location_2)}
                                                        onChange={this.handleChangeSelect}
                                                        readOnly
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Segment>
                                </Form.Field>
                                }
                            </Form>
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

OptimizationConstraintsComponent.propTypes = {
    isDirty: PropTypes.bool,
    optimizationInput: PropTypes.instanceOf(OptimizationInput).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    onChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
};

export default OptimizationConstraintsComponent;
