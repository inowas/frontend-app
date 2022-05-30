import { Collection } from '../model/collection/Collection';
import { IParameterRelation } from './Parameter.type';

class RelationsCollection extends Collection<IParameterRelation> {
  public static fromObject(obj: IParameterRelation[]) {
    return new RelationsCollection(obj);
  }

  public toObject() {
    return this.all;
  }
}

export default RelationsCollection;
