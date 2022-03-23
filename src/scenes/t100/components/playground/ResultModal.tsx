import { BoundaryCollection, ModflowModel } from '../../../../core/model/modflow';
import { Button, Modal } from 'semantic-ui-react';
import { IBoundary } from '../../../../core/model/modflow/boundaries/Boundary.type';
import { IModflowModel } from '../../../../core/model/modflow/ModflowModel.type';
import { IRootReducer } from '../../../../reducers';
import { PackageActualizationWrapper } from '../../../modflow/components/content';
import { boundaryUpdater2 } from '../utils';
import { fetchApiWithToken } from '../../../../services/api';
import { startCalculation, updatePackages } from '../../../modflow/actions/actions';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import GameState from '../../../../core/marPro/GameState';
import ResultsMap from '../../../shared/complexTools/ResultsMap';
import Scenario from '../../../../core/marPro/Scenario';

interface IProps {
  gameState: GameState;
  onClose: () => any;
  scenario: Scenario;
}

const ResultModal = (props: IProps) => {
  const [boundaries, setBoundaries] = useState<IBoundary[]>();
  const [isUpdatingModel, setIsUpdatingModel] = useState<boolean>(false);
  const [model, setModel] = useState<IModflowModel>();

  const reducer = useSelector((state: IRootReducer) => state.ModflowReducer);

  useEffect(() => {
    const fetchBoundaries = async (id: string) => {
      const b = (await fetchApiWithToken(`modflowmodels/${id}/boundaries`)).data;
      const bc = BoundaryCollection.fromQuery(b);
      setBoundaries(bc.toObject());
    };

    const fetchModflowModel = async (id: string) => {
      const m = (await fetchApiWithToken(`modflowmodels/${id}`)).data;
      const fModel = ModflowModel.fromQuery(m);
      setModel(fModel.toObject());
    };

    fetchModflowModel(props.scenario.modelId).catch(console.error);
    if (props.scenario.isManipulatingBoundaries) {
      fetchBoundaries(props.scenario.modelId);
    }
  }, [props.scenario]);

  const handleUpdateBoundaries = async () => {
    if (!boundaries || !model) {
      return null;
    }
    setIsUpdatingModel(true);

    await boundaryUpdater2(
      BoundaryCollection.fromObject(boundaries),
      props.gameState.getClone(),
      ModflowModel.fromObject(model),
      props.scenario,
      new BoundaryCollection([]),
      (b: BoundaryCollection) => {
        setBoundaries(b.toObject());
        console.log(b.toObject());
      }
    );
  };

  const renderBoundaryMap = () => {
    if (!boundaries || !model) {
      return null;
    }

    return (
      <ResultsMap
        boundaries={BoundaryCollection.fromObject(boundaries)}
        activeCell={[0, 0]}
        data={[]}
        model={ModflowModel.fromObject(model)}
        onClick={(cell) => console.log(cell)}
      />
    );
  };

  const renderPackageCalculation = () => {
    if (!boundaries || !model) {
      return null;
    }

    return (
      <PackageActualizationWrapper
        boundaries={BoundaryCollection.fromObject(boundaries)}
        model={ModflowModel.fromObject(model)}
        property="calculation"
        reducer={reducer}
        updatePackages={updatePackages}
        startCalculation={startCalculation}
      />
    );
  };

  return (
    <Modal open={true} closeIcon onClose={props.onClose} size="large">
      <Modal.Header>Results</Modal.Header>
      <Modal.Content>
        {props.scenario.needsModelCalculation ? 'NEED CALCULATION' : 'NO CALCULATION NEEDED'}
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
