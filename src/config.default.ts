const getConfig = () => ({
    // eslint-disable-next-line no-restricted-globals
    URL: `${location.protocol}//${location.host}`,
    BASE_URL: process.env.REACT_APP_API_URL + '/v3',
    DATADROPPER_URL: process.env.REACT_APP_DATADROPPER_URL || 'https://datadropper.inowas.com',
    DISABLE_TOOL: process.env.REACT_APP_DISABLE_TOOL || '',
    GEOPROCESSING_URL: process.env.REACT_APP_GEOPROCESSING_URL || 'https://processing.inowas.com/rasters',
    TIMEPROCESSING_URL: process.env.REACT_APP_GEOPROCESSING_URL || 'https://processing.inowas.com/timeseries/resample',
    JSON_SCHEMA_URL: process.env.REACT_APP_JSON_SCHEMA_URL || 'https://schema.inowas.com',
    MODFLOW_CALCULATION_URL: process.env.REACT_APP_MODFLOW_CALCULATION_URL || 'https://modflow.inowas.com',
    PUBLIC_PROJECTS_ACCESS: process.env.REACT_APP_PUBLIC_PROJECTS_ACCESS !== 'false',
    USERS_CAN_REGISTER: process.env.REACT_APP_USERS_CAN_REGISTER !== 'false',
    VERSION: process.env.REACT_APP_VERSION || 'dev'
});

export default getConfig;
