import { Boundary } from '../../../../core/model/modflow/boundaries';
import { BoundaryCollection } from '../../../../core/model/modflow';
import { Button, List, Modal } from 'semantic-ui-react';
import { IBoundary } from '../../../../core/model/modflow/boundaries/Boundary.type';
import { boundaryUpdater } from '../utils';
import { fetchApiWithToken } from '../../../../services/api';
import { useEffect, useState } from 'react';
import GameObject from '../../../../core/marPro/GameObject';
import GameState from '../../../../core/marPro/GameState';
import Scenario from '../../../../core/marPro/Scenario';

interface IProps {
  gameState: GameState;
  onClose: () => any;
  scenario: Scenario;
}

const ResultModal = (props: IProps) => {
  const [boundaries, setBoundaries] = useState<IBoundary[]>();
  const [status, setStatus] = useState<string[]>([]);

  useEffect(() => {
    if (props.scenario.isManipulatingBoundaries) {
      fetchBoundaries(props.scenario.modelId);
    }
  }, []);

  const addStatusMessage = (msg: string) => {
    const date = new Date();
    setStatus([`${date.toLocaleString()}: ${msg}`, ...status]);
  };

  const fetchBoundaries = async (id: string) => {
    addStatusMessage('Fetching Boundaries ...');
    try {
      const b = (await fetchApiWithToken(`modflowmodels/${id}/boundaries`)).data;
      const bc = BoundaryCollection.fromQuery(b);
      setBoundaries(bc.toObject());
      addStatusMessage('Boundaries successfully fetched.');
    } catch (err) {
      addStatusMessage('Error while fetching Boundaries');
    }
  };

  const handleUpdateBoundaries = async () => {
    if (!boundaries) {
      return null;
    }
    await boundaryUpdater(
      props.scenario,
      props.gameState,
      BoundaryCollection.fromObject(boundaries),
      new BoundaryCollection([]),
      (b: Boundary, g?: GameObject) => {
        addStatusMessage(`Update boundary ${b.name}.`);
      },
      (bc: BoundaryCollection) => {
        addStatusMessage('Done updating boundaries.');
      }
    );
  };

  return (
    <Modal open={true} closeIcon onClose={props.onClose}>
      <Modal.Header>Results</Modal.Header>
      <Modal.Content>
        {props.scenario.needsModelCalculation ? 'NEED CALCULATION' : 'NO CALCULATION NEEDED'}
        <Button onClick={handleUpdateBoundaries}>Update Boundaries</Button>
        <List style={{ height: '100px', overflow: 'auto' }}>
          {status.map((message, key) => (
            <List.Item key={key}>{message}</List.Item>
          ))}
        </List>
      </Modal.Content>
    </Modal>
  );
};

export default ResultModal;
