import {
  BoundaryCollection,
  Calculation,
  ModflowModel,
  Soilmodel,
  Transport,
  VariableDensity,
} from '../../../../core/model/modflow';
import { Button, Message } from 'semantic-ui-react';
import { FlopyModflow, FlopyModpath, FlopyMt3d, FlopySeawat } from '../../../../core/model/flopy/packages';
import { FlopyPackages } from '../../../../core/model/flopy';
import { IBoundary } from '../../../../core/model/modflow/boundaries/Boundary.type';
import { ICalculation } from '../../../../core/model/modflow/Calculation.type';
import { IRootReducer } from '../../../../reducers';
import { boundaryUpdater2 } from './utils';
import { fetchCalculationDetails, sendCommand, sendModflowCalculationRequest } from '../../../../services/api';
import {
  startCalculation,
  updateCalculation,
  updateProcessedPackages,
  updateProcessingPackages,
} from '../actions/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import CalculationStatus, {
  CALCULATION_STARTED,
  CALCULATION_STATE_CALCULATION_ERROR_SERVER,
  CALCULATION_STATE_CALCULATION_FINISHED,
  CALCULATION_STATE_SENDING_DATA,
  CALCULATION_STATE_UPDATING_PACKAGES,
  CALCULATION_STATE_WAITING_FOR_CALCULATION,
} from '../../../modflow/components/content/calculation/CalculationProgress';
import GameState from '../../../../core/marPro/GameState';
import ModflowModelCommand from '../../../t03/commands/modflowModelCommand';
import Scenario from '../../../../core/marPro/Scenario';

