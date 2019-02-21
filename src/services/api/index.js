import axios from 'axios';
import storeToCreate from 'store';

const BASE_URL = process.env.REACT_APP_API_URL + '/v2';
export const GEOPROCESSING_URL = 'https://geoprocessing.inowas.com';
export const JSON_SCHEMA_URL = 'https://schema.inowas.com/';

const getToken = () => {
    const store = storeToCreate();
    return store.getState().session.apiKey;
};

const createApi = (token = null) => {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['X-AUTH-TOKEN'] = token;
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
        }
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
        }
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

export const submitSignUpCredentials = ({name, username, email, password, redirectTo}, onSuccess, onError) => {
    const api = createApi();
    const payload = {name, username, email, password, redirectTo};
    api.post('users/signup.json', payload)
        .then(onSuccess)
        .catch(onError);
};

export const submitLoginCredentials = ({username, password}, onSuccess, onError) => {
    const api = createApi();
    const payload = {username, password};
    api.post('users/credentials.json', payload)
        .then(onSuccess)
        .catch(onError);
};
