import {Calculation, ModflowModel} from '../../../../../core/model/modflow';
import {ICalculation} from '../../../../../core/model/modflow/Calculation.type';
import {IFlopyPackages} from '../../../../../core/model/flopy/packages/FlopyPackages.type';
import {IT03Reducer} from '../../../../t03/reducers';
import {IT20Reducer} from '../../../../t20/reducers';
import {Message} from 'semantic-ui-react';
import {
    fetchCalculationDetails,
    sendModflowCalculationRequest
} from '../../../../../services/api';
import {useDispatch} from 'react-redux';
import BoundaryCollection from '../../../../../core/model/modflow/boundaries/BoundaryCollection';
import CalculationStatus, {
    CALCULATION_STARTED,
    CALCULATION_STATE_CALCULATION_ERROR_SERVER,
    CALCULATION_STATE_CALCULATION_FINISHED,
    CALCULATION_STATE_SENDING_DATA,
    CALCULATION_STATE_UPDATING_PACKAGES,
    CALCULATION_STATE_WAITING_FOR_CALCULATION
} from './CalculationProgress';
import FlopyModflow from '../../../../../core/model/flopy/packages/mf/FlopyModflow';
import FlopyModpath from '../../../../../core/model/flopy/packages/mp/FlopyModpath';
import FlopyMt3d from '../../../../../core/model/flopy/packages/mt/FlopyMt3d';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';
import FlopySeawat from '../../../../../core/model/flopy/packages/swt/FlopySeawat';
import React, {useEffect, useRef, useState} from 'react';
import Soilmodel from '../../../../../core/model/modflow/soilmodel/Soilmodel';
import Transport from '../../../../../core/model/modflow/transport/Transport';
import VariableDensity from '../../../../../core/model/modflow/variableDensity';

interface IProps {
    boundaries?: BoundaryCollection;
    model?: ModflowModel;
    reducer: IT03Reducer | IT20Reducer;
    updateCalculation: (calculation: Calculation) => {type: string; payload: ICalculation};
    updateProcessedPackages: (packages: FlopyPackages) => {type: string; payload: IFlopyPackages};
    updateProcessingPackages: () => {type: string};
}

const CalculationProcess = (props: IProps) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [fetching, setFetching] = useState<boolean>(false);
        const [polling, setPolling] = useState<boolean>(false);
        const [visible, setVisible] = useState<boolean>(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [error, setError] = useState<string | null>(null);
        const [isProcessing, setIsProcessing] = useState<boolean>(false);

        const timer = useRef<any>(null);

        const model = props.model || (props.reducer.model ? ModflowModel.fromObject(props.reducer.model) : null);
        const boundaries = props.boundaries ||(props.reducer.boundaries ? BoundaryCollection.fromObject(props.reducer.boundaries) : null);
        const soilmodel = props.reducer.soilmodel ? Soilmodel.fromObject(props.reducer.soilmodel) : null;
        const transport = props.reducer.transport ? Transport.fromObject(props.reducer.transport) : null;
        const variableDensity = props.reducer.variableDensity ? VariableDensity.fromObject(props.reducer.variableDensity) : null;
        const packages = props.reducer.packages.data ? FlopyPackages.fromObject(props.reducer.packages.data) : null;
        const calculation = props.reducer.calculation ? Calculation.fromObject(props.reducer.calculation) : null;

        const dispatch = useDispatch();

        useEffect(() => {
            if (!model || !calculation) {
                return setVisible(false);
            }

            const {state} = calculation;
            if (state >= CALCULATION_STATE_CALCULATION_FINISHED) {
                return stopPolling();
            }

            if (state < CALCULATION_STARTED || state > CALCULATION_STATE_CALCULATION_FINISHED) {
                return setVisible(false);
            }

            if (state > CALCULATION_STATE_SENDING_DATA && state < CALCULATION_STATE_CALCULATION_FINISHED) {
                startPolling();
                return setVisible(true);
            }

            if (state === CALCULATION_STARTED) {
                setVisible(true);
                setIsProcessing(true);
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [props.reducer.model, props.reducer.calculation]);

        useEffect(() => {
            setError(null);

            const f = async (model: ModflowModel) => {
                const p = recalculatePackages();
                setIsProcessing(false);
                if (!p) {
                    return setError('The package recalculation went wrong!');
                }

                const [schemaIsValid, e]: [boolean, null | string] = await p.validate(true);

                if (!schemaIsValid) {
                    return setError(`The schema is invalid! The following errors are shown: ${e}`);
                }

                const hash = p.hash(p.getData());
                dispatch(props.updateCalculation(
                    Calculation.fromCalculationIdAndState(hash, CALCULATION_STATE_UPDATING_PACKAGES)
                ));

                try {
                    dispatch(props.updateProcessedPackages(p));


                    // TODO: Save calc_id in 
                    // await sendCommand(ModflowModelCommand.updateModflowModelCalculationId(model.id, hash));



                    dispatch(props.updateCalculation(
                        Calculation.fromCalculationIdAndState(hash, CALCULATION_STATE_SENDING_DATA)
                    ));
                    await sendModflowCalculationRequest(p);
                    dispatch(props.updateCalculation(Calculation.fromCalculationIdAndState(
                        hash, CALCULATION_STATE_WAITING_FOR_CALCULATION
                    )));
                } catch (e) {
                    dispatch(props.updateCalculation(
                        Calculation.fromCalculationIdAndState(hash, CALCULATION_STATE_CALCULATION_ERROR_SERVER)
                    ));
                    setError(`Error sending the calculation data. More information: ${e}`);
                }
            };

            if (isProcessing && calculation && model) {
                f(model);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [isProcessing]);

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

        const recalculatePackages = () => {
            if (model && boundaries && soilmodel && transport && variableDensity) {
                dispatch(props.updateProcessingPackages());
                setIsProcessing(true);

                let p;
                if (packages) {
                    p = packages.update(model, soilmodel, boundaries, transport, variableDensity);
                    dispatch(props.updateProcessedPackages(p));
                    setIsProcessing(false);
                    return p;
                }

                p = FlopyPackages.create(
                    model.id,
                    FlopyModflow.create(model, soilmodel, boundaries),
                    FlopyModpath.create(),
                    FlopyMt3d.create(transport, boundaries),
                    FlopySeawat.create(variableDensity)
                );

                dispatch(props.updateProcessedPackages(p));
                setIsProcessing(false);
                return p;
            }

            return null;
        };

        const fetchCalculation = () => {
            if (!(model instanceof ModflowModel)) {
                return stopPolling();
            }

            if (!(calculation instanceof Calculation)) {
                return stopPolling();
            }

            const {state} = calculation;
            if (state < CALCULATION_STARTED || state >= CALCULATION_STATE_CALCULATION_FINISHED) {
                return stopPolling();
            }

            setFetching(true);
            fetchCalculationDetails(calculation.id)
                .then((data: ICalculation) => {
                    setFetching(false);
                    dispatch(props.updateCalculation(Calculation.fromQuery(data)));
                })
                .catch((e) => {
                    setError(e);
                    stopPolling();
                });
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

export default CalculationProcess;