const CheckButton = () => {
  const MarPro = useSelector((state: IRootReducer) => state.MarProReducer);
  const gameState = MarPro.gameState ? GameState.fromObject(MarPro.gameState) : null;
  const scenario = MarPro.scenario ? Scenario.fromObject(MarPro.scenario) : null;
  const model = MarPro.model ? ModflowModel.fromObject(MarPro.model) : null;
  const boundaries = MarPro.boundaries ? BoundaryCollection.fromObject(MarPro.boundaries) : null;
  const calculation = MarPro.calculation ? Calculation.fromObject(MarPro.calculation) : null;
  const soilmodel = MarPro.soilmodel ? Soilmodel.fromObject(MarPro.soilmodel) : null;
  const transport = MarPro.transport ? Transport.fromObject(MarPro.transport) : null;
  const variableDensity = MarPro.variableDensity ? VariableDensity.fromObject(MarPro.variableDensity) : null;
  const packages = MarPro.packages.data ? FlopyPackages.fromObject(MarPro.packages.data) : null;

  const dispatch = useDispatch();

  const timer = useRef<any>(null);

  const [updatedBoundaries, setUpdatedBoundaries] = useState<IBoundary[]>();

  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [fetchingCalculation, setFetchingCalculation] = useState<boolean>(false);
  const [updatingModel, setUpdatingModel] = useState<boolean>(false);

  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    console.log('MODEL OR CALCULATION CHANGED');
    if (!MarPro.model || !MarPro.calculation) {
      return;
    }

    const { state } = MarPro.calculation;

    if (state >= CALCULATION_STATE_CALCULATION_FINISHED) {
      console.log('STOP POLLING', state);
      return stopPolling();
    }

    if (state < CALCULATION_STARTED || state > CALCULATION_STATE_CALCULATION_FINISHED) {
      return setIsVisible(false);
    }

    if (state > CALCULATION_STATE_SENDING_DATA && state < CALCULATION_STATE_CALCULATION_FINISHED) {
      console.log('START POLLING', state);
      startPolling();
      return setIsVisible(true);
    }

    if (state === CALCULATION_STARTED) {
      console.log('SARTED', state);
      setIsVisible(true);
      setIsProcessing(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MarPro.model, MarPro.calculation]);

  useEffect(() => {
    if (updatedBoundaries) {
      console.log('BOUNDARIES ARE UPDATED');
      dispatch(startCalculation());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedBoundaries]);

  useEffect(() => {
    console.log('PROCESSING USE EFFECT');
    const f = async (model: ModflowModel) => {
      const p = recalculatePackages();
      setIsProcessing(false);
      if (!p) {
        return setErrors([...errors, 'The package recalculation went wrong!']);
      }

      const [schemaIsValid, e]: [boolean, null | string] = await p.validate(true);

      if (!schemaIsValid) {
        return setErrors([...errors, `The schema is invalid! The following errors are shown: ${e}`]);
      }

      const hash = p.hash(p.getData());
      dispatch(updateCalculation(Calculation.fromCalculationIdAndState(hash, CALCULATION_STATE_UPDATING_PACKAGES)));

      try {
        dispatch(updateProcessedPackages(p));

        console.log('SENDING COMMAND WITH NEW CALCULATION ID');
        sendCommand(ModflowModelCommand.updateModflowModelCalculationId(model.id, hash));

        dispatch(updateCalculation(Calculation.fromCalculationIdAndState(hash, CALCULATION_STATE_SENDING_DATA)));
        await sendModflowCalculationRequest(p);
        dispatch(
          updateCalculation(Calculation.fromCalculationIdAndState(hash, CALCULATION_STATE_WAITING_FOR_CALCULATION))
        );
      } catch (e) {
        dispatch(
          updateCalculation(Calculation.fromCalculationIdAndState(hash, CALCULATION_STATE_CALCULATION_ERROR_SERVER))
        );
        setErrors([...errors, `Error sending the calculation data. More information: ${e}`]);
      }
    };

    if (isProcessing && calculation && model) {
      f(model);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProcessing]);

  const startPolling = () => {
    if (isPolling) {
      return;
    }

    timer.current = setInterval(() => fetchCalculation(), 2000);
    setIsPolling(true);
  };

  const stopPolling = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
      setIsPolling(false);
      setIsCalculating(false);
    }
  };

  const fetchCalculation = () => {
    console.log('FETCHING CALCULATION');
    if (!(model instanceof ModflowModel)) {
      console.log('MODEL NOT MODFLOWMODEL');
      return stopPolling();
    }

    if (!(calculation instanceof Calculation)) {
      console.log('Calculation NOT Calculation');
      return stopPolling();
    }

    const { state } = calculation;
    if (state < CALCULATION_STARTED || state >= CALCULATION_STATE_CALCULATION_FINISHED) {
      console.log('STATE STOP');
      return stopPolling();
    }

    setFetchingCalculation(true);
    fetchCalculationDetails(calculation.id)
      .then((data: ICalculation) => {
        setFetchingCalculation(false);
        dispatch(updateCalculation(Calculation.fromQuery(data)));
      })
      .catch((err) => {
        console.log(err);
        setErrors([...errors, 'Error while polling calculation.']);
        console.log('STOPPED BECAUSE OF ERROR');
        stopPolling();
      });
  };

  const recalculatePackages = () => {
    console.log('RECALCULATE PACKAGES');
    if (model && updatedBoundaries && soilmodel && transport && variableDensity) {
      const uBoundaries = BoundaryCollection.fromObject(updatedBoundaries);
      dispatch(updateProcessingPackages());
      setIsProcessing(true);

      let p;
      if (packages) {
        p = packages.update(model, soilmodel, uBoundaries, transport, variableDensity);
        dispatch(updateProcessedPackages(p));
        setIsProcessing(false);
        return p;
      }

      p = FlopyPackages.create(
        model.id,
        FlopyModflow.create(model, soilmodel, uBoundaries),
        FlopyModpath.create(),
        FlopyMt3d.create(transport, uBoundaries),
        FlopySeawat.create(variableDensity)
      );

      dispatch(updateProcessedPackages(p));
      setIsProcessing(false);
      return p;
    }

    return null;
  };

  const calculateBoundaries = () => {
    console.log('CALCULATE BOUNDARIES');
    if (!boundaries || !model || !gameState || !scenario) {
      return null;
    }
    setUpdatingModel(true);
    boundaryUpdater2(
      boundaries,
      gameState.getClone(),
      model,
      scenario,
      new BoundaryCollection([]),
      (b: BoundaryCollection) => {
        setUpdatedBoundaries(b.toObject());
        setUpdatingModel(false);
      }
    );
  };

  const handleClickButton = () => {
    setIsCalculating(true);
    calculateBoundaries();
  };

  const renderProgress = () => {
    if (isPolling) {
      return 'Polling ...';
    }
    if (updatingModel) {
      return 'Updating Model ...';
    }
    if (fetchingCalculation) {
      return 'Fetching Calculation ...';
    }
    return 'Check';
  };

  if (calculation && isVisible) {
    <CalculationStatus calculation={calculation} />;
  }

  return (
    <>
      {errors.map((err, k) => (
        <Message key={`error_${k}`}>{err}</Message>
      ))}
      <Button loading={isCalculating} color="blue" fluid onClick={handleClickButton}>
        {renderProgress()}
      </Button>
    </>
  );
};

export default CheckButton;
