import IExposureScenario from '../../../../core/model/qmra/ExposureScenario.type';

const scenarios: IExposureScenario[] = [
  {
    description: '100 g of lettuce leaves hold 10.8 mL water and cucumbers 0.4 mL at worst case (immediately post' +
      'watering). A serve of lettuce (40 g) might hold 5 mL of recycled water and other produce might hold up to 1 mL' +
      'per serve. Calculated frequencies are based on Autralian Bureau of Statistics (ABS) data',
    eventsPerYear: {type: 'value', value: 70, min: 0, max: 1, mode: 1},
    litresPerEvent: {type: 'value', value: 0.005, min: 0, max: 1, mode: 1},
    name: 'Irrigation, unrestricted',
    reference: 'EPHC, NRMMC, AHMC (2006)',
    link: 'https://www.susana.org/en/knowledge-hub/resources-and-publications/library/details/1533'
  },
  {
    description: 'Based on unrestricted irrigation, but far less frequent due to restricted access',
    eventsPerYear: {type: 'value', value: 1, min: 0, max: 1, mode: 1},
    litresPerEvent: {type: 'value', value: 0.005, min: 0, max: 1, mode: 1},
    name: 'Irrigation, restricted',
    reference: '',
    link: ''
  },
  {
    description: 'Frequencies moderate as most people use municipal areas sparingly (estimate 1/2 - 3 weeks). People are ' +
      'unlikely to be directly exposed to large amounts of spray and therefore exposure is from indirect ingestion via ' +
      'contact with lawns, etc. Likely to be higher when used to irrigate facilities such as sports grounds or golf ' +
      'courses (estimate 1/week) grounds and golf courses (estimate 1/week)',
    eventsPerYear: {type: 'value', value: 50, min: 0, max: 1, mode: 1},
    litresPerEvent: {type: 'value', value: 0.001, min: 0, max: 1, mode: 1},
    name: 'Irrigation, public',
    reference: 'EPHC, NRMMC, AHMC (2006)',
    link: 'https://www.susana.org/en/knowledge-hub/resources-and-publications/library/details/1533'
  },
  {
    description: 'Garden watering estimated to typically occur every second day during dry months (half year). Routine ' +
      ' exposure results from indirect ingestion via contact with plants, lawns, etc.',
    eventsPerYear: {type: 'value', value: 90, min: 0, max: 1, mode: 1},
    litresPerEvent: {type: 'value', value: 0.001, min: 0, max: 1, mode: 1},
    name: 'Irrigation, garden',
    reference: 'EPHC, NRMMC, AHMC (2006)',
    link: 'https://www.susana.org/en/knowledge-hub/resources-and-publications/library/details/1533'
  },
  {
    description: 'Assumed similar to garden watering estimated to typically occur every second day during dry months ' +
      '(half year). Exposure to aerosols occurs during watering.',
    eventsPerYear: {type: 'value', value: 25, min: 0, max: 1, mode: 1},
    litresPerEvent: {type: 'value', value: 1e-04, min: 0, max: 1, mode: 1},
    name: 'Domestic use, car washing',
    reference: '',
    link: ''
  },
  {
    description: 'Frequency based on three uses of home toilet per day. Aerosol volumes are less than those produced by ' +
      'garden irrigation.',
    eventsPerYear: {type: 'value', value: 1100, min: 0, max: 1, mode: 1},
    litresPerEvent: {type: 'value', value: 1e-05, min: 0, max: 1, mode: 1},
    name: 'Domestic use, toilet flushing',
    reference: 'EPHC, NRMMC, AHMC (2006)',
    link: 'https://www.susana.org/en/knowledge-hub/resources-and-publications/library/details/1533'
  },
  {
    description: 'Assumes one member of household exposed. Calculated frequency based on Australian Bureau of Statistics ' +
      '(ABS) data. Aerosol volumes are less than those produced by garden irrigation (machines usually closed during ' +
      'operation).',
    eventsPerYear: {type: 'value', value: 100, min: 0, max: 1, mode: 1},
    litresPerEvent: {type: 'value', value: 1e-05, min: 0, max: 1, mode: 1},
    name: 'Domestic use, washing machine',
    reference: 'EPHC, NRMMC, AHMC (2006)',
    link: 'https://www.susana.org/en/knowledge-hub/resources-and-publications/library/details/1533'
  },
  {
    description: 'Assumption for ingestion of drinking water',
    eventsPerYear: {type: 'value', value: 365, min: 0, max: 1, mode: 1},
    litresPerEvent: {type: 'value', value: 1, min: 0, max: 1, mode: 1},
    name: 'Drinking water',
    reference: '',
    link: ''
  }
];

export default scenarios;
