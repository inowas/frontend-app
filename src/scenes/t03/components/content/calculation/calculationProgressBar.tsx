import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Message} from 'semantic-ui-react';
import {Calculation, ModflowModel} from '../../../../../core/model/modflow';
import {ICalculation} from '../../../../../core/model/modflow/Calculation.type';
import {IRootReducer} from '../../../../../reducers';
import {fetchCalculationDetails} from '../../../../../services/api';
import {updateCalculation} from '../../../actions/actions';
import CalculationStatus, {CALCULATION_STATE_FINISHED, CALCULATION_STATE_NEW} from './CalculationStatus';

const calculationProgressBar = () => {

        const [fetching, setFetching] = useState<boolean>(false);
        const [polling, setPolling] = useState<boolean>(false);
        const [visible, setVisible] = useState<boolean>(false);
        const [error, setError] = useState<string | null>(null);

        const timer = useRef<any>(null);
        const T03 = useSelector((state: IRootReducer) => state.T03);
        const dispatch = useDispatch();

        const model = T03.model ? ModflowModel.fromObject(T03.model) : null;
        const calculation = T03.calculation ? Calculation.fromObject(T03.calculation) : null;

        useEffect(() => {

            if (!model || !calculation) {
                return setVisible(false);
            }

            const {state} = calculation;
            if (state >= CALCULATION_STATE_FINISHED) {
                stopPolling();
            }

            if (state < CALCULATION_STATE_NEW || state > CALCULATION_STATE_FINISHED) {
                return setVisible(false);
            }

            if (state < CALCULATION_STATE_FINISHED) {
                startPolling();
                return setVisible(true);
            }

        }, [T03.model, T03.calculation]);

        const startPolling = () => {
            if (polling) {
                return;
            }

            timer.current = setInterval(() => fetchCalculation(), 2000);
            setPolling(true);
        };

        const stopPolling = () => {
            if (timer.current) {
                clearInterval(timer.current);
                timer.current = null;
                setPolling(false);
            }
        };

        const fetchCalculation = () => {
            if (!(model instanceof ModflowModel)) {
                return;
            }

            if (!(calculation instanceof Calculation)) {
                return;
            }

            const {state} = calculation;
            if (state < CALCULATION_STATE_NEW || state >= CALCULATION_STATE_FINISHED) {
                return;
            }

            setFetching(true);
            fetchCalculationDetails(
                calculation.id,
                (data: ICalculation) => {
                    const c = Calculation.fromQuery(data);
                    setFetching(false);
                    dispatch(updateCalculation(c));
                },
                (e: string) => setError(e)
            );
        };

        if (visible && calculation) {
            return (
                <Message
                    color={'blue'}
                    onDismiss={() => {
                        stopPolling();
                        setVisible(false);
                    }}
                >
                    <Message.Header as={'h4'}>Calculation Progress</Message.Header>
                    <Message.Content>
                        <CalculationStatus calculation={calculation}/>
                    </Message.Content>
                </Message>
            );
        }

        return null;
    }
;

export default calculationProgressBar;
