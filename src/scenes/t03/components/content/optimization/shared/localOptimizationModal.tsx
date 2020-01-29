import React, {ChangeEvent, useEffect, useState} from 'react';
import {Button, Form, Grid, InputOnChangeData, Modal, Segment} from 'semantic-ui-react';
import OptimizationInput from '../../../../../../core/model/modflow/optimization/OptimizationInput';
import {IOptimizationInput} from '../../../../../../core/model/modflow/optimization/OptimizationInput.type';
import OptimizationObjective from '../../../../../../core/model/modflow/optimization/OptimizationObjective';
import {IOptimizationObjective} from '../../../../../../core/model/modflow/optimization/OptimizationObjective.type';
import {EOptimizationMethod} from '../../../../../../core/model/modflow/optimization/OptimizationParameters.type';
import OptimizationSolution from '../../../../../../core/model/modflow/optimization/OptimizationSolution';

interface IProps {
    onCancel: () => any;
    onCalculationStart: (input: OptimizationInput) => any;
    optimizationInput: OptimizationInput;
    solution: OptimizationSolution;
}

const localOptimizationModal = (props: IProps) => {
    const [optimization, setOptimization] = useState<IOptimizationInput>(props.optimizationInput.toObject());
    const [editedObjective, setEditedObjective] = useState<IOptimizationObjective | null>(null);

    useEffect(() => {
        setOptimization(props.optimizationInput.toObject());
    }, [props.optimizationInput]);

    const handleCancelModal = () => props.onCancel();

    const handleCalculationClick = () => {
        const input = optimization;

        input.parameters = {
            ...input.parameters,
            method: EOptimizationMethod.SIMPLEX,
            initial_solution_id: props.solution.id
        };

        return props.onCalculationStart(OptimizationInput.fromObject(input));
    };

    const handleChangeTargetLocally = (obj: IOptimizationObjective) => (e: ChangeEvent, {value}: InputOnChangeData) => {
        obj.target = parseFloat(value);
        return setEditedObjective(obj);
    };

    const handleChangeTarget = () => {
        setOptimization({
            ...optimization,
            objectives: optimization.objectives.map((o) => {
                if (editedObjective && o.id === editedObjective.id) {
                    return OptimizationObjective.fromObject(editedObjective).toObject();
                }
                return OptimizationObjective.fromObject(o).toObject();
            })
        });
        setEditedObjective(null);
    };

    const handleLocalChange = (e: ChangeEvent, {name, value}: InputOnChangeData) => setOptimization({
        ...optimization,
        parameters: {
            ...optimization.parameters,
            [name]: value
        }
    });

    const handleChange = () => setOptimization(OptimizationInput.fromObject(optimization).toObject());

    const parameters = optimization.parameters;
    return (
        <Modal size={'large'} open={true} onClose={handleCancelModal} dimmer={'inverted'}>
            <Modal.Header>Optimize Solution Locally</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Field>
                        <label>Solution ID</label>
                        <Segment>
                            {props.solution.id}
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
                            onChange={handleLocalChange}
                            onBlur={handleChange}
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
                                onChange={handleLocalChange}
                                onBlur={handleChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>ftol</label>
                            <Form.Input
                                type="number"
                                name="ftol"
                                value={parameters.ftol}
                                placeholder="ftol ="
                                onChange={handleLocalChange}
                                onBlur={handleChange}
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
                            {optimization.objectives.map((objective, key) =>
                                <Grid.Row columns={3} key={key}>
                                    <Grid.Column>
                                        {objective.name}
                                    </Grid.Column>
                                    <Grid.Column>
                                        {props.solution.fitness[key].toFixed(3)}
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Field>
                                            <Form.Input
                                                type="number"
                                                name="objective"
                                                placeholder="target ="
                                                value={
                                                    editedObjective && editedObjective.id === objective.id
                                                        ? editedObjective.target
                                                        : (objective.target || '')
                                                }
                                                onChange={handleChangeTargetLocally(objective)}
                                                onBlur={handleChangeTarget}
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
                <Button negative={true} onClick={handleCancelModal}>Cancel</Button>
                <Button primary={true} onClick={handleCalculationClick}>
                    Run Optimization
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default localOptimizationModal;
