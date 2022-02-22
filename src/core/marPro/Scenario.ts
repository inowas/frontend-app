import { GenericObject } from '../model/genericObject/GenericObject';
import { IScenario } from './Scenario.type';

class Scenario extends GenericObject<IScenario> {
  get description() {
    return this._props.description;
  }

  get image() {
    return this._props.backgroundImage;
  }

  get modelId() {
    return this._props.modelId;
  }

  set modelId(value: string) {
    this._props.modelId = value;
  }

  get referencePoints() {
    return this._props.referencePoints;
  }

  set referencePoints(value: Array<[number, number]>) {
    this._props.referencePoints = value;
  }

  get subtitle() {
    return this._props.subtitle;
  }

  get title() {
    return this._props.title;
  }

  public static fromDefaults() {
    return new Scenario({
      aim: [],
      backgroundImage: '',
      description: '',
      gridSize: { x: 0, y: 0 },
      hints: [],
      modelId: '',
      objectives: [],
      objects: [],
      referencePoints: [
        [0, 0],
        [0, 0],
      ],
      resources: [],
      subtitle: '',
      stageSize: {
        x: 0,
        y: 0,
      },
      title: '',
      tools: [],
    });
  }

  public static fromObject(value: IScenario) {
    return new Scenario(value);
  }
}

export default Scenario;
