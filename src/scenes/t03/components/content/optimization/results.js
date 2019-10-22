import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Button, Progress, Segment, List, Popup, Modal, Tab, Dimmer, Loader} from 'semantic-ui-react';
import {
    OPTIMIZATION_STATE_CANCELLED,
    optimizationHasError,
    optimizationInProgress
} from '../../../defaults/optimization';
import {Optimization, OptimizationInput, OptimizationObject, OptimizationSolution} from '../../../../../core/model/modflow/optimization';
import {FitnessChart, LocalOptimizationModal, OptimizationSolutionModal} from './shared';

class OptimizationResultsComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activeIndex: 0,
            optimization: this.props.optimization.toObject(),
            selectedSolution: null,
            createdBoundaries: null,
            localOptimization: null
        };
    }

    componentWillReceiveProps(nextProps) {
        let newActiveIndex = this.state.activeIndex;

        if (this.props.optimization.methods.length !== nextProps.optimization.methods.length) {
            newActiveIndex = nextProps.optimization.methods.length - 1;
        }

        this.setState({
            activeIndex: newActiveIndex,
            optimization: nextProps.optimization.toObject()
        });
    }

    onClickApply = (id) => {
        const solution = Optimization.fromObject(this.state.optimization).getSolutionById(id).toObject();

        const boundaries = solution.objects.map(o => {
            return OptimizationObject.fromObject(o).toBoundary(this.props.model.bounding_box, this.props.model.grid_size, this.props.model.stressPeriods);
        });

        this.setState({
            createdBoundaries: boundaries
        });

        return this.props.onApplySolution(boundaries);
    };

    onClickLocalOptimization = (id) => {
        const solution = Optimization.fromObject(this.state.optimization).getSolutionById(id).toObject();
        return this.setState({
            localOptimization: solution
        });
    };

    onClickDetails = (id) => {
        const solution = Optimization.fromObject(this.state.optimization).getSolutionById(id).toObject();
        return this.setState({
            selectedSolution: solution
        });
    };

    onCancelModal = () => this.setState({
        localOptimization: null,
        selectedSolution: null,
        createdBoundaries: null
    });

    onCalculationStart = (input) => {
        this.onCancelModal();
        this.props.onChangeInput({
            key: 'input',
            value: input
        });
        this.props.onCalculationClick();
    };

    onTabChange = (e, {activeIndex}) => this.setState({activeIndex});

    renderMethodResults(method, mKey, state) {
        return (
            <Tab.Pane attached={false} key={mKey}>
                {method.progress && method.progress.iteration > 0 ?
                    <Grid>
                        <Grid.Row columns={1}>
                            <Grid.Column>
                                <Progress
                                    percent={method.progress.final ? 100 : method.progress.calculate()}
                                    progress
                                    indicating={!method.progress.final}
                                    success={method.progress.final}
                                    error={!method.progress.final && optimizationHasError(state)}
                                    warning={!method.progress.final && state === OPTIMIZATION_STATE_CANCELLED}
                                >
                                    Iteration {method.progress.iteration} of {method.progress.iterationTotal}
                                    {method.progress.simulationTotal > 0 ?
                                        <span>
                                            &nbsp;/ Simulation {method.progress.simulation} of {method.progress.simulationTotal}
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
                            {method.solutions.map((solution, sKey) => (
                                <Grid.Row columns={3} key={sKey}>
                                    <Grid.Column textAlign="center" width={4}>
                                        <Button
                                            onClick={() => this.onClickDetails(solution.id)}
                                        >
                                            Solution {sKey + 1}
                                        </Button>
                                    </Grid.Column>
                                    <Grid.Column width={6}>
                                        <List>
                                            {
                                                this.props.optimization.input.objectives.map((o, oKey) =>
                                                    <List.Item key={oKey}>
                                                        <Popup
                                                            trigger={<span>Objective {oKey + 1}</span>}>
                                                            <Popup.Content>
                                                                {o.name}
                                                            </Popup.Content>
                                                        </Popup>: <b>{parseFloat(solution.fitness[oKey]).toFixed(3)}</b>
                                                    </List.Item>
                                                )
                                            }
                                        </List>
                                    </Grid.Column>
                                    <Grid.Column textAlign="center" width={6}>
                                        <Button.Group>
                                            <Button color="blue"
                                                    disabled={optimizationInProgress(this.state.optimization.state)}
                                                    size="small"
                                                    onClick={() => this.onClickApply(solution.id)}
                                            >
                                                Apply
                                            </Button>
                                            <Button.Or/>
                                            <Button color="blue"
                                                    disabled={this.props.model.dirty || optimizationInProgress(this.state.optimization.state)}
                                                    size="small"
                                                    onClick={() => this.onClickLocalOptimization(solution.id)}
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

    render() {
        const {activeIndex, createdBoundaries, localOptimization, optimization, selectedSolution} = this.state;
        const {model} = this.props;
        const state = this.props.optimization.state;

        const panes = this.props.optimization.methods.map((method, mKey) => {
            return {
                menuItem: method.name,
                render: () => this.renderMethodResults(method, mKey, state)
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
                <Tab menu={{secondary: true, pointing: true}} activeIndex={activeIndex} onTabChange={this.onTabChange}
                     panes={panes}/>
                {(optimizationInProgress(optimization.state) && panes.length === 0) ?
                    <Dimmer active inverted>
                        <Loader inverted content='Starting Calculation' />
                    </Dimmer> : <div />
                }
                {selectedSolution &&
                <OptimizationSolutionModal
                    model={model}
                    onCancel={this.onCancelModal}
                    stressPeriods={model.stressPeriods}
                    solution={OptimizationSolution.fromObject(selectedSolution)}
                />
                }
                {localOptimization &&
                <LocalOptimizationModal
                    onCancel={this.onCancelModal}
                    onCalculationStart={this.onCalculationStart}
                    optimizationInput={OptimizationInput.fromObject(optimization.input)}
                    solution={OptimizationSolution.fromObject(localOptimization)}
                />
                }
                {createdBoundaries &&
                <Modal size={'tiny'} open onClose={this.onCancelModal} dimmer={'inverted'}>
                    <Modal.Header>Solution Applied</Modal.Header>
                    <Modal.Content>
                        <p>The solution has been applied successfully. Following boundaries have been created:</p>
                        <List>
                            {createdBoundaries.map((boundary, key) =>
                                <List.Item key={key}>{boundary.name} of type {boundary.type}</List.Item>
                            )}
                        </List>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button positive onClick={this.props.onGoToBoundaryClick}>Go to Boundaries</Button>
                        <Button onClick={this.onCancelModal}>Close</Button>
                    </Modal.Actions>
                </Modal>
                }
            </div>
        );
    }
}

OptimizationResultsComponent.propTypes = {
    onApplySolution: PropTypes.func.isRequired,
    optimization: PropTypes.instanceOf(Optimization).isRequired,
    onChange: PropTypes.func.isRequired,
    onChangeInput: PropTypes.func.isRequired,
    onCalculationClick: PropTypes.func.isRequired,
    onGoToBoundaryClick: PropTypes.func.isRequired,
    model: PropTypes.object.isRequired,
    errors: PropTypes.array
};

export default OptimizationResultsComponent;