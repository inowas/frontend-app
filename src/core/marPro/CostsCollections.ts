import { Collection } from '../model/collection/Collection';
import { ICost } from './Tool.type';

class CostsCollection extends Collection<ICost> {
  public static fromObject(obj: ICost[]) {
    return new CostsCollection(obj);
  }

  public toObject() {
    return this.all;
  }
}

export default CostsCollection;
