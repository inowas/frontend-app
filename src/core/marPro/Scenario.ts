import { EObjectiveType } from './Objective.type';
import { GenericObject } from '../model/genericObject/GenericObject';
import { IGameObject } from './GameObject.type';
import { IParameter } from './Parameter.type';
import { IScenarioTool } from './Scenario.type';
import uuid from 'uuid';

class Scenario extends GenericObject<IScenarioTool> {
  get description() {
    return this._props.data.description;
  }

  get id() {
    return this._props.id;
  }

  get image() {
    return this._props.data.backgroundImage;
  }

  get modelId() {
    return this._props.data.modelId;
  }

  set modelId(value: string) {
    this._props.data.modelId = value;
  }

  get name() {
    return this._props.name;
  }

  get objectives() {
    return this._props.data.objectives;
  }

  get objects() {
    return this._props.data.objects;
  }

  set objects(value: IGameObject[]) {
    this._props.data.objects = value;
  }

  get parameters(): IParameter[] {
    const parameters: IParameter[] = [];

    this.objects.forEach((object) => {
      object.parameters.forEach((parameter) => {
        const fParameters = parameters.filter((p) => p.id === parameter.id);
        if (fParameters.length === 0) {
          parameters.push(parameter);
        }
      })
    })

    return parameters;
  }

  get public() {
    return this._props.public;
  }

  get referencePoints() {
    return this._props.data.referencePoints;
  }

  set referencePoints(value: Array<[number, number]>) {
    this._props.data.referencePoints = value;
  }

  get resources() {
    return this._props.data.resources;
  }

  get settings() {
    return this._props.data.settings;
  }

  get subtitle() {
    return this._props.data.subtitle;
  }

  get stageSize() {
    return this._props.data.stageSize;
  }

  get title() {
    return this._props.data.title;
  }

  get tool() {
    return this._props.tool;
  }

  get tools() {
    return this._props.data.tools;
  }

  get zones() {
    return this._props.data.zones;
  }

  public static fromDefaults() {
    return new Scenario({
      id: uuid.v4(),
      name: 'New MarPro Scenario',
      data: {
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
      },
      description: '',
      permissions: 'rwx',
      public: true,
      tool: 'T100',
    });
  }

  public static fromObject(value: IScenarioTool) {
    return new Scenario(value);
  }

  get isAddingBoundaries() {
    return this._props.data.tools.length > 0; // TODO: specialize if a parameter is bound to a stress period value
  }

  get isManipulatingBoundaryPositions() {
    return this._props.data.tools.filter((t) => t.editPosition === true).length > 0; // TODO: specialize if objects are connected to boundaries
  }

  get isManipulatingBoundaries() {
    return this._props.data.objects.filter((o) => o.boundaryId).length > 0;
  }

  get needsModelCalculation() {
    return this._props.data.objectives.filter((o) => o.type === EObjectiveType.BY_OBSERVATION).length > 0;
  }
}

export default Scenario;
