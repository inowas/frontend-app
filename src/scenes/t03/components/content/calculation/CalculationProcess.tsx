import {Calculation, ModflowModel} from '../../../../../core/model/modflow';
import {ICalculation} from '../../../../../core/model/modflow/Calculation.type';
import {IRootReducer} from '../../../../../reducers';
import {Message} from 'semantic-ui-react';
import {
  fetchCalculationDetails,
  sendCommand,
  sendModflowCalculationRequest
} from '../../../../../services/api';
import {updateCalculation, updateProcessedPackages, updateProcessingPackages} from '../../../actions/actions';
import {useDispatch, useSelector} from 'react-redux';
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
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import React, {useEffect, useRef, useState} from 'react';
import Soilmodel from '../../../../../core/model/modflow/soilmodel/Soilmodel';
import Transport from '../../../../../core/model/modflow/transport/Transport';
import VariableDensity from '../../../../../core/model/modflow/variableDensity';

const CalculationProcess = () => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [fetching, setFetching] = useState<boolean>(false);
    const [polling, setPolling] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const timer = useRef<any>(null);
    const T03 = useSelector((state: IRootReducer) => state.T03);

    const model = T03.model ? ModflowModel.fromObject(T03.model) : null;
    const boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;
    const soilmodel = T03.soilmodel ? Soilmodel.fromObject(T03.soilmodel) : null;
    const transport = T03.transport ? Transport.fromObject(T03.transport) : null;
    const variableDensity = T03.variableDensity ? VariableDensity.fromObject(T03.variableDensity) : null;
    const packages = T03.packages.data ? FlopyPackages.fromObject(T03.packages.data) : null;
    const calculation = T03.calculation ? Calculation.fromObject(T03.calculation) : null;

    const dispatch = useDispatch();

    useEffect(() => {
      return () => stopPolling();
    }, []);

    useEffect(() => {
      if (!model || model.readOnly || !calculation) {
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
    }, [T03.model, T03.calculation]);

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
        dispatch(updateCalculation(
          Calculation.fromCalculationIdAndState(hash, CALCULATION_STATE_UPDATING_PACKAGES)
        ));

        try {
          await sendCommand(ModflowModelCommand.updateFlopyPackages(model.id, p));
          dispatch(updateProcessedPackages(p));
          await sendCommand(ModflowModelCommand.updateModflowModelCalculationId(model.id, hash));
          dispatch(updateCalculation(
            Calculation.fromCalculationIdAndState(hash, CALCULATION_STATE_SENDING_DATA)
          ));
          await sendModflowCalculationRequest(p);
          dispatch(updateCalculation(Calculation.fromCalculationIdAndState(
            hash, CALCULATION_STATE_WAITING_FOR_CALCULATION
          )));
        } catch (e) {
          dispatch(updateCalculation(
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
        dispatch(updateProcessingPackages());
        setIsProcessing(true);

        let p;
        if (packages) {
          p = packages.update(model, soilmodel, boundaries, transport, variableDensity);
          dispatch(updateProcessedPackages(p));
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

        dispatch(updateProcessedPackages(p));
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
          dispatch(updateCalculation(Calculation.fromQuery(data)));
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
