import {GenericObject} from '../genericObject/GenericObject';
import IDoseResponse from './DoseResponse.type';

class DoseResponse extends GenericObject<IDoseResponse> {
  get id() {
    return this._props.id;
  }

  get pathogenId() {
    return this._props.pathogenId;
  }
  
  get pathogenName() {
    return this._props.pathogenName;
  }
  
  get pathogenGroup() {
    return this._props.pathogenGroup;
  }
  
  get bestFitModel() {
    return this._props.bestFitModel;
  }
  
  get k() {
    return this._props.k;
  }
  
  get hostType() {
    return this._props.hostType;
  }
  
  get doseUnits() {
    return this._props.doseUnits;
  }
  
  get route() {
    return this._props.route;
  }
  
  get response() {
    return this._props.response;
  }
  
  get reference() {
    return this._props.reference;
  }
  
  get link() {
    return this._props.link;
  }
  
  public static fromObject(obj: IDoseResponse) {
    return new DoseResponse(obj);
  }

  public toPayload() {
    return {
      PathogenID: this.pathogenId,
      PathogenName: this.pathogenName,
      PathogenGroup: this.pathogenGroup,
      'Best fit model*': this.bestFitModel,
      k: this.k,
      'Host type': this.hostType,
      'Dose units': this.doseUnits,
      Route: this.route,
      Response: this.response,
      Reference: this.reference,
      Link: this.link
    };
  }
}

export default DoseResponse;
