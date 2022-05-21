import { EGameObjectCategory, ITool } from './Tool.type';
import { GenericObject } from '../model/genericObject/GenericObject';
import { gameObjectTypes } from './GameObject.type';
import uuid from 'uuid';

class Tool extends GenericObject<ITool> {
  get id() {
    return this._props.id;
  }

  get boundaryType() {
    return this._props.boundaryType;
  }

  get category() {
    return this._props.category;
  }

  get costs() {
    return this._props.costs;
  }

  get parameters() {
    return this._props.parameters;
  }

  get editPosition() {
    return this._props.editPosition;
  }

  get editSize() {
    return this._props.editSize;
  }

  get name() {
    return this._props.name;
  }

  get size() {
    return this._props.size;
  }

  public static fromType(type: string) {
    const data = gameObjectTypes.filter((t) => t.type === type);

    return new Tool({
      id: uuid.v4(),
      category: EGameObjectCategory.STRUCTURES,
      costs: [],
      editPosition: false,
      editSize: false,
      name: type,
      parameters: [],
      size: data.length > 0 ? data[0].size : { x: 44, y: 30 },
    });
  }

  public static fromObject(value: ITool) {
    return new Tool(value);
  }
}

export default Tool;
