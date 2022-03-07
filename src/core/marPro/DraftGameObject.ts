import { GenericObject } from '../model/genericObject/GenericObject';
import { IDraftGameObject } from './GameObject.type';
import { IParameter } from './Parameter.type';
import GameObject from './GameObject';
import Tool from './Tool';
import uuid from 'uuid';

class DraftGameObject extends GenericObject<IDraftGameObject> {
  get image() {
    return this._props.image;
  }

  get location() {
    return this._props.location;
  }

  get size() {
    return this._props.size;
  }

  get type() {
    return this._props.type;
  }

  public static fromObject(value: IDraftGameObject) {
    return new DraftGameObject(value);
  }

  public static fromTool(tool: Tool) {
    return new DraftGameObject({
      hasBeenPaid: false,
      hasBeenPlaced: false,
      image: tool.name,
      location: { x: 0, y: 0 },
      size: tool.size,
      type: tool.name,
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
