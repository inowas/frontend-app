import { BoundaryCollection, ModflowModel } from '../../../../core/model/modflow';
import { Button, Modal } from 'semantic-ui-react';
import { IBoundary } from '../../../../core/model/modflow/boundaries/Boundary.type';
import { IRootReducer } from '../../../../reducers';
import { PackageActualizationWrapper } from '../../../modflow/components/content';
import { boundaryUpdater2 } from '../utils';
import { startCalculation, updatePackages } from '../../actions/actions';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import GameState from '../../../../core/marPro/GameState';
import ResultsMap from '../../../shared/complexTools/ResultsMap';
import Scenario from '../../../../core/marPro/Scenario';

interface IProps {
  onClose: () => any;
}

const ResultModal = (props: IProps) => {
  const [updatedBoundaries, setUpdatedBoundaries] = useState<IBoundary[]>();
  const [isUpdatingModel, setIsUpdatingModel] = useState<boolean>(false);

  const MarPro = useSelector((state: IRootReducer) => state.MarPro);
  const gameState = MarPro.gameState ? GameState.fromObject(MarPro.gameState) : null;
  const scenario = MarPro.scenario ? Scenario.fromObject(MarPro.scenario) : null;
  const model = MarPro.model ? ModflowModel.fromObject(MarPro.model) : null;
  const boundaries = MarPro.boundaries ? BoundaryCollection.fromObject(MarPro.boundaries) : null;

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
        <Button loading={isUpdatingModel} onClick={handleUpdateBoundaries}>
          Update Boundaries
        </Button>
        {renderBoundaryMap()}
        {renderPackageCalculation()}
      </Modal.Content>
    </Modal>
  );
};

export default ResultModal;
