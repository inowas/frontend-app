import {ErrorObject} from 'ajv';
import React, {MouseEvent, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {Button, Grid, Icon, List, Menu, MenuItemProps, Popup, Progress, Segment} from 'semantic-ui-react';
import {ModflowModel, Optimization} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {IBoundary} from '../../../../../core/model/modflow/boundaries/Boundary.type';
import {IOptimization} from '../../../../../core/model/modflow/optimization/Optimization.type';
import OptimizationInput from '../../../../../core/model/modflow/optimization/OptimizationInput';
import OptimizationProgress from '../../../../../core/model/modflow/optimization/OptimizationProgress';
import {sendCommand} from '../../../../../services/api';
import {updateOptimization} from '../../../actions/actions';
import Command from '../../../commands/modflowModelCommand';
import {
    getMessage, OPTIMIZATION_STATE_CANCELLED, OPTIMIZATION_STATE_CANCELLING,
    OPTIMIZATION_STATE_FINISHED, OPTIMIZATION_STATE_STARTED,
    optimizationHasError, optimizationInProgress
} from '../../../defaults/optimization';
import {
    OptimizationConstraintsComponent,
    OptimizationObjectivesComponent,
    OptimizationObjectsComponent,
    OptimizationParametersComponent,
    OptimizationResultsComponent
} from './index';

interface IDispatchProps {
    updateOptimization: (optimization: Optimization) => any;
}

interface IStateProps {
    boundaries: BoundaryCollection;
    model: ModflowModel;
    optimization: Optimization | null;
}

type IProps = IDispatchProps & IStateProps & RouteComponentProps<{
    id: string;
    property?: string;
    type?: string;
}>;

const optimizationContainer = (props: IProps) => {
    const [activeItem, setActiveItem] = useState<string>(props.match.params.type || 'parameters');
    const [boundaries, setBoundaries] = useState<IBoundary[] | null>(null);
    const [optimization, setOptimization] = useState<IOptimization | null>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isPolling, setIsPolling] = useState<boolean>(false);

    useEffect(() => {
        if (props.optimization) {
            setOptimization(props.optimization.toObject());
        }
    }, [props.optimization]);

    const handleChange = (optimizationInput: OptimizationInput, save = false) => {
        if (optimization) {
            const cOptimization = Optimization.fromObject(optimization);
            cOptimization.input = optimizationInput;
            props.updateOptimization(cOptimization);

            if (save) {
                setIsLoading(true);
                return sendCommand(
                    Command.updateOptimizationInput({
                        id: props.model.id,
                        input: optimizationInput.toObject()
                    }), () => {
                        setIsLoading(false);
                        setIsDirty(false);
                    }
                );
            }

            setIsDirty(true);
            setOptimization(cOptimization.toObject());
        }
    };

    const handleSave = () => {
        if (optimization) {
            setIsLoading(true);
            return sendCommand(
                Command.updateOptimizationInput({
                    id: props.model.id,
                    input: optimization.input
                }), () => {
                    setIsDirty(false);
                    setIsLoading(false);
                }
            );
        }
    };

    const handleApplySolution = (boundaries: BoundaryCollection) => {
        // TODO:
        // this.props.addBoundary(this.props.model.id, boundaries.map(b => b.toObject()));
    };

    const handleMenuClick = (e: MouseEvent | null, {name}: MenuItemProps) => {
        if (typeof name === 'string') {
            setActiveItem(name);
            const path = props.match.path;
            const basePath = path.split(':')[0];
            props.history.push(basePath + props.model.id + '/optimization/' + name);
        }
    };

    const handleClickBack = () => {
        const basePath = props.match.path.split(':')[0];
        props.history.push(basePath + props.model.id + '/optimization/' + props.match.params.type);
    };

    const handleCancelCalculationClick = () => {
        if (optimization) {
            const cOptimization = {
                ...optimization,
                state: OPTIMIZATION_STATE_CANCELLING
            };
            setIsLoading(true);
            setOptimization(cOptimization);
            return sendCommand(
                Command.cancelOptimizationCalculation({
                    id: props.model.id,
                    optimization_id: cOptimization.input.id
                }), () => {
                    setIsLoading(false);
                }
            );
        }
    };

    const handleCalculationClick = (isInitial: boolean) => () => {
        if (optimization) {
            handleMenuClick(null, {name: 'results'});
            const cOptimization = {
                ...optimization,
                input: {
                    ...optimization.input
                },
                state: OPTIMIZATION_STATE_STARTED
            };

            setIsLoading(true);
            setOptimization(cOptimization);
            setActiveItem('results');

            return sendCommand(
                Command.calculateOptimization({
                    id: props.model.id,
                    optimization_id: optimization.input.id,
                    is_initial: isInitial
                }), () => {
                    setIsLoading(false);
                }
            );
        }
    };

    const handleChangeResult = (obj: { key: string, value: any }) => {
        if (optimization) {
            const opt = Optimization.fromObject(optimization);
            if (obj.key === 'input') {
                opt.input = obj.value;
            }
            setOptimization(opt.toObject());
        }
    };

    const handleGoToBoundaryClick = () => {
        const path = props.match.path;
        const basePath = path.split(':')[0];
        props.history.push(basePath + props.model.id + '/boundaries/wel');
    };

    const getValidationMessage = (vErrors: ErrorObject[]) => {
        const log: string[] = [];
        const list: string[] = [];
        if (vErrors) {
            vErrors.forEach((error) => {
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
        return {list, log};
    };

    const renderProperties = () => {
        const {model} = props;

        if (!model || !optimization) {
            return null;
        }

        const {type} = props.match.params;
        const iOptimization = Optimization.fromObject(optimization);

        switch (type) {
            case 'objects':
                return (
                    <OptimizationObjectsComponent
                        isDirty={isDirty}
                        optimizationInput={iOptimization.input}
                        model={model}
                        onChange={handleChange}
                        onSave={handleSave}
                    />
                );
            case 'objectives':
                return (
                    <OptimizationObjectivesComponent
                        isDirty={isDirty}
                        optimizationInput={iOptimization.input}
                        model={model}
                        onChange={handleChange}
                        onSave={handleSave}
                    />
                );
            case 'constraints':
                return (
                    <OptimizationConstraintsComponent
                        isDirty={isDirty}
                        optimizationInput={iOptimization.input}
                        model={model}
                        onChange={handleChange}
                        onSave={handleSave}
                    />
                );
            case 'results':
                return (
                    <OptimizationResultsComponent
                        optimization={iOptimization}
                        errors={errors}
                        model={model}
                        onChangeInput={handleChange}
                        onCalculationClick={handleCalculationClick(false)}
                        onChange={handleChangeResult}
                        onApplySolution={handleApplySolution}
                        onGoToBoundaryClick={handleGoToBoundaryClick}
                    />
                );
            default:
                return (
                    <OptimizationParametersComponent
                        isDirty={isDirty}
                        optimizationInput={iOptimization.input}
                        onChange={handleChange}
                        onSave={handleSave}
                    />
                );
        }
    };

    const renderButton = () => {
        if (!optimization) {
            return null;
        }
        const iOptimization = Optimization.fromObject(optimization);

        const [result, vErrors] = iOptimization.validate();

        const errorMsg = getValidationMessage(vErrors);

        let customErrors = false;

        // TODO: Has model been recalculated?
        if (isDirty) {
            customErrors = true;
            errorMsg.list.push('The model needs to be calculated before running optimization.');
        }

        if ((!result && errors) || (customErrors && errorMsg.list.length > 0)) {
            return (
                <Menu.Item>
                    <Button.Group fluid={true}>
                        <Button secondary={true} disabled={true}>
                            Run Optimization
                        </Button>
                        <Popup
                            wide="very"
                            trigger={
                                <Button icon={true} negative={true}>
                                    <Icon name="exclamation"/>
                                </Button>
                            }
                            header="Validation Failed"
                            content={
                                <List as="ol">
                                    {errorMsg.list.length > 0
                                        ?
                                        <List.Item>
                                            <b>Major Errors</b>
                                            {errorMsg.list.map((element, key) => (
                                                <List.Item as="li" value="*" key={key}>{element}</List.Item>
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
                                            <List.Item><b>Minor Errors</b> (may be fixed by resolving the mayor
                                                errors)
                                                {errorMsg.log.map((e, key) => (
                                                    <List.Item
                                                        as="li"
                                                        value="*"
                                                        key={errorMsg.list.length + key - 1}
                                                    >
                                                        {e}
                                                    </List.Item>
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

        if (!optimizationInProgress(iOptimization.state)) {
            return (
                <Menu.Item>
                    <Button fluid={true} primary={true} onClick={handleCalculationClick(true)}>
                        Run Optimization
                    </Button>
                </Menu.Item>
            );
        }

        return (
            <Menu.Item>
                <Button fluid={true} color="red" onClick={handleCancelCalculationClick}>
                    Cancel Calculation
                </Button>
            </Menu.Item>
        );
    };

    const renderProgress = () => {
        if (!optimization) {
            return null;
        }
        const iOptimization = Optimization.fromObject(optimization);
        const method = iOptimization.input.parameters.method;

        const methodGA = iOptimization.getMethodByName('GA');
        const methodSimplex = iOptimization.getMethodByName('Simplex');

        if ((method === 'GA' && !methodGA) || (method === 'Simplex' && !methodSimplex)) {
            return false;
        }

        const progress = optimization.input.parameters.method === 'GA' && methodGA
            ? methodGA.progress : methodSimplex ? methodSimplex.progress : null;

        if (!progress) {
            return null;
        }

        return (
            <Menu.Item>
                <Progress
                    percent={progress.final ? 100 : OptimizationProgress.fromObject(progress).calculate()}
                    progress={true}
                    indicating={!progress.final && optimizationInProgress(iOptimization.state)}
                    success={progress.final && iOptimization.state === OPTIMIZATION_STATE_FINISHED}
                    error={!progress.final && optimizationHasError(optimization.state)}
                    warning={!progress.final && iOptimization.state === OPTIMIZATION_STATE_CANCELLED}
                >
                    {getMessage(iOptimization.state)}
                </Progress>
            </Menu.Item>
        );
    };

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
                            <Menu fluid={true} vertical={true} tabular={true}>
                                <Menu.Item
                                    name="parameters"
                                    active={activeItem === 'parameters'}
                                    onClick={handleMenuClick}
                                />
                                <Menu.Item
                                    name="objects"
                                    active={activeItem === 'objects'}
                                    onClick={handleMenuClick}
                                    content="Decision Variables"
                                />
                                <Menu.Item
                                    name="objectives"
                                    active={activeItem === 'objectives'}
                                    onClick={handleMenuClick}
                                />
                                <Menu.Item
                                    name="constraints"
                                    active={activeItem === 'constraints'}
                                    onClick={handleMenuClick}
                                />
                                {
                                    renderButton()
                                }
                                {
                                    renderProgress()
                                }
                                <Menu.Item
                                    name="results"
                                    active={activeItem === 'results'}
                                    onClick={handleMenuClick}
                                />
                            </Menu>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            {renderProperties()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </div>
    );
};

const mapStateToProps = (state: any) => {
    return {
        boundaries: BoundaryCollection.fromObject(state.T03.boundaries),
        model: ModflowModel.fromObject(state.T03.model),
        optimization: state.T03.optimization ? Optimization.fromObject(state.T03.optimization) : null
    };
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    updateOptimization: (optimization: Optimization) => dispatch(updateOptimization(optimization))
});

export default withRouter(connect<IStateProps, IDispatchProps>(
    mapStateToProps, mapDispatchToProps
)(optimizationContainer));
