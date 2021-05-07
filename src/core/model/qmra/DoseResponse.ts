import { GenericObject } from '../genericObject/GenericObject';
import IDoseResponse, { IDoseResponsePayload } from './DoseResponse.type';
import Pathogen from './Pathogen';
import uuid from 'uuid';

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

  set pathogenName(value: string) {
    this._props.pathogenName = value;
  }

  get pathogenGroup() {
    return this._props.pathogenGroup;
  }

  set pathogenGroup(value: string) {
    this._props.pathogenGroup = value;
  }

  get bestFitModel() {
    return this._props.bestFitModel;
  }

  get k() {
    return this._props.k;
  }

  get alpha() {
    return this._props.alpha;
  }

  get n50() {
    return this._props.n50;
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

  public static fromPathogen(pathogen: Pathogen) {
    return new DoseResponse({
      id: uuid.v4(),
      pathogenId: pathogen.id,
      pathogenName: pathogen.name,
      pathogenGroup: pathogen.group,
      bestFitModel: '',
      hostType: '',
      doseUnits: '',
      route: '',
      response: '',
      reference: '',
      link: '',
    });
  }

  public static fromDefaults(pathogenId: number) {
    return new DoseResponse({
      id: uuid.v4(),
      pathogenId: pathogenId,
      pathogenName: '',
      pathogenGroup: '',
      bestFitModel: '',
      hostType: '',
      doseUnits: '',
      route: '',
      response: '',
      reference: '',
      link: '',
    });
  }

  public static fromObject(obj: IDoseResponse) {
    return new DoseResponse(obj);
  }

  public static fromPayload(obj: IDoseResponsePayload) {
    return new DoseResponse({
      id: uuid.v4(),
      pathogenId: obj.PathogenID,
      pathogenName: obj.PathogenName,
      pathogenGroup: obj.PathogenGroup,
      bestFitModel: obj['Best fit model*'],
      alpha: obj.alpha,
      k: obj.k,
      n50: obj.N50,
      hostType: obj['Host type'],
      doseUnits: obj['Dose units'],
      route: obj.Route,
      response: obj.Response,
      reference: obj.Reference,
      link: obj.Link,
    });
  }

  public toPayload() {
    return {
      PathogenID: this.pathogenId,
      PathogenName: this.pathogenName,
      PathogenGroup: this.pathogenGroup,
      'Best fit model*': this.bestFitModel,
      k: this.k,
      alpha: this.alpha,
      N50: this.n50,
      'Host type': this.hostType,
      'Dose units': this.doseUnits,
      Route: this.route,
      Response: this.response,
      Reference: this.reference,
      Link: this.link,
    };
  }
}

export default DoseResponse;
