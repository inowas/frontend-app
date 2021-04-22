const descriptions = {
  dalys_per_case: 'expresses the severity of the illness, which is multiplied with the illness probability\n' +
    'for calculating the DALYs of each event',
  dose_response: 'Dose response relationships of the selected pathogens to estimate the severity of infections. The\n' +
    'dose – response models are based on experimental data, see e.g.\n' +
    'http://qmrawiki.msu.edu/index.php?title=Dose_Response.\n' +
    'https://kwb-r.github.io/qmra.db/articles/database_content.html#dose-response',
  exposure: 'Ingested volume per event defines the end-use of water after treatment train. Potable and nonpotable\n' +
    'end-use can be defined.',
  health: 'For calculating the health risk of each event, expressed in disability-adjusted life years (DALY), the\n' +
    'following two health parameters for each pathogen are required:\n' +
    'https://kwb-r.github.io/qmra.db/articles/database_content.html#health',
  infection_to_illness: 'constant factor by which the infection probability is multiplied for\n' +
    'converting into an illness probability',
  inflow: 'The microbiological risk assessment starts with the selection and inflow characterisation of relevant\n' +
    'pathogens. It is recommended to select at least one pathogen for bacteria, protozoa and virus. The\n' +
    'Probability Density Function (PDF) is the basis for the probabilistic risk assessment. Input data is\n' +
    'considered to be highly variable and quantified by using the PDF.',
  number_of_exposures: 'Number of exposure events per year: determines how often random values for the input parameters\n' +
    'inflow concentration and treatment train reduction are drawn.',
  number_of_repeatings: 'For each exposure scenario, treatment scheme and pathogen, the risk calculation is repeated by\n' +
    'predefined Monte Carlo runs. At least 1000 runs are recommended.',
  processes: 'The selection of treatment steps and associated log-reductions for each pathogen group and\n' +
    'treatment step.',

};

export default descriptions;

