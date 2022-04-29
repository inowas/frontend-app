import { EGameObjectType, IGameObject } from './GameObject.type';
import { GenericObject } from '../model/genericObject/GenericObject';
import { GeoJson } from '../model/geometry/Geometry.type';
import { IVector2D } from './Geometry.type';
import { ModflowModel } from '../model/modflow';
import Scenario from './Scenario';
import uuid from 'uuid';

class GameObject extends GenericObject<IGameObject> {
  get boundaryId() {
    return this._props.boundaryId;
  }

  get boundaryType() {
    return this._props.boundaryType;
  }

  get id() {
    return this._props.id;
  }

  set id(value: string) {
    this._props.id = value;
  }

  get locationIsFixed() {
    return this._props.locationIsFixed;
  }

  get location() {
    return this._props.location;
  }

  set location(value: IVector2D) {
    this._props.location = value;
  }

  get parameters() {
    return this._props.parameters;
  }

  get parametersAreFixed() {
    return this._props.parameters.filter((p) => p.isFixed).length > 0;
  }

  get size() {
    return this._props.size;
  }

  get type() {
    return this._props.type;
  }

  public static fromObject(value: IGameObject) {
    return new GameObject(value);
  }

  public static createInfiltrationPond = () => {
    return new GameObject({
      id: uuid.v4(),
      type: EGameObjectType.INFILTRATION_POND,
      location: { x: 0, y: 0 },
      size: { x: 1, y: 1 },
      parameters: [],
    });
  };

  public static createWell = () => {
    return new GameObject({
      id: uuid.v4(),
      type: EGameObjectType.ABSTRACTION_WELL,
      location: { x: 0, y: 0 },
      size: { x: 1, y: 1 },
      parameters: [],
    });
  };

  public calculateGeometry(model: ModflowModel, scenario: Scenario): GeoJson {
    if (scenario.stageSize.x === 0 || scenario.stageSize.y === 0) {
      throw new Error('Stage size of scenario is not allowed to be 0.');
    }

    const ref = scenario.referencePoints;

    const relPosX = this.location.x / scenario.stageSize.x;
    const relPosY = this.location.y / scenario.stageSize.y;
    const lat = ref[1][0] - relPosY * (ref[1][0] - ref[0][0]);
    const lng = ref[0][1] + relPosX * (ref[1][1] - ref[0][1]);

    /*if (this.boundaryType === 'rch') {
      const cellWidth = model.boundingBox.dX / model.gridSize.nX;
      const cellHeight = model.boundingBox.dY / model.gridSize.nY;

      return {
        type: 'Polygon',
        coordinates: [
          [
            [lng - cellWidth / 2, lat + cellHeight / 2],
            [lng + cellWidth + cellWidth / 2, lat + cellHeight / 2],
            [lng + cellWidth + cellWidth / 2, lat - cellHeight - cellHeight / 2],
            [lng - cellWidth / 2, lat - cellHeight - cellHeight / 2],
            [lng - cellWidth / 2, lat + cellHeight / 2],
          ],
        ],
      };
    }*/

    return {
      type: 'Point',
      coordinates: [lng, lat],
    };
  }
}

export default GameObject;
