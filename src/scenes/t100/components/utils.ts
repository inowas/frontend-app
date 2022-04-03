import { BoundaryCollection, Cells, Geometry, ModflowModel } from '../../../core/model/modflow';
import { BoundaryFactory } from '../../../core/model/modflow/boundaries';
import { CALCULATE_CELLS_INPUT } from '../../modflow/worker/t03.worker';
import { ICalculateCellsInputData } from '../../modflow/worker/t03.worker.type';
import { asyncWorker } from '../../modflow/worker/worker';
import GameObject from '../../../core/marPro/GameObject';
import GameState from '../../../core/marPro/GameState';
import Scenario from '../../../core/marPro/Scenario';

export const boundaryUpdater2 = async (
  boundaries: BoundaryCollection,
  gameState: GameState,
  model: ModflowModel,
  scenario: Scenario,
  updatedBoundaries: BoundaryCollection,
  onFinish: (bc: BoundaryCollection) => any
) => {
  // Check all boundaries and update them if necessary -> Remove gameObjects which have been used for update
  const cBoundaries = boundaries.toObject();
  const shiftedBoundary = cBoundaries.shift();

  if (!shiftedBoundary) {
    // Check remaining gameObjects and add them as boundaries if necessary
    const shiftedGameObject = gameState.objects.shift();
    if (!shiftedGameObject) {
      // Everything is done
      onFinish(updatedBoundaries);
      return;
    }

    const g = GameObject.fromObject(shiftedGameObject);

    if (g.boundaryType && (!g.parametersAreFixed || !g.locationIsFixed)) {
      // GameObject needs to be transformed into a new boundary
      boundaryUpdater2(
        BoundaryCollection.fromObject(cBoundaries),
        gameState,
        model,
        scenario,
        updatedBoundaries,
        onFinish
      );
      return;
    }

    // GameObject will be skipped
    boundaryUpdater2(
      BoundaryCollection.fromObject(cBoundaries),
      gameState,
      model,
      scenario,
      updatedBoundaries,
      onFinish
    );
    return;
  }

  const boundary = BoundaryFactory.fromObject(shiftedBoundary);
  const filteredGameObjects = gameState.objects.filter((g) => g.boundaryId === boundary.id);

  if (filteredGameObjects.length > 0) {
    const gameObject = GameObject.fromObject(filteredGameObjects[0]);
    gameState.objects = gameState.objects.filter((o) => o.id !== gameObject.id);

    // Boundary will be updated by the corresponding gameObject
    if (!gameObject.locationIsFixed) {
      boundary.geometry = Geometry.fromObject(gameObject.calculateGeometry(model, scenario));
      const c = await asyncWorker({
        type: CALCULATE_CELLS_INPUT,
        data: {
          geometry: boundary.geometry.toGeoJSON(),
          boundingBox: model.boundingBox.toObject(),
          gridSize: model.gridSize.toObject(),
          intersection: model.intersection,
        } as ICalculateCellsInputData,
      });
      boundary.cells = Cells.fromObject(c);
    }

    if (!gameObject.parametersAreFixed) {
      const cSpValues = boundary.getSpValues(model.stressperiods).map((spValue, spKey) => {
        return boundary.valueProperties.map((vp, vpk) => {
          const fParameter = gameObject.parameters.filter((p) => p.valuePropertyKey === vpk);
          if (fParameter.length > 0 && !Array.isArray(fParameter[0].value) && spKey === 0) {
            return fParameter[0].value;
          }

          if (fParameter.length > 0 && Array.isArray(fParameter[0].value) && fParameter[0].value.length >= spKey) {
            return fParameter[0].value[spKey];
          }

          return spValue[vpk];
        });
      });
      boundary.setSpValues(cSpValues);
    }

    updatedBoundaries.add(boundary);
    boundaryUpdater2(
      BoundaryCollection.fromObject(cBoundaries),
      gameState,
      model,
      scenario,
      updatedBoundaries,
      onFinish
    );
    return;
  }

  // Boundary will be skipped
  updatedBoundaries.add(boundary);
  boundaryUpdater2(BoundaryCollection.fromObject(cBoundaries), gameState, model, scenario, updatedBoundaries, onFinish);
};
