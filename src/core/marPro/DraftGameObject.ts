import { EGameObjectType, IDraftGameObject } from './GameObject.type';
import { GenericObject } from '../model/genericObject/GenericObject';
import { IParameter } from './Parameter.type';
import GameObject from './GameObject';
import uuid from 'uuid';

class DraftGameObject extends GenericObject<IDraftGameObject> {
  get image() {
    return this._props.image;
  }

  get location() {
    return this._props.location;
  }

  get type() {
    return this._props.type;
  }

  public static fromObject(value: IDraftGameObject) {
    return new DraftGameObject(value);
  }

  public static fromType(type: EGameObjectType) {
    return new DraftGameObject({
      hasBeenPaid: false,
      hasBeenPlaced: false,
      image: type,
      location: { x: 0, y: 0 },
      size: { x: 1, y: 1 },
      type,
    });
  }

  public toGameObject(parameters?: IParameter[]) {
    return new GameObject({
      id: uuid.v4(),
      type: this._props.type,
      location: this._props.location,
      size: this._props.size,
      parameters: parameters || [],
    });
  }
}

export default DraftGameObject;
