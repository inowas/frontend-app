import { GenericObject } from '../model/genericObject/GenericObject';
import { IDraftGameObject } from './GameObject.type';
import { IParameter } from './Parameter.type';
import GameObject from './GameObject';
import Tool from './Tool';
import uuid from 'uuid';

class DraftGameObject extends GenericObject<IDraftGameObject> {
  get image() {
    return this._props.tool.name;
  }

  get location() {
    return this._props.location;
  }

  get size() {
    return this._props.tool.size;
  }

  get type() {
    return this._props.tool.name;
  }

  public static fromObject(value: IDraftGameObject) {
    return new DraftGameObject(value);
  }

  public static fromTool(tool: Tool) {
    return new DraftGameObject({
      hasBeenPaid: false,
      hasBeenPlaced: false,
      location: { x: 0, y: 0 },
      tool: tool.toObject(),
    });
  }

  public toGameObject(parameters?: IParameter[]) {
    return new GameObject({
      boundaryType: this._props.tool.boundaryType,
      id: uuid.v4(),
      type: this._props.tool.name,
      location: this._props.location,
      size: this._props.tool.size,
      parameters: parameters || [],
    });
  }
}

export default DraftGameObject;
