import axios, {AxiosResponse} from 'axios';
import getConfig from '../../config.default.js';
import FlopyPackages from '../../core/model/flopy/packages/FlopyPackages';
import {Array2D, Array3D} from '../../core/model/geometry/Array2D.type';
import {ICalculation} from '../../core/model/modflow/Calculation.type';
import {IMetaData, ISimpleTool} from '../../core/model/types';
import {InterpolationType} from '../../scenes/shared/rasterData/types';
import ModflowModelCommand from '../../scenes/t03/commands/modflowModelCommand';
import {CallbackFunction, ErrorCallbackFunction} from '../../scenes/types';
import storeToCreate from '../../store';
import {IBudgetData, IModflowFile, IRasterFileMetadata} from './types';

export const {BASE_URL, DATADROPPER_URL, GEOPROCESSING_URL, MODFLOW_CALCULATION_URL, JSON_SCHEMA_URL} = getConfig();

// TODO: Check all callback function generics

const getToken = () => {
    const store = storeToCreate();
    return store.getState().session.token;
};

const createApi = (token: boolean = false) => {
    const headers: {
        'Authorization'?: string;
        'Content-Type': string;
    } = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers.Authorization = 'Bearer ' + token;
    }

    return axios.create({baseURL: BASE_URL, headers});
};

export const sendCommand = (
    command: ModflowModelCommand,
    onSuccess?: CallbackFunction<undefined, void>,
    onError?: ErrorCallbackFunction
) => {
    const api = createApi(getToken());
    api.post('messagebox', command.toObject())
        .then((response) => response.data)
        .then(onSuccess)
        .catch(onError);
};

export const uploadRasterfileToApi = (
    file: File,
    onSuccess: CallbackFunction<undefined, void>,
    onError: ErrorCallbackFunction
) => {
    const uploadData = new FormData();
    uploadData.append('file', file);
    const api = createApi(true);
    api.post('rasterfile', uploadData).then((response) => response.data).then(onSuccess).catch(onError);
};

