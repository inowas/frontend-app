import {Button, Form, Grid, Icon, Message, Segment, Table} from 'semantic-ui-react';
import {ModflowModel} from '../../../../../core/model/modflow';
import {OptimizationInput, OptimizationLocation, OptimizationObjective} from '../../../../../core/model/modflow/optimization';
import {OptimizationMap} from './shared';
import {createSliderWithTooltip} from 'rc-slider';
import ContentToolBar from '../../../../shared/ContentToolbar';
import PropTypes from 'prop-types';
import React from 'react';
import Slider from 'rc-slider';

const Range = createSliderWithTooltip(Slider.Range);

const styles = {
    sliderDiv: {
        paddingBottom: 30
    },
    linkedCell: {
        cursor: 'pointer'
    }
};

class OptimizationObjectivesComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            optimizationInput: props.optimizationInput.toObject(),
            selectedObjective: null
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            optimizationInput: nextProps.optimizationInput.toObject()
        });
    }

    handleClickBack = () => this.setState({
        selectedObjective: null
    });

    handleClickDelete = (id) => {
        const input = OptimizationInput.fromObject(this.state.optimizationInput);
        input.objectivesCollection.remove(id);
        this.props.onChange(input, true);
    };

    handleClickNew = (e, {value}) => {
        const newObjective = new OptimizationObjective();
        newObjective.type = value;
        newObjective.location.ts.max = this.props.model.stressperiods.count - 1;

        const input = OptimizationInput.fromObject(this.state.optimizationInput);
        input.objectivesCollection.add(newObjective);
        this.props.onChange(input);

        return this.setState({
            selectedObjective: newObjective.toObject()
        });
    };

    handleClickObjective = (objective) => this.setState({
        selectedObjective: objective
    });

    handleClickSave = () => {
        if (this.state.selectedObjective) {
            const objective = OptimizationObjective.fromObject(this.state.selectedObjective);
            const input = OptimizationInput.fromObject(this.state.optimizationInput);
            input.objectivesCollection.update(objective);
            this.props.onChange(input);
        }

        this.props.onSave();
    };

    handleChange = () => {
        const input = OptimizationInput.fromObject(this.state.optimizationInput);

        if (this.state.selectedObjective) {
            const objective = OptimizationObjective.fromObject(this.state.selectedObjective);
            input.objectivesCollection.update(objective);
        }

        this.props.onChange(input);
    };

    handleChangeSelect = (e, {name, value}) => {
        const input = OptimizationInput.fromObject(this.state.optimizationInput);
        const objective = this.state.selectedObjective;
        objective[name] = value;

        input.objectivesCollection.update(OptimizationObjective.fromObject(objective));

        this.setState({
            selectedObjective: objective
        });

        return this.props.onChange(input);
    };

    handleChangeStressPeriods = (e) => {
        const input = OptimizationInput.fromObject(this.state.optimizationInput);
        const objective = this.state.selectedObjective;
        objective.location.ts = {
            min: e[0],
            max: e[1]
        };
        input.objectivesCollection.update(OptimizationObjective.fromObject(objective));

        this.setState({
            selectedObjective: objective
        });

        // TODO: difference between onChange and onSliderEnd?
        return this.props.onChange(input);
    };

    handleLocalChange = (e, {name, value}) => {
        const objective = this.state.selectedObjective;
        objective[name] = value;
        return this.setState({
            selectedObjective: objective
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
        const {selectedObjective} = this.state;
        const input = OptimizationInput.fromObject(this.state.optimizationInput);
        const objectives = input.objectivesCollection;

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
                    saveButton={!!selectedObjective}
                    backButton={!!selectedObjective}
                    onBack={this.handleClickBack}
                    onSave={this.handleClickSave}
                    dropdown={!selectedObjective ? {
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
                            {(!selectedObjective && objectives.length < 1) &&
                            <Message>
                                <p>No optimization objectives</p>
                            </Message>
                            }
                            {(!selectedObjective && objectives.length >= 1) &&
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
                                        objectives.all.map((objective) =>
                                            <Table.Row key={objective.id}>
                                                <Table.Cell
                                                    width={9}
                                                    style={styles.linkedCell}
                                                    onClick={() => this.handleClickObjective(objective.toObject())}>
                                                    {objective.name}
                                                </Table.Cell>
                                                <Table.Cell width={5}>{objective.type}</Table.Cell>
                                                <Table.Cell width={2} textAlign="right">
                                                    <Button
                                                        icon
                                                        negative
                                                        onClick={() => this.handleClickDelete(objective.id)}
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
                            {selectedObjective &&
                            <Form>
                                <Form.Field>
                                    <label>Name</label>
                                    <Form.Input
                                        type="text"
                                        name="name"
                                        value={selectedObjective.name}
                                        placeholder="name ="
                                        onChange={this.handleLocalChange}
                                        onBlur={this.handleChange}
                                    />
                                </Form.Field>
                                <Form.Group widths="equal">
                                    <Form.Field>
                                        <label>Objective type</label>
                                        <Form.Select
                                            name="type"
                                            value={selectedObjective.type}
                                            placeholder="type ="
                                            options={typeOptions}
                                            onChange={this.handleChangeSelect}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Method how each objective scalar will be calculated.</label>
                                        <Form.Select
                                            name="summary_method"
                                            value={selectedObjective.summary_method}
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
                                <Form.Group widths="equal">
                                    <Form.Field>
                                        <label>Objective weight factor</label>
                                        <Form.Input
                                            type="number"
                                            name="weight"
                                            value={selectedObjective.weight}
                                            placeholder="weight ="
                                            onChange={this.handleLocalChange}
                                            onBlur={this.handleChange}
                                            defaultChecked
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Objective penalty value</label>
                                        <Form.Input
                                            type="number"
                                            name="penalty_value"
                                            value={selectedObjective.penalty_value}
                                            placeholder="penalty_value ="
                                            onChange={this.handleLocalChange}
                                            onBlur={this.handleChange}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                {selectedObjective.type !== 'distance' &&
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
                                                defaultValue={[selectedObjective.location.ts.min, selectedObjective.location.ts.max]}
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
                                                location={OptimizationLocation.fromObject(selectedObjective.location)}
                                                onlyObjects={selectedObjective.type === 'flux' || selectedObjective.type === 'inputConc'}
                                                objectsCollection={input.objectsCollection}
                                                onChange={this.handleChangeSelect}
                                                readOnly
                                            />
                                        </Segment>
                                    </Form.Field>
                                </div>
                                }
                                {selectedObjective.type === 'distance' &&
                                <Form.Field>
                                    <h4>Distance</h4>
                                    <Segment>
                                        <Grid divided={'vertically'}>
                                            <Grid.Row columns={2}>
                                                <Grid.Column width={8}>
                                                    <OptimizationMap
                                                        name="location1"
                                                        label="Edit Location 1"
                                                        model={this.props.model}
                                                        location={OptimizationLocation.fromObject(selectedObjective.location_1)}
                                                        onChange={this.handleChangeSelect}
                                                        readOnly
                                                    />
                                                </Grid.Column>
                                                <Grid.Column width={8}>
                                                    <OptimizationMap
                                                        name="location2"
                                                        label="Edit Location 2"
                                                        model={this.props.model}
                                                        location={OptimizationLocation.fromObject(selectedObjective.location_2)}
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

OptimizationObjectivesComponent.propTypes = {
    isDirty: PropTypes.bool,
    optimizationInput: PropTypes.instanceOf(OptimizationInput).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    onChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
};

export default OptimizationObjectivesComponent;
