import React from 'react';
import PropTypes from 'prop-types';
import {Button, Form, Grid, Modal, Segment} from "semantic-ui-react";
import {OptimizationObjective, OptimizationInput, OptimizationSolution} from "core/model/modflow/optimization";

class LocalOptimizationModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            optimization: this.props.optimizationInput.toObject,
            editedObjective: null
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            optimization: nextProps.optimizationInput.toObject
        });
    }

    onCancelModal = () => this.props.onCancel();

    onCalculationClick = () => {
        const input = this.state.optimization;

        input.parameters = {
            ...input.parameters,
            method: 'Simplex',
            initial_solution_id: this.props.solution.id
        };

        return this.props.onCalculationStart(input);
    };

    handleChangeTargetLocally = (obj, event) => {
        obj.target = event.target.value;
        this.setState({
            editedObjective: obj
        });
    };

    handleChangeTarget = () => this.setState({
        optimization: {
            ...this.state.optimization,
            objectives: this.state.optimization.objectives.map(o => {
                if (this.state.editedObjective && o.id === this.state.editedObjective.id) {
                    return OptimizationObjective.fromObject(this.state.editedObjective).toObject;
                }
                return OptimizationObjective.fromObject(o).toObject;
            })
        },
        editedObjective: null
    });

    handleLocalChange = (e, {name, value}) => this.setState({
        optimization: {
            ...this.state.optimization,
            parameters: {
                ...this.state.optimization.parameters,
                [name]: value
            }
        }
    });

    handleChange = () => this.setState({
        optimization: OptimizationInput.fromObject(this.state.optimization).toObject
    });

    render() {
        const parameters = this.state.optimization.parameters;
        return (
            <Modal size={'large'} open onClose={this.onCancelModal} dimmer={'inverted'}>
                <Modal.Header>Optimize Solution Locally</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <label>Solution ID</label>
                            <Segment>
                                {this.props.solution.id}
                            </Segment>
                        </Form.Field>
                        <Form.Field>
                            <label>Maximum number of function evaluations during the local
                                optimization.</label>
                            <Form.Input
                                type="number"
                                name="maxf"
                                value={parameters.maxf}
                                placeholder="maxf ="
                                onChange={this.handleLocalChange}
                                onBlur={this.handleChange}
                            />
                        </Form.Field>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label>xtol</label>
                                <Form.Input
                                    type="number"
                                    name="xtol"
                                    value={parameters.xtol}
                                    placeholder="xtol ="
                                    onChange={this.handleLocalChange}
                                    onBlur={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>ftol</label>
                                <Form.Input
                                    type="number"
                                    name="ftol"
                                    value={parameters.ftol}
                                    placeholder="ftol ="
                                    onChange={this.handleLocalChange}
                                    onBlur={this.handleChange}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Segment>
                            <Grid divided="vertically">
                                <Grid.Row columns={3}>
                                    <Grid.Column>
                                        <b>Objective</b>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <b>Actual Value</b>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <b>Target</b>
                                    </Grid.Column>
                                </Grid.Row>
                                {this.state.optimization.objectives.map((objective, key) =>
                                    <Grid.Row columns={3} key={key}>
                                        <Grid.Column>
                                            {objective.name}
                                        </Grid.Column>
                                        <Grid.Column>
                                            {parseFloat(this.props.solution.fitness[key]).toFixed(3)}
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Form.Field>
                                                <Form.Input
                                                    type="number"
                                                    name="objective"
                                                    placeholder="target ="
                                                    value={
                                                        this.state.editedObjective && this.state.editedObjective.id === objective.id
                                                            ? this.state.editedObjective.target
                                                            : (objective.target || '')
                                                    }
                                                    onChange={(e) => this.handleChangeTargetLocally(objective, e)}
                                                    onBlur={this.handleChangeTarget}
                                                />
                                            </Form.Field>
                                        </Grid.Column>
                                    </Grid.Row>
                                )}
                            </Grid>
                        </Segment>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={this.onCancelModal}>Cancel</Button>
                    <Button primary onClick={this.onCalculationClick}>
                        Run Optimization
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

LocalOptimizationModal.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onCalculationStart: PropTypes.func.isRequired,
    optimizationInput: PropTypes.instanceOf(OptimizationInput).isRequired,
    solution: PropTypes.instanceOf(OptimizationSolution).isRequired
};

export default LocalOptimizationModal;