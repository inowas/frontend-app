import React, {MouseEvent, useEffect, useState} from 'react';
import {Button, Dimmer, Grid, List, Loader, Modal, Popup, Progress, Segment, Tab, TabProps} from 'semantic-ui-react';
import {ModflowModel, Optimization} from '../../../../../core/model/modflow';
import {WellBoundary} from '../../../../../core/model/modflow/boundaries';
import {IBoundary} from '../../../../../core/model/modflow/boundaries/Boundary.type';
import BoundaryCollection from '../../../../../core/model/modflow/boundaries/BoundaryCollection';
import {IOptimization} from '../../../../../core/model/modflow/optimization/Optimization.type';
import OptimizationInput from '../../../../../core/model/modflow/optimization/OptimizationInput';
import OptimizationMethod from '../../../../../core/model/modflow/optimization/OptimizationMethod';
import OptimizationObject from '../../../../../core/model/modflow/optimization/OptimizationObject';
import OptimizationSolution from '../../../../../core/model/modflow/optimization/OptimizationSolution';
import {IOptimizationSolution} from '../../../../../core/model/modflow/optimization/OptimizationSolution.type';
import {usePrevious} from '../../../../shared/simpleTools/helpers/customHooks';
import {
    OPTIMIZATION_STATE_CANCELLED,
    optimizationHasError,
    optimizationInProgress
} from '../../../defaults/optimization';
import {FitnessChart, LocalOptimizationModal, OptimizationSolutionModal} from './shared';

interface IProps {
    onApplySolution: (boundaries: BoundaryCollection) => any;
    optimization: Optimization;
    onChange: () => any;
    onChangeInput: (input: { key: string, value: any }) => any;
    onCalculationClick: () => any;
    onGoToBoundaryClick: () => any;
    model: ModflowModel;
    errors: string[];
}

