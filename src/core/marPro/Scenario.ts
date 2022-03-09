import { EObjectiveType } from './Objective.type';
import { GenericObject } from '../model/genericObject/GenericObject';
import { IGameObject } from './GameObject.type';
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

  get objectives() {
    return this._props.objectives;
  }

  get objects() {
    return this._props.objects;
  }

  set objects(value: IGameObject[]) {
    this._props.objects = value;
  }

  get referencePoints() {
    return this._props.referencePoints;
  }

  set referencePoints(value: Array<[number, number]>) {
    this._props.referencePoints = value;
  }

  get resources() {
    return this._props.resources;
  }

  get settings() {
    return this._props.settings;
  }

  get subtitle() {
    return this._props.subtitle;
  }

  get stageSize() {
    return this._props.stageSize;
  }

  get title() {
    return this._props.title;
  }

  get tools() {
    return this._props.tools;
  }

  get zones() {
    return this._props.zones;
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
      settings: {
        allowGameObjectsOnlyInZones: false,
      },
      subtitle: '',
      stageSize: {
        x: 0,
        y: 0,
      },
      title: '',
      tools: [],
      zones: [],
    });
  }

  public static fromObject(value: IScenario) {
    return new Scenario(value);
  }

  get isAddingBoundaries() {
    return this._props.tools.length > 0; // TODO: specialize if a parameter is bound to a stress period value
  }

  get isManipulatingBoundaryPositions() {
    return this._props.tools.filter((t) => t.editPosition === true); // TODO: specialize if objects are connected to boundaries
  }

  get isManipulatingBoundaries() {
    return this._props.objects.filter((o) => o.boundaryId).length > 0;
  }

  get needsModelCalculation() {
    return this._props.objectives.filter((o) => o.type === EObjectiveType.BY_CELLS).length > 0;
  }
}

export default Scenario;
