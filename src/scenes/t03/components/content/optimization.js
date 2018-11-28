import React from 'react';
import {fetchUrl} from "services/api";
import {withRouter} from "react-router-dom";
import {Button, Grid, Icon, List, Menu, Popup, Progress, Segment} from "semantic-ui-react";
import {
    getMessage, optimizationHasError, optimizationInProgress,
    OPTIMIZATION_STATE_CANCELLED, OPTIMIZATION_STATE_CANCELLING,
    OPTIMIZATION_STATE_FINISHED, OPTIMIZATION_STATE_STARTED
} from "../../defaults/optimization";
import {Optimization, OptimizationInput} from "core/model/modflow/optimization";
import {
    OptimizationParametersComponent,
    OptimizationObjectsComponent,
    OptimizationObjectivesComponent,
    OptimizationConstraintsComponent,
    OptimizationResultsComponent
} from "./optimization/";
import PropTypes from "prop-types";
import ToolMetaData from "../../../shared/simpleTools/ToolMetaData";
import {Stressperiods} from "core/model/modflow";

class OptimizationContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeItem: 'parameters',
            dirty: false,
            boundaries: null,
            optimization: Optimization.fromDefaults().toObject,
            model: null,
            error: false,
            errors: [],
            isLoading: true,
            isPolling: false
        }
    }

    componentDidMount() {
        fetchUrl(
            `modflowmodels/${this.props.match.params.id}`,
            model => this.setState({
                model: model,
                isLoading: false
            }),
            error => this.setState({error, isLoading: false})
        );

        fetchUrl(
            `modflowmodels/${this.props.match.params.id}/optimization`,
            optimization => this.setState({
                optimization: Optimization.fromObject(optimization).toObject
            }),
            error => this.setState({error, isLoading: false})
        );

        fetchUrl(
            `modflowmodels/${this.props.match.params.id}/boundaries`,
            boundaries => this.setState({
                boundaries
            }),
            error => this.setState({error, isLoading: false})
        );
    }

    componentWillReceiveProps(nextProps) {
        const optimization = (nextProps.optimization && nextProps.optimization.input) ?
            Optimization.fromObject(nextProps.optimization).toObject :
            Optimization.fromDefaults().toObject;

        if (optimizationInProgress(optimization.state) && !this.state.isPolling) {
            this.setState({
                isPolling: true
            });

            // TODO:
            /*this.props.startPolling({
                id: this.props.model.id
            });*/
        }

        this.setState({
            optimization: optimization
        });
    }

    onApplySolution = (boundaries) => {
        // TODO:
        //this.props.addBoundary(this.props.model.id, boundaries.map(b => b.toObject));
    };

    onMenuClick = (e, {name}) => {
        this.setState({
            activeItem: name
        });

        const path = this.props.match.path;
        const basePath = path.split(':')[0];
        const routeTo = basePath + this.state.model.id + '/optimization/' + name;

        this.props.history.push(routeTo);
    };

    onCancelCalculationClick = () => {
        const optimization = {
            ...this.state.optimization,
            state: OPTIMIZATION_STATE_CANCELLING
        };

        this.setState({
            optimization: optimization
        });

        // TODO:
        /*this.props.cancelOptimizationCalculation(
            this.props.model.id,
            Optimization.fromObject(optimization)
        );*/
    };

    onCalculationClick = (isInitial) => {
        this.onMenuClick(null, {name: 'results'});

        const optimization = {
            ...this.state.optimization,
            input: {
                ...this.state.optimization.input
            },
            state: OPTIMIZATION_STATE_STARTED
        };

        this.setState({
            optimization: optimization,
            activeItem: 'results'
        });

        // TODO:
        /*return this.props.calculateOptimization(
            this.props.model.id,
            Optimization.fromObject(optimization),
            isInitial
        );*/
    };

    onChange = (obj) => {
        const opt = Optimization.fromObject(this.state.optimization);

        if (obj.key === 'input') {
            opt.input = OptimizationInput.fromObject(obj.value);
        } else {
            opt.input[obj.key] = obj.value;
        }

        this.setState({
            optimization: opt.toObject
        });

        // TODO:
        /*return this.props.updateOptimizationInput(
            this.props.model.id,
            opt.input.toObject
        );*/
    };

    onChangeResult = (obj) => {
        const opt = Optimization.fromObject(this.state.optimization);
        opt[obj.key] = obj.value;
        this.setState({
            optimization: opt.toObject
        });
    };

    onGoToBoundaryClick = () => {
        // TODO:
        //Routing.goToPropertyType(this.props.routes, this.props.params)('boundaries', 'wel');
    };

    getValidationMessage = (errors) => {
        let log = [];
        let list = [];

        if (errors) {
            errors.forEach(error => {
                switch (error.schemaPath) {
                    case '#/properties/input/oneOf/1/properties/objects/minItems':
                        list.push('At least one decision variable is required.');
                        break;
                    case '#/properties/input/oneOf/1/properties/objectives/minItems':
                        list.push('At least one objective is required.');
                        break;
                    default:
                        log.push(error.dataPath + ' ' + error.message);
                        break;
                }
            });
        }

        return {list: list, log: log};
    };

    renderProperties() {
        if (!this.state.model) {
            return null;
        }

        /*const {stress_periods} = this.props;
        if (!stress_periods) {
            return null;
        }*/

        const {type} = this.props.match.params;
        const optimization = Optimization.fromObject(this.state.optimization);
        const stressPeriods = Stressperiods.fromObject(this.state.model.stress_periods);

        switch (type) {
            case 'objects':
                return (
                    <OptimizationObjectsComponent objects={optimization.input.objects} model={this.props.model}
                                                  stressPeriods={stressPeriods} onChange={this.onChange}/>
                );
            case 'objectives':
                return (
                    <OptimizationObjectivesComponent objectives={optimization.input.objectives}
                                                     model={this.props.model}
                                                     objects={optimization.input.objects}
                                                     stressPeriods={stressPeriods}
                                                     onChange={this.onChange}/>
                );
            case 'constraints':
                return (
                    <OptimizationConstraintsComponent constraints={optimization.input.constraints}
                                                      model={this.props.model}
                                                      objects={optimization.input.objects}
                                                      stressPeriods={stressPeriods}
                                                      onChange={this.onChange}/>
                );
            case 'results':
                return (
                    <OptimizationResultsComponent optimization={optimization} errors={this.state.errors}
                                                  model={this.props.model}
                                                  stressPeriods={stressPeriods}
                                                  onChangeInput={this.onChange}
                                                  onCalculationClick={() => this.onCalculationClick(false)}
                                                  onChange={this.onChangeResult}
                                                  onApplySolution={this.onApplySolution}
                                                  onGoToBoundaryClick={this.onGoToBoundaryClick}/>
                );
            default:
                return (
                    <OptimizationParametersComponent parameters={optimization.input.parameters}
                                                     objectives={optimization.input.objectives}
                                                     onChange={this.onChange}/>
                );
        }
    }

    renderButton() {
        const optimization = Optimization.fromObject(this.state.optimization);
        // TODO:
        /*const [result, errors] = optimization.validate();

        const errorMsg = this.getValidationMessage(errors);

        let customErrors = false;

        if (this.props.dirty){// || this.props.model.calculation.state === 0) {
            customErrors = true;
            errorMsg.list.push('The model needs to be calculated before running optimization.');
        }

        if ((!result && errors) || (customErrors && errorMsg.list.length > 0)) {
            return (
                <Menu.Item>
                    <Button.Group fluid>
                        <Button primary disabled={true}>
                            Run Optimization
                        </Button>
                        <Popup
                            wide='very'
                            trigger={
                                <Button primary style={styles.iconFix} icon>
                                    <Icon name="exclamation"/>
                                </Button>
                            }
                            header='Validation Failed'
                            content={
                                <List as='ol'>
                                    {errorMsg.list.length > 0
                                        ?
                                        <List.Item>
                                            <b>Mayor Errors</b>
                                            {errorMsg.list.map((element, key) => (
                                                <List.Item as='li' value='*' key={key}>{element}</List.Item>
                                            ))}
                                        </List.Item>
                                        :
                                        <div/>
                                    }
                                    {errorMsg.log.length > 0
                                        ?
                                        <div>
                                            <List.Item>
                                                <hr/>
                                            </List.Item>
                                            <List.Item><b>Minor Errors</b> (may be fixed by resolving the mayor errors)
                                                {errorMsg.log.map((e, key) => (
                                                    <List.Item as='li' value='*'
                                                               key={errorMsg.list.length + key - 1}>{e}</List.Item>
                                                ))}
                                            </List.Item>
                                        </div>
                                        :
                                        <div/>
                                    }
                                </List>
                            }
                            on={['hover', 'click']}
                        />
                    </Button.Group>
                </Menu.Item>
            );
        }

        if (!optimizationInProgress(this.state.optimization.state)) {
            return (
                <Menu.Item>
                    <Button fluid primary onClick={() => this.onCalculationClick(true)}>
                        Run Optimization
                    </Button>
                </Menu.Item>
            );
        }*/

        return (
            <Menu.Item>
                <Button fluid color="red" onClick={this.onCancelCalculationClick}>
                    Cancel Calculation
                </Button>
            </Menu.Item>
        );
    }

    renderProgress() {
        const optimization = Optimization.fromObject(this.state.optimization);
        const method = optimization.input.parameters.method;

        const methodGA = optimization.getMethodByName('GA');
        const methodSimplex = optimization.getMethodByName('Simplex');

        if ((method === 'GA' && !methodGA) || (method === 'Simplex' && !methodSimplex)) {
            return false;
        }

        const progress = this.state.optimization.input.parameters.method === 'GA' && methodGA
            ? methodGA.progress : methodSimplex.progress;

        return (
            <Menu.Item>
                <Progress
                    percent={progress.final ? 100 : progress.calculate()}
                    progress
                    indicating={!progress.final && optimizationInProgress(optimization.state)}
                    success={progress.final && optimization.state === OPTIMIZATION_STATE_FINISHED}
                    error={!progress.final && optimizationHasError(optimization.state)}
                    warning={!progress.final && optimization.state === OPTIMIZATION_STATE_CANCELLED}
                >
                    {getMessage(optimization.state)}
                </Progress>
            </Menu.Item>
        );
    }

    render() {
        if (!this.state.optimization) {
            return null;
        }

        console.log(this.state.model);

        return (
            <div>
                <ToolMetaData onChange={() => 1 + 1} onSave={() => 1 + 1} readOnly={false} tool={{type: 'T03'}}/>
                <Segment color={'grey'} loading={this.state.isLoading}>
                    <Grid>
                        <Grid.Column width={4}>
                            <Menu fluid vertical tabular>
                                <Menu.Item
                                    name="parameters"
                                    active={this.state.activeItem === 'parameters'}
                                    onClick={this.onMenuClick}/>
                                <Menu.Item
                                    name="objects"
                                    active={this.state.activeItem === 'objects'}
                                    onClick={this.onMenuClick}
                                    content="Decision Variables"/>
                                <Menu.Item
                                    name="objectives"
                                    active={this.state.activeItem === 'objectives'}
                                    onClick={this.onMenuClick}
                                />
                                <Menu.Item
                                    name="constraints"
                                    active={this.state.activeItem === 'constraints'}
                                    onClick={this.onMenuClick}
                                />
                                {
                                    this.renderButton()
                                }
                                {
                                    this.renderProgress()
                                }
                                <Menu.Item
                                    name="results"
                                    active={this.state.activeItem === 'results'}
                                    onClick={this.onMenuClick}
                                />
                            </Menu>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            {this.renderProperties()}
                        </Grid.Column>
                    </Grid>
                </Segment>
            </div>
        );
    }
}

OptimizationContainer.proptypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
};

export default withRouter(OptimizationContainer);