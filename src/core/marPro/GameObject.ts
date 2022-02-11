import { EGameObjectType, IGameObject } from './GameObject.type';
import { GenericObject } from '../model/genericObject/GenericObject';
import uuid from 'uuid';

class GameObject extends GenericObject<IGameObject> {
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
}

export default GameObject;
