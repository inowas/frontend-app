import { GenericObject } from '../model/genericObject/GenericObject';
import { ITool } from './Tool.type';

class Tool extends GenericObject<ITool> {
  get costs() {
    return this._props.costs;
  }

  get editParameters() {
    return this._props.editParameters;
  }

  public static fromObject(value: ITool) {
    return new Tool(value);
  }
}

export default Tool;