const optimizationResultsComponent = (props: IProps) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [optimization, setOptimization] = useState<IOptimization>(props.optimization.toObject());
    const [selectedSolution, setSelectedSolution] = useState<IOptimizationSolution | null>(null);
    const [createdBoundaries, setCreatedBoundaries] = useState<IBoundary[] | null>(null);
    const [localOptimization, setLocalOptimization] = useState<IOptimizationSolution | null>(null);
    const prevOptimization = usePrevious<IOptimization>(props.optimization.toObject());

    useEffect(() => {
        let newActiveIndex = activeIndex;

        if (!prevOptimization || prevOptimization.methods.length !== props.optimization.methods.length) {
            newActiveIndex = props.optimization.methods.length - 1;
        }

        setActiveIndex(newActiveIndex);
        setOptimization(props.optimization.toObject());
    }, [props.optimization]);

    const handleClickApply = (id: string) => () => {
        const solution = Optimization.fromObject(optimization).getSolutionById(id);

        const boundaries = solution.objects.map((o) => {
            return OptimizationObject.fromObject(o).toBoundary(
                props.model.boundingBox, props.model.gridSize, props.model.stressperiods
            );
        });
        const bc = BoundaryCollection.fromObject(boundaries.map((b) => b.toObject()));
        setCreatedBoundaries(bc.toObject());
        return props.onApplySolution(bc);
    };

    const handleClickLocalOptimization = (id: string) => () => {
        const solution = Optimization.fromObject(optimization).getSolutionById(id);
        return setLocalOptimization(solution);
    };

    const handleClickDetails = (id: string) => () => {
        const solution = Optimization.fromObject(optimization).getSolutionById(id);
        return setSelectedSolution(solution);
    };

    const handleCancelModal = () => {
        setLocalOptimization(null);
        setSelectedSolution(null);
        setCreatedBoundaries(null);
    };

    const handleCalculationStart = (input: OptimizationInput) => {
        handleCancelModal();
        props.onChangeInput({
            key: 'input',
            value: input
        });
        return props.onCalculationClick();
    };

    const handleTabChange = (e: MouseEvent, {index}: TabProps) => setActiveIndex(index);

    const renderMethodResults = (method: OptimizationMethod, mKey: number, state: number) => {
        return (
            <Tab.Pane attached={false} key={mKey}>
                {method.progress && method.progress.iteration > 0 ?
                    <Grid>
                        <Grid.Row columns={1}>
                            <Grid.Column>
                                <Progress
                                    percent={method.progress.final ? 100 : method.progress.calculate()}
                                    progress={true}
                                    indicating={!method.progress.final}
                                    success={method.progress.final}
                                    error={!method.progress.final && optimizationHasError(state)}
                                    warning={!method.progress.final && state === OPTIMIZATION_STATE_CANCELLED}
                                >
                                    Iteration {method.progress.iteration} of {method.progress.iterationTotal}
                                    {method.progress.simulationTotal > 0 ?
                                        <span>
                                            &nbsp;/ Simulation {method.progress.simulation} of
                                            {method.progress.simulationTotal}
                                            </span>
                                        :
                                        <span/>
                                    }
                                </Progress>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={1}>
                            <section className="stretch">
                                <FitnessChart data={method.progress.toChartData}/>
                            </section>
                        </Grid.Row>
                    </Grid> : <div/>
                }
                {method.solutions.length > 0 ?
                    <Segment>
                        <Grid divided="vertically">
                            <Grid.Row columns={3}>
                                <Grid.Column textAlign="center" width={4}>
                                    <b>Solution</b>
                                </Grid.Column>
                                <Grid.Column textAlign="center" width={6}>
                                    <b>Fitness</b>
                                </Grid.Column>
                                <Grid.Column textAlign="center" width={6}/>
                            </Grid.Row>
                            {method.solutions.all.map((solution, sKey) => (
                                <Grid.Row columns={3} key={sKey}>
                                    <Grid.Column textAlign="center" width={4}>
                                        <Button
                                            onClick={handleClickDetails(solution.id)}
                                        >
                                            Solution {sKey + 1}
                                        </Button>
                                    </Grid.Column>
                                    <Grid.Column width={6}>
                                        <List>
                                            {
                                                props.optimization.input.objectivesCollection.all.map((o, oKey) =>
                                                    <List.Item key={oKey}>
                                                        <Popup
                                                            trigger={<span>Objective {oKey + 1}</span>}
                                                        >
                                                            <Popup.Content>
                                                                {o.name}
                                                            </Popup.Content>
                                                        </Popup>: <b>{solution.fitness[oKey].toFixed(3)}</b>
                                                    </List.Item>
                                                )
                                            }
                                        </List>
                                    </Grid.Column>
                                    <Grid.Column textAlign="center" width={6}>
                                        <Button.Group>
                                            <Button
                                                color="blue"
                                                disabled={optimizationInProgress(optimization.state)}
                                                size="small"
                                                onClick={handleClickApply(solution.id)}
                                            >
                                                Apply
                                            </Button>
                                            <Button.Or/>
                                            <Button
                                                color="blue"
                                                disabled={optimizationInProgress(optimization.state)}
                                                size="small"
                                                onClick={handleClickLocalOptimization(solution.id)}
                                            >
                                                Optimize Locally
                                            </Button>
                                        </Button.Group>
                                    </Grid.Column>
                                </Grid.Row>
                            ))}
                        </Grid>
                    </Segment> : <div/>
                }
            </Tab.Pane>
        );
    };

    const panes = props.optimization.methods.map((method, mKey) => {
        return {
            menuItem: method.name,
            render: () => renderMethodResults(OptimizationMethod.fromObject(method), mKey, props.optimization.state)
        };
    });

    return (
        <div>
            <Grid>
                <Grid.Row columns={3}>
                    <Grid.Column/>
                    <Grid.Column/>
                    <Grid.Column/>
                </Grid.Row>
            </Grid>
            <Tab
                menu={{secondary: true, pointing: true}}
                activeIndex={activeIndex}
                onTabChange={handleTabChange}
                panes={panes}
            />
            {(optimizationInProgress(optimization.state) && panes.length === 0) ?
                <Dimmer active={true} inverted={true}>
                    <Loader inverted={true} content="Starting Calculation"/>
                </Dimmer> : <div/>
            }
            {selectedSolution &&
            <OptimizationSolutionModal
                model={props.model}
                onCancel={handleCancelModal}
                stressPeriods={props.model.stressperiods}
                solution={OptimizationSolution.fromObject(selectedSolution)}
            />
            }
            {localOptimization &&
            <LocalOptimizationModal
                onCancel={handleCancelModal}
                onCalculationStart={handleCalculationStart}
                optimizationInput={OptimizationInput.fromObject(optimization.input)}
                solution={OptimizationSolution.fromObject(localOptimization)}
            />
            }
            {createdBoundaries &&
            <Modal size={'tiny'} open={true} onClose={handleCancelModal} dimmer={'inverted'}>
                <Modal.Header>Solution Applied</Modal.Header>
                <Modal.Content>
                    <p>The solution has been applied successfully. Following boundaries have been created:</p>
                    <List>
                        {createdBoundaries.map((boundary, key) => {
                            if (boundary instanceof WellBoundary) {
                                return (<List.Item key={key}>{boundary.name} of type {boundary.type}</List.Item>);
                            }
                            return (<List.Item key={key}>Boundary of type {boundary.type}</List.Item>);
                        })}
                    </List>
                </Modal.Content>
                <Modal.Actions>
                    <Button positive={true} onClick={props.onGoToBoundaryClick}>Go to Boundaries</Button>
                    <Button onClick={handleCancelModal}>Close</Button>
                </Modal.Actions>
            </Modal>
            }
        </div>
    );
};

export default optimizationResultsComponent;
