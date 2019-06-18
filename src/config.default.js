const getConfig = () => {
    const defaultConfig = {
        BASE_URL: process.env.REACT_APP_API_URL + '/v3',
        DATADROPPER_URL: 'https://datadropper.inowas.com',
        GEOPROCESSING_URL: 'https://geoprocessing.inowas.com',
        MODFLOW_CALCULATION_URL: 'https://modflow.inowas.com',
        JSON_SCHEMA_URL: process.env.REACT_APP_SCHEMA_URL || 'https://schema.inowas.com',
        USERS_CAN_REGISTER: true
    };

    let overrideConfig = {};
    try {
        overrideConfig = require('./config.override.js').default;
    } catch (e) {
        overrideConfig = null;
    }

    if (overrideConfig) {
        for (const key in overrideConfig) {
            if (overrideConfig.hasOwnProperty(key)) {
                defaultConfig[key] = overrideConfig[key]
            }
        }
    }

    return defaultConfig;
};

export default getConfig;
