import { BoundaryCollection } from '../../../../core/model/modflow';
import { Button, List, Modal } from 'semantic-ui-react';
import { EBoundaryType, IBoundary } from '../../../../core/model/modflow/boundaries/Boundary.type';
import { fetchApiWithToken } from '../../../../services/api';
import { useEffect, useState } from 'react';
import GameState from '../../../../core/marPro/GameState';
import Scenario from '../../../../core/marPro/Scenario';
import GameObject from '../../../../core/marPro/GameObject';
import { IGameObject } from '../../../../core/marPro/GameObject.type';
import { calculateActiveCells } from '../../../../services/geoTools';

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

  const handleClickButton = () => addStatusMessage('TEST');

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

  const updateBoundaries = (gameObjects: GameObject[], boundaries: BoundaryCollection) => {
    const cBoundaries = boundaries.all.map((boundary) => {
      const filteredObjects = gameObjects.filter((object) => object.boundaryId === boundary.id);
      if (filteredObjects.length > 0) {
        const g = filteredObjects[0];

        if (props.scenario.isManipulatingBoundaryPositions) {
          const geometry = g.calculateGeometry(props.scenario);
          if (boundary.type === EBoundaryType.WEL) {
            //TODO: boundary.cells = calculateActiveCells(geometry)
            boundary.geometry = geometry;
          }
        }
      }
      return boundary;
    });
  };

  return (
    <Modal open={true}>
      <Modal.Header>Results</Modal.Header>
      <Modal.Content>
        {props.scenario.needsModelCalculation ? 'NEED CALCULATION' : 'NO CALCULATION NEEDED'}
        <Button onClick={handleClickButton}>Test</Button>
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
