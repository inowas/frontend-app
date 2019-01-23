import axios from 'axios';
import storeToCreate from 'store';

const BASE_URL = process.env.REACT_APP_API_URL + '/v2';

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

export const uploadRasterfile = (file, onSuccess, onError) => {
    const uploadData = new FormData();
    uploadData.append('file', file);
    const api = createApi(true);
    api.post('rasterfile', uploadData).then(response => response.data).then(onSuccess).catch(onError);
};

export const fetchRasterfile = (
    {hash, width = null, height = null}, onSuccess, onError) => {
    let url = 'rasterfile/' + hash;
    if (width && height) {
        url += '?width=' + width + '&height=' + height
    }
    return fetchUrl(url, onSuccess, onError);
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
