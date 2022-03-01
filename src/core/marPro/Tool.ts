import { GenericObject } from '../model/genericObject/GenericObject';
import { ITool } from './Tool.type';

class Tool extends GenericObject<ITool> {
  get cost() {
    return this._props.cost;
  }

  public static fromObject(value: ITool) {
    return new Tool(value);
  }
}

export default Tool;
