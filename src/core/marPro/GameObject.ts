import { EGameObjectType, IGameObject } from './GameObject.type';
import { GenericObject } from '../model/genericObject/GenericObject';
import { Geometry } from '../model/geometry';
import { IVector2D } from './Geometry.type';
import Scenario from './Scenario';
import uuid from 'uuid';

class GameObject extends GenericObject<IGameObject> {
  get boundaryId() {
    return this._props.boundaryId;
  }

  get boundaryType() {
    return this._props.boundaryType;
  }

  set location(value: IVector2D) {
    this._props.location = value;
  }

  public static fromObject(value: IGameObject) {
    return new GameObject(value);
  }

  public static createWell = () => {
    return new GameObject({
      id: uuid.v4(),
      type: EGameObjectType.ABSTRACTION_WELL,
      location: { x: 0, y: 0 },
      size: { x: 1, y: 1 },
      parameters: [],
    });
  };

  public calculateGeometry(scenario: Scenario) {
    if (scenario.stageSize.x === 0 || scenario.stageSize.y === 0) {
      throw new Error('Stage size of scenario is not allowed to be 0.');
    }

    // TODO: Add calculation for other geometries than points
    const ref = scenario.referencePoints;
    const relPosX = this.location.x / scenario.stageSize.x;
    const relPosY = this.location.y / scenario.stageSize.y;
    const lat = ref[0][0] + relPosY * (ref[1][0] - ref[0][0]);
    const lng = ref[1][0] + relPosX * (ref[1][1] - ref[1][0]);
    return Geometry.fromGeoJson({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lat, lng],
      },
    });
  }
}

export default GameObject;
