import { EGameObjectCategory } from './Tool.type';
import { EGameObjectType } from './GameObject.type';
import { EObjectiveType, EParameterObjectiveType } from './Objective.type';
import { IScenario } from './Scenario.type';

export const scenario1: IScenario = {
  aim: [
    'All the available treated wastewater has to be infiltrated, and the drawdown below each well must be smaller or equal to 20 cm.',
  ],
  backgroundImage: '../assets/scenario_01_bg_image.svg',
  description:
    'In this story, you will play as the WWTP manager. You will need to distribute a total of 11,000 m3/day treatedwastewater into infiltration ponds to sustain the abstraction from four different active wells associated with different farmers. For every abstraction well, there should be one infiltration pond. Not every farmer has the same crops; some have potatoes, other grapes, olives, or citrus fruits. This results in different abstraction rates per well: 1,500/2,500/3,000/3,000 m3/day. Your first task is to place the needed infiltration ponds in the right location on the map. Then, you must change the infiltration rate of the ponds until all the treated wastewater is distributed and the extraction of water from the wells does not cause a local drawdown higher than 20 cm. Drawdowns that exceed the limit will result in unmanageable pumping costs for the farmers.',
  gridSize: {
    x: 20,
    y: 20,
  },
  hints: [
    'Remember that you have to infiltrate more than you abstract.',
    'Find out which well is most sensitive to higher abstraction.',
    'You could try to locate the ponds upstream of the extraction wells.',
  ],
  modelId: 'c0d6d9eb-8737-4b43-b7fc-30796e2889cc',
  objectives: [
    {
      cells: ['obj_well_1', 'obj_well_2', 'obj_well_3', 'obj_well_4'],
      parameters: [
        {
          id: 'p_drawdown',
          max: 0.2,
          min: 0,
          type: EParameterObjectiveType.ABSOLUTE,
        },
      ],
      type: EObjectiveType.BY_CELLS,
    },
  ],
  objects: [
    {
      boundaryId: 'river_id',
      id: 'obj_riv',
      type: EGameObjectType.RIVER,
      location: {
        x: 105,
        y: 0,
      },
      size: {
        x: 4.45,
        y: 4.45,
      },
      parameters: [],
    },
    {
      boundaryId: 'dcf1156e-3f02-4d5a-ad44-87073e0e7822',
      id: 'obj_pond_1',
      type: EGameObjectType.INFILTRATION_POND,
      location: {
        x: 540,
        y: 450,
      },
      size: {
        x: 0,
        y: 0,
      },
      parameters: [
        {
          relations: [{ resourceId: 'res_treated_wastewater' }],
          id: 'p_infiltration_rate',
          value: 0,
        },
      ],
    },
    {
      boundaryId: '151e123c-0af5-4a16-a17c-fcfebfa4de38',
      id: 'obj_pond_2',
      type: EGameObjectType.INFILTRATION_POND,
      location: {
        x: 580,
        y: 450,
      },
      size: {
        x: 0,
        y: 0,
      },
      parameters: [
        {
          relations: [{ resourceId: 'res_treated_wastewater' }],
          id: 'p_infiltration_rate',
          value: 0,
        },
      ],
    },
    {
      boundaryId: '19ea9d2a-b4ad-4d38-91e7-33de63450306',
      id: 'obj_pond_3',
      type: EGameObjectType.INFILTRATION_POND,
      location: {
        x: 520,
        y: 320,
      },
      size: {
        x: 0,
        y: 0,
      },
      parameters: [
        {
          relations: [{ resourceId: 'res_treated_wastewater' }],
          id: 'p_infiltration_rate',
          value: 0,
        },
      ],
    },
    {
      boundaryId: '09a27400-a686-4a93-811c-7749e138e977',
      id: 'obj_pond_4',
      type: EGameObjectType.INFILTRATION_POND,
      location: {
        x: 560,
        y: 320,
      },
      size: {
        x: 0,
        y: 0,
      },
      parameters: [
        {
          relations: [{ resourceId: 'res_treated_wastewater' }],
          id: 'p_infiltration_rate',
          value: 0,
        },
      ],
    },
  ],
  referencePoints: [
    [34.72115635900067, 32.44726181030274],
    [34.765307073357754, 32.52365112304688],
  ],
  resources: [
    {
      color: 'blue',
      id: 'res_treated_wastewater',
      min: 0,
      name: 'Treated Wasterwater',
      unit: 'm³',
      startValue: 11000,
    },
    {
      color: 'orange',
      id: 'res_coins',
      name: 'MAR Coins',
      startValue: -25,
    },
  ],
  subtitle: 'Infiltration ponds to achieve sustainability',
  stageSize: {
    x: 1059,
    y: 791,
  },
  title: 'Ezousa Catchment',
  tools: [
    {
      category: EGameObjectCategory.STRUCTURES,
      cost: {
        amount: 10,
        resource: 'res_coins',
      },
      editParameters: ['p_infiltration_rate'],
      editPosition: true,
      name: EGameObjectType.INFILTRATION_POND,
    },
  ],
};

