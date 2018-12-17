import React from 'react';
import PropTypes from 'prop-types';
import {Button, Form, Grid, Icon, Message, Segment, Table} from 'semantic-ui-react';
import Slider from 'rc-slider';
import {createSliderWithTooltip} from 'rc-slider';
import OptimizationObjective from 'core/model/modflow/optimization/Objective';
import {OptimizationMap, OptimizationToolbar} from './shared';
import {
    OPTIMIZATION_EDIT_NOCHANGES,
    OPTIMIZATION_EDIT_SAVED,
    OPTIMIZATION_EDIT_UNSAVED
} from '../../../defaults/optimization';

const Range = createSliderWithTooltip(Slider.Range);

const styles = {
    sliderDiv: {
        paddingBottom: 30
    }
};

class OptimizationObjectivesComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            objectives: props.objectives.map((objective) => {
                return objective.toObject();
            }),
            selectedObjective: null,
            editState: OPTIMIZATION_EDIT_NOCHANGES
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            objectives: nextProps.objectives.map((objective) => {
                return objective.toObject();
            })
        });
    }

    handleLocalChange = (e, {name, value}) => this.setState({
        selectedObjective: {
            ...this.state.selectedObjective,
            [name]: value
        },
        editState: OPTIMIZATION_EDIT_UNSAVED
    });

    handleChange = () => this.setState({
        selectedObjective: OptimizationObjective.fromObject(this.state.selectedObjective).toObject(),
        editState: OPTIMIZATION_EDIT_UNSAVED
    });

    handleChangeStressPeriods = (e) => {
        return this.setState({
            selectedObjective: {
                ...this.state.selectedObjective,
                location: {
                    ...this.state.selectedObjective.location,
                    ts: {
                        min: e[0],
                        max: e[1]
                    }
                }
            },
            editState: OPTIMIZATION_EDIT_UNSAVED
        });
    };

    onClickBack = () => this.setState({
        selectedObjective: null,
        editState: OPTIMIZATION_EDIT_NOCHANGES
    });

    onClickNew = (e, {name, value}) => {
        const newObjective = new OptimizationObjective();
        newObjective.type = value;
        newObjective.location.ts.max = this.props.model.stressPeriods.dateTimes.length - 1;
        return this.setState({
            selectedObjective: newObjective.toObject(),
            editState: OPTIMIZATION_EDIT_UNSAVED
        });
    };

    onClickObjective = (objective) => this.setState({
        selectedObjective: objective
    });

    onClickDelete = (objective) => {
        const objectives = this.state.objectives;
        this.props.onChange({
            key: 'objectives',
            value: objectives
                .filter(obj => obj.id !== objective.id)
                .map(obj => {
                    return OptimizationObjective.fromObject(obj);
                })
        });
    };

    onClickSave = () => {
        const {objectives, selectedObjective} = this.state;

        if (objectives.length < 1) {
            objectives.push(selectedObjective);
        }

        if (objectives.length >= 1 && objectives.filter(item => item.id === selectedObjective.id).length === 0) {
            objectives.push(selectedObjective);
        }

        this.props.onChange({
            key: 'objectives',
            value: objectives.map((obj) => {
                if (obj.id === selectedObjective.id) {
                    return OptimizationObjective.fromObject(selectedObjective);
                }

                return OptimizationObjective.fromObject(obj);
            })
        });

        return this.setState({
            selectedObjective: null,
            editState: OPTIMIZATION_EDIT_SAVED
        });
    };

    formatTimestamp = (key) => this.props.model.stressPeriods.dateTimes[key]; //Formatter.toDate(this.props.stressPeriods.dateTimes[key]);

    sliderMarks = () => {
        let marks = {};
        this.props.model.stressPeriods.dateTimes.forEach((dt, key) => {
            marks[key] = key;
        });
        return marks;
    };

    render() {
        const {model, objects} = this.props;
        const {editState, objectives, selectedObjective} = this.state;

        const typeOptions = [
            {key: 'type1', text: 'Concentration', value: 'concentration'},
            {key: 'type2', text: 'Head', value: 'head'},
            {key: 'type3', text: 'Flux', value: 'flux'},
            {key: 'type4', text: 'Distance', value: 'distance'},
            {key: 'type5', text: 'Input Concentration', value: 'inputConc'}
        ];

        return (
            <div>
                <OptimizationToolbar
                    save={selectedObjective ? {onClick: this.onClickSave} : null}
                    back={selectedObjective ? {onClick: this.onClickBack} : null}
                    dropdown={!selectedObjective ? {
                        text: 'Add New',
                        icon: 'plus',
                        options: typeOptions,
                        onChange: this.onClickNew
                    } : null}
                    editState={editState}
                />
                <Grid>
                    <Grid.Row columns={1}>
                        <Grid.Column>
                            {(!selectedObjective && (!objectives || objectives.length < 1)) &&
                            <Message>
                                <p>No optimization objectives</p>
                            </Message>
                            }
                            {(!selectedObjective && objectives && objectives.length >= 1) &&
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
                                        objectives.map((objective) =>
                                            <Table.Row key={objective.id}>
                                                <Table.Cell>
                                                    <Button
                                                        size="small"
                                                        onClick={() => this.onClickObjective(objective)}>
                                                        {objective.name}
                                                    </Button>
                                                </Table.Cell>
                                                <Table.Cell>{objective.type}</Table.Cell>
                                                <Table.Cell textAlign="center">
                                                    <Button icon color="red"
                                                            size="small"
                                                            onClick={() => this.onClickDelete(objective)}>
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
                                        style={styles.inputFix}
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
                                            onChange={this.handleLocalChange}
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
                                            onChange={this.handleLocalChange}
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
                                                max={model.stressPeriods.dateTimes.length - 1}
                                                step={1}
                                                marks={this.sliderMarks()}
                                                onChange={this.handleChangeStressPeriods}
                                                defaultValue={[selectedObjective.location.ts.min, selectedObjective.location.ts.max]}
                                                tipFormatter={value => `${this.formatTimestamp(value)}`}
                                            />
                                        </Segment>
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Location</label>
                                        <Segment>
                                            <OptimizationMap
                                                name="location"
                                                area={model.geometry}
                                                bbox={model.boundingBox}
                                                location={selectedObjective.location}
                                                objects={objects}
                                                onlyObjects={selectedObjective.type === 'flux' || selectedObjective.type === 'inputConc'}
                                                gridSize={model.gridSize}
                                                onChange={this.handleLocalChange}
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
                                                        area={model.geometry}
                                                        bbox={model.boundingBox}
                                                        location={selectedObjective.location_1}
                                                        objects={objects}
                                                        gridSize={model.gridSize}
                                                        onChange={this.handleLocalChange}
                                                        readOnly
                                                    />
                                                </Grid.Column>
                                                <Grid.Column width={8}>
                                                    <OptimizationMap
                                                        name="location2"
                                                        label="Edit Location 2"
                                                        area={model.geometry}
                                                        bbox={model.boundingBox}
                                                        location={selectedObjective.location_2}
                                                        objects={objects}
                                                        gridSize={model.gridSize}
                                                        onChange={this.handleLocalChange}
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
    objectives: PropTypes.array.isRequired,
    objects: PropTypes.array.isRequired,
    model: PropTypes.object,
    onChange: PropTypes.func.isRequired,
};

export default OptimizationObjectivesComponent;