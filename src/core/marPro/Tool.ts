import { GenericObject } from '../model/genericObject/GenericObject';
import { ITool } from './Tool.type';

class Tool extends GenericObject<ITool> {
  get costs() {
    return this._props.costs;
  }

  get editParameters() {
    return this._props.editParameters;
  }

  get name() {
    return this._props.name;
  }

  get size() {
    return this._props.size;
  }

  public static fromObject(value: ITool) {
    return new Tool(value);
  }
}

export default Tool;
