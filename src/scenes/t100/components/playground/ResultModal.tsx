import { Array2D } from '../../../../core/model/geometry/Array2D.type';
import { BoundaryCollection, Calculation, ModflowModel } from '../../../../core/model/modflow';
import { Button, Modal } from 'semantic-ui-react';
import { EObjectiveType } from '../../../../core/marPro/Objective.type';
import { IBoundary } from '../../../../core/model/modflow/boundaries/Boundary.type';
import { IRootReducer } from '../../../../reducers';
import { PackageActualizationWrapper } from '../../../modflow/components/content';
import { boundaryUpdater2, getObservedValue } from '../utils';
import { fetchCalculationResultsFlow } from '../../../../services/api';
import { startCalculation, updateGameState, updatePackages } from '../../actions/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import GameState from '../../../../core/marPro/GameState';
import Objective from '../../../../core/marPro/Objective';
import ResultsMap from '../../../shared/complexTools/ResultsMap';
import Scenario from '../../../../core/marPro/Scenario';

interface IProps {
  onClose: () => any;
}

const ResultModal = (props: IProps) => {
  const [data, setData] = useState<Array2D<number> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updatedBoundaries, setUpdatedBoundaries] = useState<IBoundary[]>();
  const [isUpdatingModel, setIsUpdatingModel] = useState<boolean>(false);

  const MarPro = useSelector((state: IRootReducer) => state.MarPro);
  const gameState = MarPro.gameState ? GameState.fromObject(MarPro.gameState) : null;
  const scenario = MarPro.scenario ? Scenario.fromObject(MarPro.scenario) : null;
  const model = MarPro.model ? ModflowModel.fromObject(MarPro.model) : null;
  const boundaries = MarPro.boundaries ? BoundaryCollection.fromObject(MarPro.boundaries) : null;

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
          let value: number | undefined = 5;
          const objective = Objective.fromObject(o.objective);
          if (objective.type === EObjectiveType.BY_OBSERVATION) {
            value = getObservedValue(objective.toObject(), cData);
            check =
              (!objective.min || (typeof objective.min === 'number' && value >= objective.min)) &&
              (!objective.max || (typeof objective.max === 'number' && value <= objective.max));
          } else {
            check = objective.check(gameState.toObject());
          }
          return {
            objective: objective.toObject(),
            isAchieved: check,
            tries: o.tries + 1,
            value,
          };
        });

        const updatedGameState = gameState.toObject();
        updatedGameState.objectives = newObjectiveState;
        dispatch(updateGameState(GameState.fromObject(updatedGameState)));
      },
      () => null
    );
  };

  const handleUpdateBoundaries = async () => {
    if (!boundaries || !model || !gameState || !scenario) {
      return null;
    }
    setIsUpdatingModel(true);

    await boundaryUpdater2(
      boundaries,
      gameState.getClone(),
      model,
      scenario,
      new BoundaryCollection([]),
      (b: BoundaryCollection) => {
        setUpdatedBoundaries(b.toObject());
        setIsUpdatingModel(false);
      }
    );
  };

  const renderBoundaryMap = () => {
    if (!updatedBoundaries || !model) {
      return null;
    }

    return (
      <ResultsMap
        boundaries={BoundaryCollection.fromObject(updatedBoundaries)}
        activeCell={[0, 0]}
        data={[]}
        model={model}
        onClick={(cell) => console.log(cell)}
      />
    );
  };

  const renderPackageCalculation = () => {
    if (!updatedBoundaries || !model) {
      return null;
    }

    return (
      <PackageActualizationWrapper
        boundaries={BoundaryCollection.fromObject(updatedBoundaries)}
        model={model}
        property="calculation"
        reducer={MarPro}
        updatePackages={updatePackages}
        startCalculation={startCalculation}
      />
    );
  };

  return (
    <Modal open={true} closeIcon onClose={props.onClose} size="large">
      <Modal.Header>Results</Modal.Header>
      <Modal.Content>
        {scenario && scenario.needsModelCalculation ? 'NEED CALCULATION' : 'NO CALCULATION NEEDED'}
        <Button loading={isUpdatingModel || isLoading} onClick={handleUpdateBoundaries}>
          Update Boundaries
        </Button>
        {renderBoundaryMap()}
        {renderPackageCalculation()}
      </Modal.Content>
    </Modal>
  );
};

export default ResultModal;
