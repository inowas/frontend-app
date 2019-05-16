import React from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {sendCommand} from '../../../../../services/api';
import {ModflowModel} from '../../../../../core/model/modflow';
import {connect} from 'react-redux';
import {updateOptimization} from '../../../actions/actions';

import {Button, Grid, Icon, List, Menu, Popup, Progress, Segment} from 'semantic-ui-react';
import {
    getMessage, optimizationHasError, optimizationInProgress,
    OPTIMIZATION_STATE_CANCELLED, OPTIMIZATION_STATE_CANCELLING,
    OPTIMIZATION_STATE_FINISHED, OPTIMIZATION_STATE_STARTED
} from '../../../defaults/optimization';

import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {Optimization} from '../../../../../core/model/modflow/optimization';
import {
    OptimizationParametersComponent,
    OptimizationObjectsComponent,
    OptimizationObjectivesComponent,
    OptimizationConstraintsComponent,
    OptimizationResultsComponent
} from './index';
import Command from '../../../commands/modflowModelCommand';
import {fetchUrl} from '../../../../../services/api';

class OptimizationContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeItem: props.match.params.type || 'parameters',
            boundaries: null,
            optimization: null,
            errors: [],
            isDirty: false,
            isError: false,
            isLoading: true,
            isPolling: false
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            model: nextProps.model.toObject(),
            optimization: nextProps.optimization ? nextProps.optimization.toObject() : null
        });
    }

    componentDidMount() {
        fetchUrl(`modflowmodels/${this.props.model.id}/optimization`,
            data => {
                this.setState({
                    isError: false,
                    isLoading: false
                }, this.props.updateOptimization(Optimization.fromQuery(data)));
            },
            error => this.setState(
                {error, isError: true},
                () => this.handleError(error)
            )
        );
    }

    handleChange = (optimizationInput, save = false) => {
        const optimization = Optimization.fromObject(this.state.optimization);
        optimization.input = optimizationInput;

        this.props.updateOptimization(optimization);

        if (save) {
            this.setState({
                isLoading: true
            });
            return sendCommand(
                Command.updateOptimizationInput({
                    id: this.props.model.id,
                    input: optimizationInput.toObject()
                }), () => this.setState({
                    isDirty: false,
                    isLoading: false
                })
            );
        }

        return this.setState({
            isDirty: true,
            optimization: optimization.toObject()
        });
    };

    handleSave = () => {
        this.setState({
            isLoading: true
        });
        return sendCommand(
            Command.updateOptimizationInput({
                id: this.props.model.id,
                input: this.state.optimization.input
            }), () => this.setState({
                isDirty: false,
                isLoading: false
            })
        );
    };

    onApplySolution = (boundaries) => {
        // TODO:
        //this.props.addBoundary(this.props.model.id, boundaries.map(b => b.toObject()));
    };

    onMenuClick = (e, {name}) => {
        this.setState({
            activeItem: name
        });

        const path = this.props.match.path;
        const basePath = path.split(':')[0];

        this.props.history.push(basePath + this.props.model.id + '/optimization/' + name);
    };

    onClickBack = () => {
        const {path, type} = this.props.match.path;
        const basePath = path.split(':')[0];

        this.props.history.push(basePath + this.props.model.id + '/optimization/' + type);
    };

    onCancelCalculationClick = () => {
        const optimization = {
            ...this.state.optimization,
            state: OPTIMIZATION_STATE_CANCELLING
        };

        this.setState({
            isLoading: true,
            optimization: optimization
        });

        return sendCommand(
            Command.cancelOptimizationCalculation({
                id: this.props.model.id,
                optimization_id: this.state.optimization.input.id
            }), () => this.setState({
                isLoading: false
            })
        );
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
            isLoading: true,
            optimization: optimization,
            activeItem: 'results'
        });

        return sendCommand(
            Command.calculateOptimization({
                id: this.props.model.id,
                optimization_id: this.state.optimization.input.id,
                is_initial: isInitial
            }), () => this.setState({
                isLoading: false
            })
        );
    };

    onChangeResult = (obj) => {
        const opt = Optimization.fromObject(this.state.optimization);
        opt[obj.key] = obj.value;
        this.setState({
            optimization: opt.toObject()
        });
    };

    onGoToBoundaryClick = () => {
        const path = this.props.match.path;
        const basePath = path.split(':')[0];

        this.props.history.push(basePath + this.props.model.id + '/boundaries/wel');
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
        const {model} = this.props;

        if (!model) {
            return null;
        }

        const {type} = this.props.match.params;
        const optimization = Optimization.fromObject(this.state.optimization);

        switch (type) {
            case 'objects':
                return (
                    <OptimizationObjectsComponent
                        isDirty={this.state.isDirty}
                        optimizationInput={optimization.input}
                        model={model}
                        onChange={this.handleChange}
                        onSave={this.handleSave}
                    />
                );
            case 'objectives':
                return (
                    <OptimizationObjectivesComponent
                        isDirty={this.state.isDirty}
                        optimizationInput={optimization.input}
                        model={model}
                        onChange={this.handleChange}
                        onSave={this.handleSave}
                    />
                );
            case 'constraints':
                return (
                    <OptimizationConstraintsComponent
                        isDirty={this.state.isDirty}
                        optimizationInput={optimization.input}
                        model={model}
                        onChange={this.handleChange}
                        onSave={this.handleSave}
                    />
                );
            case 'results':
                return (
                    <OptimizationResultsComponent optimization={optimization} errors={this.state.errors}
                                                  model={model}
                                                  onChangeInput={this.onChange}
                                                  onCalculationClick={() => this.onCalculationClick(false)}
                                                  onChange={this.onChangeResult}
                                                  onApplySolution={this.onApplySolution}
                                                  onGoToBoundaryClick={this.onGoToBoundaryClick}/>
                );
            default:
                return (
                    <OptimizationParametersComponent
                        isDirty={this.state.isDirty}
                        optimizationInput={optimization.input}
                        onChange={this.handleChange}
                        onSave={this.handleSave}
                    />
                );
        }
    }

    renderButton() {
        const optimization = Optimization.fromObject(this.state.optimization);

        const [result, errors] = optimization.validate();

        const errorMsg = this.getValidationMessage(errors);

        let customErrors = false;

        // TODO: Has model been recalculated?
        if (this.state.isDirty) {
            customErrors = true;
            errorMsg.list.push('The model needs to be calculated before running optimization.');
        }

        if ((!result && errors) || (customErrors && errorMsg.list.length > 0)) {
            return (
                <Menu.Item>
                    <Button.Group fluid>
                        <Button secondary disabled={true}>
                            Run Optimization
                        </Button>
                        <Popup
                            wide='very'
                            trigger={
                                <Button icon negative>
                                    <Icon name="exclamation"/>
                                </Button>
                            }
                            header='Validation Failed'
                            content={
                                <List as='ol'>
                                    {errorMsg.list.length > 0
                                        ?
                                        <List.Item>
                                            <b>Major Errors</b>
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
        }

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
        const {activeItem, isLoading, optimization} = this.state;

        if (!optimization) {
            return (
                <Segment color={'grey'} loading={true}>
                    LOADING
                </Segment>
            );
        }

        return (
            <div>
                <Segment color={'grey'} loading={isLoading}>
                    <Grid>
                        <Grid.Row>
                        <Grid.Column width={4}>
                            <Menu fluid vertical tabular>
                                <Menu.Item
                                    name="parameters"
                                    active={activeItem === 'parameters'}
                                    onClick={this.onMenuClick}/>
                                <Menu.Item
                                    name="objects"
                                    active={activeItem === 'objects'}
                                    onClick={this.onMenuClick}
                                    content="Decision Variables"/>
                                <Menu.Item
                                    name="objectives"
                                    active={activeItem === 'objectives'}
                                    onClick={this.onMenuClick}
                                />
                                <Menu.Item
                                    name="constraints"
                                    active={activeItem === 'constraints'}
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
                                    active={activeItem === 'results'}
                                    onClick={this.onMenuClick}
                                />
                            </Menu>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            {this.renderProperties()}
                        </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        boundaries: BoundaryCollection.fromObject(state.T03.boundaries),
        model: ModflowModel.fromObject(state.T03.model),
        optimization: state.T03.optimization ? Optimization.fromObject(state.T03.optimization) : null
    };
};

const mapDispatchToProps = {
    updateOptimization
};

OptimizationContainer.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    optimization: PropTypes.instanceOf(Optimization).isRequired,
    updateOptimization: PropTypes.func.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OptimizationContainer));