export const uploadRasterfile = (
    file: File,
    onSuccess: CallbackFunction<{ hash: string }, void>,
    onError: ErrorCallbackFunction
) => {
    const uploadData = new FormData();
    uploadData.append('file', file);
    return axios.request({
        method: 'POST',
        url: GEOPROCESSING_URL,
        data: uploadData,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.data).then(onSuccess).catch(onError);
};

export const sendCalculationRequest = (
    flopyPackages: FlopyPackages,
    onSuccess: CallbackFunction<undefined, void>,
    onError: ErrorCallbackFunction
) => {
    flopyPackages.validate(true).then(
        () => axios.request({
            method: 'POST',
            url: MODFLOW_CALCULATION_URL,
            data: flopyPackages.toFlopyCalculation(),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.data).then(onSuccess).catch(onError),
    ).catch((e) => console.log(e));
};

interface IFetchRasterData {
    hash: string;
    width?: number | null;
    height?: number | null;
    method?: InterpolationType;
}

export const fetchRasterData = (
    {hash, width = null, height = null, method = InterpolationType.NEAREST_NEIGHBOR}: IFetchRasterData,
    onSuccess: CallbackFunction<Array3D<number>, void>,
    onError: ErrorCallbackFunction
) => {
    let url = GEOPROCESSING_URL + '/' + hash + '/data';

    if (width && height) {
        url += '/' + width + '/' + height;

        if (!isNaN(method)) {
            url += '/' + method;
        }
    }

    return axios.request({
        method: 'GET',
        url,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        data: {}
    }).then((response) => response.data).then(onSuccess).catch(onError);
};

export const fetchRasterMetaData = (
    {hash}: { hash: string },
    onSuccess: CallbackFunction<IRasterFileMetadata, void>,
    onError: ErrorCallbackFunction
) => {
    const url = GEOPROCESSING_URL + '/' + hash;

    return axios.request({
        method: 'GET',
        url,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        data: {}
    }).then((response) => response.data).then(onSuccess).catch(onError);
};

export const fetchCalculationDetails = (
    calculationId: string,
    onSuccess: CallbackFunction<ICalculation, void>,
    onError: ErrorCallbackFunction
) => {
    const url = `${MODFLOW_CALCULATION_URL}/${calculationId}`;

    return axios.request({
        method: 'GET',
        url,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        data: {}
    }).then((response) => response.data).then(onSuccess).catch(onError);
};

export const fetchCalculationResultsBudget = (
    {calculationId, totim}: { calculationId: string, totim: number },
    onSuccess: CallbackFunction<IBudgetData, void>,
    onError: ErrorCallbackFunction
) => {
    const url = `${MODFLOW_CALCULATION_URL}/${calculationId}/results/types/budget/totims/${totim}`;

    return axios.request({
        method: 'GET',
        url,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        data: {}
    }).then((response) => response.data).then(onSuccess).catch(onError);
};

interface IFetchCalculationResultsFlow {
    calculationId: string;
    layer: number;
    totim: number;
    type: string;
}

export const fetchCalculationResultsFlow = (
    {calculationId, layer, totim, type}: IFetchCalculationResultsFlow,
    onSuccess: CallbackFunction<Array2D<number>, void>,
    onError: ErrorCallbackFunction
) => {
    const url = `${MODFLOW_CALCULATION_URL}/${calculationId}/results/types/${type}/layers/${layer}/totims/${totim}`;

    return axios.request({
        method: 'GET',
        url,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        data: {}
    }).then((response) => response.data).then(onSuccess).catch(onError);
};

interface IFetchCalculationResultsTransport {
    calculationId: string;
    substance: string;
    layer: string;
    totim: number;
}

export const fetchCalculationResultsTransport = (
    {calculationId, substance, layer, totim}: IFetchCalculationResultsTransport,
    onSuccess: CallbackFunction<Array2D<number>, void>,
    onError: ErrorCallbackFunction
) => {
    const url = `${MODFLOW_CALCULATION_URL}/${calculationId}/results/types/concentration/substance/${substance}/` +
        `layers/${layer}/totims/${totim}`;

    return axios.request({
        method: 'GET',
        url,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        data: {}
    }).then((response) => response.data).then(onSuccess).catch(onError);
};

export const fetchModflowFile = (
    calculationId: string, fileName: string,
    onSuccess: CallbackFunction<IModflowFile, void>,
    onError: ErrorCallbackFunction
) => {
    const url = MODFLOW_CALCULATION_URL + '/' + calculationId + '/files/' + fileName;

    return axios.request({
        method: 'GET',
        url,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        data: {}
    }).then((response) => response.data).then(onSuccess).catch(onError);
};

export const fetchTool = (
    tool: string,
    id: string,
    onSuccess: CallbackFunction<ISimpleTool<IMetaData>, void>,
    onError: ErrorCallbackFunction
) => {
    const api = createApi(getToken());
    api.get(`tools/${tool}/${id}`)
        .then((response) => response.data)
        .then(onSuccess)
        .catch(onError);
};

export const fetchUrl = (
    url: string,
    onSuccess?: CallbackFunction<any, void>,
    onError?: ErrorCallbackFunction
) => {
    const api = createApi(getToken());
    api.get(url)
        .then((response) => response.data)
        .then(onSuccess)
        .catch(onError);
};

interface ISubmitSignUpCredentials {
    name: string;
    email: string;
    password: string;
}

export const submitSignUpCredentials = (
    {name, email, password}: ISubmitSignUpCredentials,
    onSuccess: CallbackFunction<AxiosResponse<any>, void>,
    onError: ErrorCallbackFunction
) => {
    const api = createApi();
    const payload = {name, email, password};
    api.post('register', payload)
        .then(onSuccess)
        .catch(onError);
};

export const submitLoginCredentials = (
    {username, password}: { username: string, password: string },
    onSuccess: CallbackFunction<any, void>,
    onError: ErrorCallbackFunction
) => {
    const api = createApi();
    const payload = {username, password};
    api.post('login_check', payload)
        .then(onSuccess)
        .catch(onError);
};

export const dropData = (
    data: object,
    onSuccess: CallbackFunction<any, void>,
    onError: ErrorCallbackFunction
) => {
    return axios.request({
        method: 'POST',
        url: DATADROPPER_URL,
        data,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.data).then(onSuccess).catch(onError);
};

export const retrieveDroppedData = (
    filename: string,
    onSuccess: CallbackFunction<Array3D<number>, void>,
    onError: ErrorCallbackFunction
) => {
    const url = DATADROPPER_URL + '/' + filename;

    return axios.request({
        method: 'GET',
        url,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        data: {}
    }).then((response) => response.data).then(onSuccess).catch(onError);
};

interface IFetchSensorData {
    server: string;
    query: string;
}

export const fetchSensorData = (
    {server, query}: IFetchSensorData,
    onSuccess: CallbackFunction<any, any>,
    onError: ErrorCallbackFunction
) => (
    axios.request({
        method: 'GET',
        url: server + '/' + query,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        data: {}
    }).then((response) => response.data).then(onSuccess).catch(onError)
);
