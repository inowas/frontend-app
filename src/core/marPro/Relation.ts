import { GenericObject } from '../model/genericObject/GenericObject';
import { IParameterRelation } from './Parameter.type';

class Relation extends GenericObject<IParameterRelation> {
  get isStorage() {
    return this._props.isStorage;
  }

  get relation() {
    return this._props.relation;
  }

  get resourceId() {
    return this._props.resourceId;
  }

  public static fromObject(value: IParameterRelation) {
    return new Relation(value);
  }
}

export default Relation;
