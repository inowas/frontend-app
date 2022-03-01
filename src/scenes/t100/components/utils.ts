import { Boundary, BoundaryFactory } from '../../../core/model/modflow/boundaries';
import { BoundaryCollection } from '../../../core/model/modflow';
import { IVector2D } from '../../../core/marPro/Geometry.type';
import { Vector2d } from 'konva/lib/types';
import GameObject from '../../../core/marPro/GameObject';
import GameState from '../../../core/marPro/GameState';
import Scenario from '../../../core/marPro/Scenario';

export const boundaryUpdater = async (
  scenario: Scenario,
  gameState: GameState,
  boundaries: BoundaryCollection,
  updatedBoundaries: BoundaryCollection,
  onUpdateBoundary: (b: Boundary, g?: GameObject) => any,
  onFinish: (bc: BoundaryCollection) => any
) => {
  const cBoundaries = boundaries.toObject();
  const shiftedBoundary = cBoundaries.shift();

  console.log({ boundaries, shiftedBoundary });

  if (!shiftedBoundary) {
    // Add remaining gameobjects as new boundaries
    gameState.objects.forEach((gameObject) => {
      const boundary = BoundaryFactory.fromMarProGameObject(GameObject.fromObject(gameObject), scenario); // TODO
      if (boundary) {
        updatedBoundaries.addBoundary(boundary);
      }
    });

    onFinish(updatedBoundaries);
    return;
  }

  const boundary = BoundaryFactory.fromObject(shiftedBoundary);
  const filteredGameObjects = gameState.objects.filter((g) => g.boundaryId === boundary.id);
  if (filteredGameObjects.length > 0) {
    const gameObject = GameObject.fromObject(filteredGameObjects[0]);

    // Manipulate boundary with gameObject
    if (scenario.isManipulatingBoundaryPositions && gameObject.boundaryType) {
      boundary.geometry = gameObject.calculateGeometry(scenario);
      //TODO: boundary.cells = calculateActiveCells(geometry)
    }
    // Manipulate spvalues

    // Remove gameObject from array
    gameState.objects = scenario.objects.filter((g) => g.boundaryId !== boundary.id);
  }

  onUpdateBoundary(
    boundary,
    filteredGameObjects.length > 0 ? GameObject.fromObject(filteredGameObjects[0]) : undefined
  );
  updatedBoundaries.add(boundary);
  boundaryUpdater(
    scenario,
    gameState,
    BoundaryCollection.fromObject(cBoundaries),
    updatedBoundaries,
    onUpdateBoundary,
    onFinish
  );
};

export const getSnappingPoint = (grid: IVector2D[], x: number, y: number, offset: Vector2d) => {
  let shortestDistance: number | null = null;
  let shortestKey = -1;
  grid.forEach((c, key) => {
    const d = Math.floor(Math.pow(c.x - offset.x - x, 2) + Math.pow(c.y - offset.y - y, 2));
    if (shortestDistance === null || d < shortestDistance) {
      shortestDistance = d;
      shortestKey = key;
    }
  });
  return grid[shortestKey];
};
