import axios from 'axios';
import storeToCreate from '../../store';
import FlopyPackages from '../../core/model/flopy/packages/FlopyPackages';

const BASE_URL = process.env.REACT_APP_API_URL + '/v3';
export const DATADROPPER_URL = 'https://datadropper.inowas.com';
export const GEOPROCESSING_URL = 'https://geoprocessing.inowas.com';
export const MODFLOW_CALCULATION_URL = 'https://modflow.inowas.com';
export const JSON_SCHEMA_URL = process.env.REACT_APP_SCHEMA_URL || 'https://schema.inowas.com';

const getToken = () => {
    const store = storeToCreate();
    return store.getState().session.token;
};

const createApi = (token = null) => {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    return axios.create({baseURL: BASE_URL, headers});
};

export const sendCommand = (command, onSuccess, onError) => {
    const api = createApi(getToken());
    api.post('messagebox', command.toObject())
        .then(response => response.data)
        .then(onSuccess)
        .catch(onError);
};

export const uploadRasterfileToApi = (file, onSuccess, onError) => {
    const uploadData = new FormData();
    uploadData.append('file', file);
    const api = createApi(true);
    api.post('rasterfile', uploadData).then(response => response.data).then(onSuccess).catch(onError);
};

export const uploadRasterfile = (file, onSuccess, onError) => {
    const uploadData = new FormData();
    uploadData.append('file', file);
    return axios({
        method: 'POST',
        url: GEOPROCESSING_URL,
        data: uploadData,
        mode: 'no-cors',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        }
    }).then(response => response.data).then(onSuccess).catch(onError);
};

export const sendCalculationRequest = (flopyPackages, onSuccess, onError) => {
    if (!(flopyPackages instanceof FlopyPackages)) {
        throw new Error('Expecting instance of FlopyPackages');
    }

    flopyPackages.validate(true).then(
        () => axios({
            method: 'POST',
            url: MODFLOW_CALCULATION_URL,
            data: flopyPackages.toFlopyCalculation(),
            mode: 'no-cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            }
        }).then(response => response.data).then(onSuccess).catch(onError),
    ).catch(e => console.log(e));
};

export const fetchRasterData = (
    {hash, width = null, height = null, method = 1}, onSuccess, onError) => {
    let url = GEOPROCESSING_URL + '/' + hash + '/data';

    if (width && height) {
        url += '/' + width + '/' + height;

        if (!isNaN(method)) {
            url += '/' + method;
        }
    }

    return axios({
        method: 'GET',
        url: url,
        mode: 'no-cors',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        data: {}
    }).then(response => response.data).then(onSuccess).catch(onError);
};

export const fetchRasterMetaData = (
    {hash}, onSuccess, onError) => {
    const url = GEOPROCESSING_URL + '/' + hash;

    return axios({
        method: 'GET',
        url: url,
        mode: 'no-cors',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        data: {}
    }).then(response => response.data).then(onSuccess).catch(onError);
};

export const fetchCalculationDetails = (
    calculation_id, onSuccess, onError) => {
    const url = `${MODFLOW_CALCULATION_URL}/${calculation_id}`;

    return axios({
        method: 'GET',
        url: url,
        mode: 'no-cors',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        data: {}
    }).then(response => response.data).then(onSuccess).catch(onError);
};

export const fetchCalculationResultsFlow = ({calculationId, layer, totim, type}, onSuccess, onError) => {
    const url = `${MODFLOW_CALCULATION_URL}/${calculationId}/results/types/${type}/layers/${layer}/totims/${totim}`;

    return axios({
        method: 'GET',
        url: url,
        mode: 'no-cors',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        data: {}
    }).then(response => response.data).then(onSuccess).catch(onError);
};

export const fetchCalculationResultsTransport = ({calculationId, substance, layer, totim}, onSuccess, onError) => {
    const url = `${MODFLOW_CALCULATION_URL}/${calculationId}/results/types/concentration/substance/${substance}/layers/${layer}/totims/${totim}`;

    return axios({
        method: 'GET',
        url: url,
        mode: 'no-cors',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        data: {}
    }).then(response => response.data).then(onSuccess).catch(onError);
};

export const fetchModflowFile = (
    calculation_id, file_name, onSuccess, onError) => {
    const url = MODFLOW_CALCULATION_URL + '/' + calculation_id + '/files/' + file_name;

    return axios({
        method: 'GET',
        url: url,
        mode: 'no-cors',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        data: {}
    }).then(response => response.data).then(onSuccess).catch(onError);
};

export const fetchTool = (tool, id, onSuccess, onError) => {
    const api = createApi(getToken());
    api.get(`tools/${tool}/${id}`)
        .then(response => response.data)
        .then(onSuccess)
        .catch(onError);
};

export const fetchUrl = (url, onSuccess, onError) => {
    const api = createApi(getToken());
    api.get(url)
        .then(response => response.data)
        .then(onSuccess)
        .catch(onError);
};

export const submitSignUpCredentials = ({name, email, password}, onSuccess, onError) => {
    const api = createApi();
    const payload = {name, email, password};
    api.post('register', payload)
        .then(onSuccess)
        .catch(onError);
};

export const submitLoginCredentials = ({username, password}, onSuccess, onError) => {
    const api = createApi();
    const payload = {username, password};
    api.post('login_check', payload)
        .then(onSuccess)
        .catch(onError);
};

export const dropData = (data, onSuccess, onError) => {
    return axios({
        method: 'POST',
        url: DATADROPPER_URL,
        data: data,
        mode: 'no-cors',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        }
    }).then(response => response.data).then(onSuccess).catch(onError);
};

export const retrieveDroppedData = (filename, onSuccess, onError) => {
    const url = DATADROPPER_URL + '/' + filename;

    return axios({
        method: 'GET',
        url: url,
        mode: 'no-cors',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        data: {}
    }).then(response => response.data).then(onSuccess).catch(onError);
};
