import { Array2D } from '../../../core/model/geometry/Array2D.type';
import { Calculation } from '../../../core/model/modflow';
import { EObjectiveType } from '../../../core/marPro/Objective.type';
import { IRootReducer } from '../../../reducers';
import { fetchCalculationResultsFlow } from '../../../services/api';
import { getObservedValue } from '../components/utils';
import { updateGameState } from '../actions/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import GameState from '../../../core/marPro/GameState';
import Objective from '../../../core/marPro/Objective';

const useResults = () => {
  const [data, setData] = useState<Array2D<number> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const MarPro = useSelector((state: IRootReducer) => state.MarPro);
  const gameState = MarPro.gameState ? GameState.fromObject(MarPro.gameState) : null;

  const dispatch = useDispatch();

  useEffect(() => {
    if (MarPro.calculation && !data) {
      setIsLoading(isLoading);
      const calculation = Calculation.fromObject(MarPro.calculation);
      fetchResults(calculation);
    }
  }, [MarPro.calculation]);

  const fetchResults = async (calculation: Calculation) => {
    await fetchCalculationResultsFlow(
      { calculationId: calculation.id, layer: 0, totim: 0, type: 'drawdown' },
      (cData: Array2D<number>) => {
        setData(cData);
        setIsLoading(false);

        if (!gameState) {
          return;
        }

        // Check Objectives
        console.log('CHECK', cData);
        const newObjectiveState = gameState.objectives.map((o) => {
          let check = false;
          let value: number | undefined = undefined;
          const objective = Objective.fromObject(o.objective);

          if (objective.type === EObjectiveType.BY_OBSERVATION) {
            value = getObservedValue(objective.toObject(), cData);
            if (value === null || value === undefined) {
              console.log('CHECK IS FALSE');
              check = false;
            } else {
              check =
                (!objective.min || (typeof objective.min === 'number' && value >= objective.min)) &&
                (!objective.max || (typeof objective.max === 'number' && value <= objective.max));
            }
          } else {
            const objCheck = objective.check(gameState.toObject());
            check = objCheck.check;
            value = objCheck.value;
          }

          return {
            objective: objective.toObject(),
            isAchieved: check,
            tries: o.tries + 1,
            value,
          };
        });

        console.log(newObjectiveState);

        const updatedGameState = gameState.toObject();
        updatedGameState.objectives = newObjectiveState;
        dispatch(updateGameState(GameState.fromObject(updatedGameState)));
      },
      () => null
    );
  };

  const refetch = () => {
    if (!MarPro.calculation) {
      return;
    }
    setIsLoading(isLoading);
    const calculation = Calculation.fromObject(MarPro.calculation);
    fetchResults(calculation);
  };

  return { data, isLoading, refetch };
};

export default useResults;