export const scenario2: IScenario = {
  aim: [
    'Define how much water can be abstracted for agricultural use while having a limited drawdown (<=20 cm) at the location of the wells if you need a positive budget and >85 happiness points.',
  ],
  backgroundImage: '../assets/scenario_02_bg_image.svg',
  description:
    "Once again, you represent the WWTP manager. But ten years have passed, and the initial conditions of the project have changed. The Paphos population has increased, and so has the wastewater volume to be treated. The wastewater increased by 4000 m³/day, and the adaptation costs have left you with a negative budget of: -25 MAR coins. Besides, because the downstream of the Ezousa river has almost dried up due to lower precipitation and high evapotranspiration rates, the landscape value of the area and the dependent ecosystems' health are deteriorating. Therefore, new environmental regulations were established, and it requires you to discharge at least 2,000 m3/day of treated wastewater to the riverbed. However, the irrigation demands also increased as more farmers have settled near the Ezousa aquifer after the word has spread that there was enough water available. Moreover, some farmers have changed their crops to higher water-demanding crops because these are better priced. The agricultural development intensifies, but it is a crucial factor of the local economy. Hence, the WWTP can now sell the treated water to the farmers by 2 MAR coins per 100 m³/day additionals to the initial 11,000 m3/day agreed. Your task is to sell enough of the wastewater increased until you manage to have a positive budged again, considering also that by law, you must discharge a part of the wastewater to the Ezousa riverbed. But wait, things are not that easy to calculate, since now you will also need to consider the community happiness. For each 100 m³/day of water allocated to Ezousa's ecology flow, you will receive 3 happiness points. For each 100 m³/day of water extracted by the farmers with the MAR system (above the initial 11,000 m3/day), you will receive 1 happiness point. To fulfill this mission, you must achieve 85 or more happiness points. Don't forget that local drawdowns cannot be higher than 20 cm because the pumping expenses will be too large if the groundwater level is too deep.",
  gridSize: {
    x: 200,
    y: 200,
  },
  hints: [
    'First, try to meet the ecological flow demand and then play around with the abstraction rates.',
    'Find out which well is most sensitive to higher abstraction.',
    'As soon as you fulfill the new environmental law, you receive 60 happiness points.',
  ],
  modelId: 'c0d6d9eb-8737-4b43-b7fc-30796e2889cc',
  objectives: [
    {
      cells: [
        '0e35d0d3-21b8-40cc-b950-02b34efc1fd6',
        'fe73884e-2c94-4d1a-a714-6f83565dbe78',
        '171c76b2-d5b2-4af7-bc1a-9a846da20d1f',
        '448f88c5-da72-4007-a8ce-25217127c83b',
      ],
      parameters: [
        {
          id: 'p_drawdown',
          max: 0.2,
          min: 0,
          type: EParameterObjectiveType.ABSOLUTE,
        },
      ],
      type: EObjectiveType.BY_CELLS,
    },
    {
      min: 0,
      resourceId: 'res_coins',
      type: EObjectiveType.BY_RESOURCE,
    },
    {
      min: 85,
      resourceId: 'res_happiness',
      type: EObjectiveType.BY_RESOURCE,
    },
    {
      min: 2000,
      parameterId: 'p_ecological_flow',
      type: EObjectiveType.BY_PARAMETER,
    },
  ],
  objects: [
    {
      boundaryId: 'dcf1156e-3f02-4d5a-ad44-87073e0e7822',
      id: 'obj_pond_1',
      type: EGameObjectType.INFILTRATION_POND,
      location: {
        x: 0,
        y: 0,
      },
      size: {
        x: 0,
        y: 0,
      },
      parameters: [
        {
          relations: [{ resourceId: 'res_treated_wastewater' }],
          id: 'p_infiltration_rate',
          value: 0,
        },
      ],
    },
    {
      boundaryId: '151e123c-0af5-4a16-a17c-fcfebfa4de38',
      id: 'obj_pond_2',
      type: EGameObjectType.INFILTRATION_POND,
      location: {
        x: 0,
        y: 0,
      },
      size: {
        x: 0,
        y: 0,
      },
      parameters: [
        {
          relations: [{ resourceId: 'res_treated_wastewater' }],
          id: 'p_infiltration_rate',
          value: 0,
        },
      ],
    },
    {
      boundaryId: '19ea9d2a-b4ad-4d38-91e7-33de63450306',
      id: 'obj_pond_3',
      type: EGameObjectType.INFILTRATION_POND,
      location: {
        x: 0,
        y: 0,
      },
      size: {
        x: 0,
        y: 0,
      },
      parameters: [
        {
          relations: [{ resourceId: 'res_treated_wastewater' }],
          id: 'p_infiltration_rate',
          value: 0,
        },
      ],
    },
    {
      boundaryId: '09a27400-a686-4a93-811c-7749e138e977',
      id: 'obj_pond_4',
      type: EGameObjectType.INFILTRATION_POND,
      location: {
        x: 0,
        y: 0,
      },
      size: {
        x: 0,
        y: 0,
      },
      parameters: [
        {
          relations: [{ resourceId: 'res_treated_wastewater' }],
          id: 'p_infiltration_rate',
          value: 0,
        },
      ],
    },
    {
      boundaryId: '0e35d0d3-21b8-40cc-b950-02b34efc1fd6',
      id: 'obj_well_1',
      type: EGameObjectType.INFILTRATION_POND,
      location: {
        x: 0,
        y: 0,
      },
      size: {
        x: 1,
        y: 1,
      },
      parameters: [
        {
          relations: [{ resourceId: 'res_happiness', relation: 0.03 }],
          id: 'p_ecological_flow',
          min: 0,
          value: 0,
        },
        {
          relations: [
            { resourceId: 'res_happiness', relation: 0.01 },
            { resourceId: 'res_coins', relation: 0.02 },
          ],
          id: 'p_agricultural_flow',
          min: 0,
          value: 1500,
        },
      ],
    },
    {
      boundaryId: 'fe73884e-2c94-4d1a-a714-6f83565dbe78',
      id: 'obj_well_2',
      type: EGameObjectType.INFILTRATION_POND,
      location: {
        x: 100,
        y: 50,
      },
      size: {
        x: 1,
        y: 1,
      },
      parameters: [
        {
          relations: [{ resourceId: 'res_happiness', relation: 0.03 }],
          id: 'p_ecological_flow',
          min: 0,
          value: 0,
        },
        {
          relations: [
            { resourceId: 'res_happiness', relation: 0.01 },
            { resourceId: 'res_coins', relation: 0.02 },
          ],
          id: 'p_agricultural_flow',
          min: 0,
          value: 1500,
        },
      ],
    },
    {
      boundaryId: '171c76b2-d5b2-4af7-bc1a-9a846da20d1f',
      id: 'obj_well_3',
      type: EGameObjectType.INFILTRATION_POND,
      location: {
        x: 140,
        y: 50,
      },
      size: {
        x: 1,
        y: 1,
      },
      parameters: [
        {
          relations: [{ resourceId: 'res_happiness', relation: 0.03 }],
          id: 'p_ecological_flow',
          min: 0,
          value: 0,
        },
        {
          relations: [
            { resourceId: 'res_happiness', relation: 0.01 },
            { resourceId: 'res_coins', relation: 0.02 },
          ],
          id: 'p_agricultural_flow',
          min: 0,
          value: 1500,
        },
      ],
    },
    {
      boundaryId: '448f88c5-da72-4007-a8ce-25217127c83b',
      id: 'obj_well_4',
      type: EGameObjectType.INFILTRATION_POND,
      location: {
        x: 0,
        y: 0,
      },
      size: {
        x: 1,
        y: 1,
      },
      parameters: [
        {
          relations: [{ resourceId: 'res_happiness', relation: 0.03 }],
          id: 'p_ecological_flow',
          min: 0,
          value: 0,
        },
        {
          relations: [
            { resourceId: 'res_happiness', relation: 0.01 },
            { resourceId: 'res_coins', relation: 0.02 },
          ],
          id: 'p_agricultural_flow',
          min: 0,
          value: 1500,
        },
      ],
    },
  ],
  referencePoints: [
    [34.72115635900067, 32.44726181030274],
    [34.765307073357754, 32.52365112304688],
  ],
  resources: [
    {
      color: 'blue',
      id: 'res_treated_wastewater',
      min: 0,
      name: 'Treated Wasterwater',
      unit: 'm³',
      startValue: 11000,
    },
    {
      color: 'orange',
      id: 'res_coins',
      name: 'MAR Coins',
      startValue: -25,
    },
    {
      color: 'green',
      id: 'res_happiness',
      name: 'Happiness',
      startValue: 0,
    },
  ],
  subtitle: 'Infiltration ponds to achieve sustainability',
  stageSize: {
    x: 1059,
    y: 791,
  },
  title: 'Ezousa Catchment',
  tools: [
    {
      category: EGameObjectCategory.STRUCTURES,
      editParameters: ['p_infiltration_rate'],
      name: EGameObjectType.INFILTRATION_POND,
    },
    {
      category: EGameObjectCategory.STRUCTURES,
      editParameters: ['p_ecological_flow', 'p_agricultural_flow'],
      name: EGameObjectType.ABSTRACTION_WELL,
    },
  ],
};
