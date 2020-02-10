import axios from 'axios';
import getConfig from '../../config.default.js';
import AbstractCommand from '../../core/model/command/AbstractCommand';
import FlopyPackages from '../../core/model/flopy/packages/FlopyPackages';
import {Array2D, Array3D} from '../../core/model/geometry/Array2D.type';
import {IDateTimeValue} from '../../core/model/rtm/Sensor.type';
import {IMetaData, ISimpleTool} from '../../core/model/types';
import {InterpolationType} from '../../scenes/shared/rasterData/types';
import {CallbackFunction, ErrorCallbackFunction} from '../../scenes/types';
import storeToCreate from '../../store';
import {IBudgetData, IModflowFile, IRasterFileMetadata} from './types';

export const {
    BASE_URL,
    DATADROPPER_URL,
    GEOPROCESSING_URL,
    JSON_SCHEMA_URL,
    MODFLOW_CALCULATION_URL,
    TIMEPROCESSING_URL
} = getConfig();

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
    command: AbstractCommand,
    onSuccess?: CallbackFunction<undefined, void>,
    onError?: ErrorCallbackFunction
) => {
    const api = createApi(getToken());
    api.post('messagebox', command.toObject())
        .then((response) => response.data)
        .then(onSuccess)
        .catch(onError);
};

export const sendCommandAsync = async (command: AbstractCommand) => {
    const api = createApi(getToken());
    return await api.post('messagebox', command.toObject()).then((response) => response.data);
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
        url: GEOPROCESSING_URL + '/',
        data: uploadData,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.data).then(onSuccess).catch(onError);
};

export const sendModflowCalculationRequest = (flopyPackages: FlopyPackages) =>
    axios.request({
        method: 'POST',
        url: MODFLOW_CALCULATION_URL,
        data: flopyPackages.toFlopyCalculation(),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        }
    });

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

export const makeTimeProcessingRequest = (data: IDateTimeValue[], rule: string, method: string) => (
    axios.request({
        method: 'POST',
        url: `${TIMEPROCESSING_URL}?rule=${rule}&interpolation_method=${method}`,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        data
    }).then((r) => r.data)
);

export const fetchCalculationObservations = (calculationId: string) => (
    axios.request({
        method: 'GET',
        url: `${MODFLOW_CALCULATION_URL}/${calculationId}/results/types/observations`,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
    }).then((r) => r.data));

export const fetchCalculationDetails = (calculationId: string) => {
    return axios.request({
        method: 'GET',
        url: `${MODFLOW_CALCULATION_URL}/${calculationId}`,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        data: {}
    }).then((r) => r.data);
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

export const fetchUrlAndUpdate = (
    url: string,
    onUpcast: (data: any) => any,
    onSuccess?: CallbackFunction<any, void>,
    onError?: ErrorCallbackFunction
) => {
    const api = createApi(getToken());
    api.get(url)
        .then((response) => response.data)
        .then((data) => onUpcast(data))
        .then(onSuccess)
        .catch(onError);
};

interface ISubmitSignUpCredentials {
    name: string;
    email: string;
    password: string;
}

export const submitSignUpCredentials = ({name, email, password}: ISubmitSignUpCredentials) => {
    const api = createApi();
    return api.post('register', {name, email, password});
};

export const submitLoginCredentials = ({username, password}: { username: string, password: string }) => {
    const api = createApi();
    return api.post('login_check', {username, password});
};

export const dropData = (
    data: any,
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
    onSuccess: CallbackFunction<any, void>,
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
