import { EBoundaryType } from '../model/modflow/boundaries/Boundary.type';
import { EGameObjectCategory } from './Tool.type';
import { EGameObjectType } from './GameObject.type';
import { EObjectiveType } from './Objective.type';
import { IScenario } from './Scenario.type';

const scenarios: IScenario[] = [
  {
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
    id: 'scenario_ezousa_01',
    modelId: 'c0d6d9eb-8737-4b43-b7fc-30796e2889cc',
    objectives: [
      {
        min: 0,
        resourceId: 'res_coins',
        type: EObjectiveType.BY_RESOURCE,
      },
      {
        cell: [133, 20],
        max: 0.2,
        min: 0,
        parameter: 'drawdown',
        position: { x: 370, y: 450 },
        type: EObjectiveType.BY_OBSERVATION,
      },
    ],
    objects: [
      {
        id: 'obj_riv',
        type: EGameObjectType.RIVER,
        location: {
          x: 105,
          y: 0,
        },
        locationIsFixed: true,
        size: {
          x: 4.45,
          y: 4.45,
        },
        parameters: [],
      },
      {
        id: 'wastewater_treatment_plant',
        type: EGameObjectType.WASTEWATER_TREATMENT_PLANT,
        location: {
          x: 600,
          y: 650,
        },
        locationIsFixed: true,
        size: {
          x: 130,
          y: 90,
        },
        parameters: [
          {
            id: 'p_wastewater',
            isFixed: true,
            relations: [{ isStorage: true, resourceId: 'res_treated_wastewater' }],
            value: 10000,
          },
        ],
      },
      {
        boundaryId: 'dcf1156e-3f02-4d5a-ad44-87073e0e7822',
        boundaryType: EBoundaryType.RCH,
        id: 'obj_pond_1',
        type: EGameObjectType.INFILTRATION_POND,
        location: {
          x: 540,
          y: 450,
        },
        size: {
          x: 44,
          y: 30,
        },
        parameters: [
          {
            relations: [{ resourceId: 'res_treated_wastewater' }],
            id: 'p_infiltration_rate',
            value: 0,
            valuePropertyKey: 0,
          },
        ],
      },
      {
        boundaryId: '151e123c-0af5-4a16-a17c-fcfebfa4de38',
        boundaryType: EBoundaryType.RCH,
        id: 'obj_pond_2',
        type: EGameObjectType.INFILTRATION_POND,
        location: {
          x: 580,
          y: 450,
        },
        size: {
          x: 44,
          y: 30,
        },
        parameters: [
          {
            relations: [{ resourceId: 'res_treated_wastewater' }],
            id: 'p_infiltration_rate',
            value: 0,
            valuePropertyKey: 0,
          },
        ],
      },
      {
        boundaryId: '19ea9d2a-b4ad-4d38-91e7-33de63450306',
        boundaryType: EBoundaryType.RCH,
        id: 'obj_pond_3',
        type: EGameObjectType.INFILTRATION_POND,
        location: {
          x: 520,
          y: 320,
        },
        size: {
          x: 44,
          y: 30,
        },
        parameters: [
          {
            relations: [{ resourceId: 'res_treated_wastewater' }],
            id: 'p_infiltration_rate',
            value: 0,
            valuePropertyKey: 0,
          },
        ],
      },
      {
        boundaryId: '09a27400-a686-4a93-811c-7749e138e977',
        boundaryType: EBoundaryType.RCH,
        id: 'obj_pond_4',
        type: EGameObjectType.INFILTRATION_POND,
        location: {
          x: 560,
          y: 320,
        },
        size: {
          x: 44,
          y: 30,
        },
        parameters: [
          {
            relations: [{ resourceId: 'res_treated_wastewater' }],
            id: 'p_infiltration_rate',
            value: 0,
            valuePropertyKey: 0,
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
        needsStorage: true,
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
    settings: {
      allowGameObjectsOnlyInZones: true,
    },
    subtitle: 'Infiltration ponds to achieve sustainability',
    stageSize: {
      x: 1059,
      y: 791,
    },
    title: 'Ezousa Catchment',
    tools: [
      {
        boundaryType: EBoundaryType.RCH,
        category: EGameObjectCategory.STRUCTURES,
        costs: [
          {
            amount: 10,
            refund: 10,
            resource: 'res_coins',
          },
        ],
        editParameters: [
          {
            relations: [{ resourceId: 'res_treated_wastewater' }],
            id: 'p_infiltration_rate',
            value: 0,
            valuePropertyKey: 0,
          },
        ],
        editPosition: true,
        name: EGameObjectType.INFILTRATION_POND,
        size: {
          x: 44,
          y: 30,
        },
      },
    ],
    zones: [
      {
        allowGameObjects: true,
        id: 'z_allowed_zone',
        options: {
          data: 'M876.763,-0.269c0,-0 -9.855,32.509 -13.851,42.398c-2.465,6.1 -6.113,11.727 -10.125,16.941c-4.462,5.8 -12.496,13.772 -16.649,17.859c-2.523,2.483 -6.449,3.628 -8.268,6.665c-3.743,6.247 -11.117,24.365 -14.189,30.818c-1.285,2.698 -2.651,5.37 -4.243,7.9c-3.341,5.309 -11.65,17.262 -15.802,23.955c-3.265,5.264 -5.389,11.244 -9.107,16.199c-5.482,7.306 -17.331,19.159 -23.786,27.633c-5.576,7.32 -9.334,15.918 -14.944,23.212c-6.486,8.433 -15.857,20.944 -23.973,27.386c-7.093,5.631 -9.689,10.193 -24.721,11.269c-15.032,1.076 -23.732,2.871 -34.325,2.694c-10.594,-0.178 -16.562,4.396 -18.207,11.063c-1.644,6.667 -7.067,16.521 -12.247,23.777c-5.458,7.646 -11.974,16.78 -20.499,22.097c-9.841,6.138 -29.055,9.006 -38.546,14.731c-9.491,5.726 -22.568,7.706 -37.364,7.786c-14.797,0.08 -27.727,-2.705 -36.479,5.556c-8.752,8.262 -22.992,22.182 -32.789,34.732c-10.853,13.901 -23.104,36.796 -32.326,48.677c-6.593,8.494 -16.322,14.188 -23.009,22.608c-12.439,15.663 -32.233,51.47 -51.627,71.373c-18.755,19.246 -48.215,37.042 -64.74,48.042c-10.77,7.17 -21.925,14.188 -34.409,17.961c-12.483,3.772 -10.388,4.61 -15.093,7.748c-8.019,5.35 -23.792,14.259 -33.023,24.351c-17.975,19.654 -56.657,82.637 -74.83,93.572c-12.619,7.593 -15.844,-14.774 -34.209,-27.961c-18.364,-13.188 -35.867,-17.321 -53.881,-24.544c-18.013,-7.222 -13.672,-3.991 -19.637,-7.715c-6.819,-4.257 -16.429,-12.249 -21.274,-17.826c-3.82,-4.396 -10.013,-10.25 -7.796,-15.635c2.588,-6.288 8.995,-13.179 23.324,-22.091c14.33,-8.912 35.415,-29.394 43.941,-36.524c2.441,-2.041 4.372,-4.819 7.212,-6.254c4.714,-2.38 15.723,-4.069 21.069,-8.029c5.347,-3.959 40.112,-28 49.026,-33.076c8.913,-5.076 47.824,-19.033 61.759,-28.399c13.935,-9.365 18.851,-11.627 25.178,-15.557c6.327,-3.93 19.667,-16.331 28.566,-21.137c7.623,-4.116 17.226,-4.597 24.825,-7.693c7.239,-2.949 14.149,-7.94 20.773,-10.882c6.136,-2.725 12.469,-5.095 18.972,-6.767c8.174,-2.101 20.666,-3.892 30.076,-5.84c8.822,-1.827 17.807,-3.104 26.386,-5.851c9.457,-3.028 23.287,-8.423 30.353,-12.317c7.066,-3.894 7.766,-4.525 11.634,-8.72c3.868,-4.195 52.555,-47.64 60.12,-54.631c7.564,-6.991 13.539,-13.132 22.268,-12.596c8.728,0.535 19.653,-1.412 27.627,-2.753c7.974,-1.341 15.858,-1.879 23.05,-7.71c7.191,-5.831 20.954,-12.576 29.561,-16.541c8.607,-3.965 27.775,-13.267 34.463,-24.8c6.687,-11.534 6.859,-14.333 11.879,-19.702c5.021,-5.369 8.355,-11.869 18.243,-12.513c9.888,-0.644 16.674,-4.389 22.311,-11.392c5.637,-7.002 12.784,-22.63 16.739,-29.241c2.148,-3.59 0.638,-6.978 6.992,-10.423c6.354,-3.446 10.793,-10.66 13.437,-18.251c2.643,-7.591 5.513,-11.127 11.284,-14.394c5.77,-3.267 14.387,-9.448 17.923,-13.82c3.536,-4.373 7.121,-13.473 12.962,-22.737c5.842,-9.265 15.634,-26.828 24.472,-35.285c8.838,-8.456 13.359,-12.601 18.105,-23.011c4.746,-10.409 13.861,-32.072 19.09,-37.107c5.229,-5.035 15.403,-19.278 15.403,-19.278l46.945,-0Z',
          fill: '#a68c59',
          opacity: 0.5,
          x: 105,
          y: 0,
        },
      },
    ],
  },
  {
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
    id: 'scenario_ezousa_02',
    modelId: 'c0d6d9eb-8737-4b43-b7fc-30796e2889cc',
    objectives: [
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
        boundaryId: 'river_id',
        id: 'obj_riv',
        type: EGameObjectType.RIVER,
        location: {
          x: 105,
          y: 0,
        },
        locationIsFixed: true,
        size: {
          x: 4.45,
          y: 4.45,
        },
        parameters: [],
      },
      {
        id: 'wastewater_treatment_plant',
        type: EGameObjectType.WASTEWATER_TREATMENT_PLANT,
        location: {
          x: 600,
          y: 650,
        },
        locationIsFixed: true,
        size: {
          x: 130,
          y: 90,
        },
        parameters: [
          {
            id: 'p_wastewater',
            isFixed: true,
            relations: [{ resourceId: 'res_treated_wastewater' }],
            value: 10000,
          },
        ],
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
          x: 44,
          y: 30,
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
          x: 560,
          y: 480,
        },
        size: {
          x: 44,
          y: 30,
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
          x: 510,
          y: 410,
        },
        size: {
          x: 44,
          y: 30,
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
          x: 440,
          y: 450,
        },
        size: {
          x: 44,
          y: 30,
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
        type: EGameObjectType.ABSTRACTION_WELL,
        location: {
          x: 0,
          y: 0,
        },
        size: {
          x: 47,
          y: 37,
        },
        parameters: [
          {
            relations: [{ resourceId: 'res_happiness', relation: -0.03 }],
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
        type: EGameObjectType.ABSTRACTION_WELL,
        location: {
          x: 400,
          y: 500,
        },
        size: {
          x: 47,
          y: 37,
        },
        parameters: [
          {
            relations: [{ resourceId: 'res_happiness', relation: -0.03 }],
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
        type: EGameObjectType.ABSTRACTION_WELL,
        location: {
          x: 540,
          y: 550,
        },
        size: {
          x: 47,
          y: 37,
        },
        parameters: [
          {
            relations: [{ resourceId: 'res_happiness', relation: -0.03 }],
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
        type: EGameObjectType.ABSTRACTION_WELL,
        location: {
          x: 600,
          y: 650,
        },
        size: {
          x: 47,
          y: 37,
        },
        parameters: [
          {
            relations: [{ resourceId: 'res_happiness', relation: -0.03 }],
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
    settings: {
      allowGameObjectsOnlyInZones: true,
    },
    subtitle: 'Infiltration ponds to achieve sustainability',
    stageSize: {
      x: 1059,
      y: 791,
    },
    title: 'Ezousa Catchment',
    tools: [
      {
        category: EGameObjectCategory.STRUCTURES,
        costs: [],
        editParameters: [
          {
            relations: [{ resourceId: 'res_treated_wastewater' }],
            id: 'p_infiltration_rate',
            value: 0,
          },
        ],
        name: EGameObjectType.INFILTRATION_POND,
        size: {
          x: 44,
          y: 30,
        },
      },
      {
        category: EGameObjectCategory.STRUCTURES,
        costs: [],
        editParameters: [
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
        name: EGameObjectType.ABSTRACTION_WELL,
        size: {
          x: 49,
          y: 37,
        },
      },
    ],
    zones: [],
  },
];

export default scenarios;
