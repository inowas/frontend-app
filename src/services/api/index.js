import axios from 'axios';
import storeToCreate from 'store';

const BASE_URL = process.env.REACT_APP_API_URL + '/v2';
const store = storeToCreate();

const select = (state) => {
    return state.session.apiKey;
};

const createApi = () => axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-AUTH-TOKEN': select(store.getState())
    }
});

export const sendCommand = (command, onSuccess, onError) => {
    const api = createApi();
    api.post('messagebox', command.toObject())
        .then(response => response.data)
        .then(onSuccess)
        .catch(onError);
};

export const uploadRasterfileToApi = (file, onSuccess, onError) => {
    const uploadData = new FormData();
    uploadData.append('file', file);
    const api = createApi();
    api.post('rasterfile', uploadData).then(response => response.data).then(onSuccess).catch(onError);
};

export const uploadRasterfile = (file, onSuccess, onError) => {
    const uploadData = new FormData();
    uploadData.append('file', file);
    axios.post('https://geoprocessing.inowas.com', uploadData).then(response => response.data).then(onSuccess).catch(onError);
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
    const api = createApi();
    api.get(`tools/${tool}/${id}`)
        .then(response => response.data)
        .then(onSuccess)
        .catch(onError);
};

export const fetchUrl = (url, onSuccess, onError) => {
    const api = createApi();
    api.get(url)
        .then(response => response.data)
        .then(onSuccess)
        .catch(onError);
};

export const signUpUser = ({name, username, email, password, redirectTo}, onSuccess, onError) => {
    const api = createApi();
    const payload = {name, username, email, password, redirectTo};
    api.post('users/signup.json', payload)
        .then(onSuccess)
        .catch(onError);
};
