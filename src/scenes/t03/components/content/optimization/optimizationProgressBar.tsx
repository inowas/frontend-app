import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import {Message} from 'semantic-ui-react';
import {ModflowModel, Optimization} from '../../../../../core/model/modflow';
import {fetchUrl} from '../../../../../services/api';
import {OPTIMIZATION_STATE_FINISHED, OPTIMIZATION_STATE_STARTED} from '../../../defaults/optimization';
import OptimizationStatus from './optimizationStatus';

interface IStateProps {
    model: ModflowModel;
    optimization: Optimization;
}

interface IDispatchProps {
    updateCalculation: () => any;
}

interface IOwnProps {
    updateOptimization: (optimization: Optimization) => any;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

const optimizationProgressBar = (props: IProps) => {
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isPolling, setIsPolling] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const [timerId, setTimerId] = useState();
    const timer = useRef<number | null>(null);

    useEffect(() => {
        if (props.optimization) {
            const state = props.optimization.state;
            if (state > OPTIMIZATION_STATE_FINISHED) {
                return stopPolling();
            }

            if (state < OPTIMIZATION_STATE_STARTED || state > OPTIMIZATION_STATE_FINISHED) {
                return setIsVisible(false);
            }

            if (state < OPTIMIZATION_STATE_FINISHED) {
                startPolling();
                return setIsVisible(true);
            }
        }
    }, [props.optimization]);

    const startPolling = () => {
        if (isPolling) {
            return;
        }

        setTimerId(setInterval(() => fetchOptimization(), 2000));
        return setIsPolling(true);
    };

    const stopPolling = () => {
        clearInterval(timerId);
        timer.current = null;
        return setIsPolling(false);
    };

    const handleError = (e: boolean) => {
        return setIsError(e);
    };

    const fetchOptimization = () => {
        const model = props.model;
        const {calculation} = model;

        const {state} = calculation;
        if (state < OPTIMIZATION_STATE_STARTED || state >= OPTIMIZATION_STATE_FINISHED) {
            return;
        }

        setIsFetching(true);
        fetchUrl(`modflowmodels/${model.id}/optimization`,
            (data) => {
                setIsError(false);
                props.updateOptimization(Optimization.fromQuery(data));
            },
            (rError) => {
                setIsError(true);
                handleError(!!rError);
            }
        );
    };

    if (!isVisible) {
        return null;
    }

    return (
        <Message
            color="blue"
            onDismiss={() => setIsVisible(false)}
        >
            <Message.Header as={'h4'}>Calculation Progress</Message.Header>
            <Message.Content>
                <OptimizationStatus state={props.optimization.state}/>
            </Message.Content>
        </Message>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(optimizationProgressBar);
