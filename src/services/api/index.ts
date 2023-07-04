import { Array2D, Array3D } from '../../core/model/geometry/Array2D.type';
import { CallbackFunction, ErrorCallbackFunction } from '../../scenes/types';
import { IBudgetData, IModflowFile, IRasterFileMetadata } from './types';
import { IDateTimeValue } from '../../core/model/rtm/monitoring/Sensor.type';
import { IHeatTransportRequest } from '../../core/model/htm/Htm.type';
import { IQmraRequestConfig } from '../../core/model/qmra/Qmra.type';
import { ISimpleTool } from '../../core/model/types';
import { InterpolationType } from '../../scenes/shared/rasterData/types';
import AbstractCommand from '../../core/model/command/AbstractCommand';
import FlopyPackages from '../../core/model/flopy/packages/FlopyPackages';
import axios, { AxiosError } from 'axios';
import getConfig from '../../config.default';
import storeToCreate from '../../store';

export const {
  BASE_URL,
  DATADROPPER_URL,
  GEOPROCESSING_URL,
  JSON_SCHEMA_URL,
  MODFLOW_CALCULATION_URL,
  TIMEPROCESSING_URL,
  ENABLE_BACKEND_PHP_STORM_XDEBUG
} = getConfig();

// TODO: Check all callback function generics
const getToken = () => {
  const store = storeToCreate();
  return store.getState().session.token;
};

const createApi = (token: string | null = null) => {
  const headers: {
    Authorization?: string;
    'Content-Type': string;
  } = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }

  const defaultParams: {[key: string]: string} = {};
  if (ENABLE_BACKEND_PHP_STORM_XDEBUG) {
    defaultParams['XDEBUG_SESSION_START'] = 'PHPSTORM';
  }

  return axios.create({ baseURL: BASE_URL, headers, params: defaultParams });
};

export const sendCommand = (
  command: AbstractCommand,
  onSuccess?: CallbackFunction<undefined, void>,
  onError?: ErrorCallbackFunction
) => {
  const api = createApi(getToken());
  api
    .post('messagebox', command.toObject())
    .then((response) => response.data)
    .then(onSuccess)
    .catch(onError);
};

export const asyncSendCommand = async (command: AbstractCommand) => {
  const api = createApi(getToken());
  return api.post('messagebox', command.toObject()).then((response) => response.data);
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
  return axios
    .request({
      method: 'POST',
      url: GEOPROCESSING_URL + '/',
      data: uploadData,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.data)
    .then(onSuccess)
    .catch(onError);
};

export const sendModflowCalculationRequest = (flopyPackages: FlopyPackages) =>
  axios.request({
    method: 'POST',
    url: MODFLOW_CALCULATION_URL,
    data: flopyPackages.toFlopyCalculation(),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  });

interface IFetchRasterData {
  hash: string;
  width?: number | null;
  height?: number | null;
  method?: InterpolationType;
}

export const fetchRasterData = (
  { hash, width = null, height = null, method = InterpolationType.NEAREST_NEIGHBOR }: IFetchRasterData,
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

  return axios
    .request({
      method: 'GET',
      url,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      data: {},
    })
    .then((response) => response.data)
    .then(onSuccess)
    .catch(onError);
};

export const fetchRasterMetaData = (
  { hash }: { hash: string },
  onSuccess: CallbackFunction<IRasterFileMetadata, void>,
  onError: ErrorCallbackFunction
) => {
  const url = GEOPROCESSING_URL + '/' + hash;

  return axios
    .request({
      method: 'GET',
      url,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      data: {},
    })
    .then((response) => response.data)
    .then(onSuccess)
    .catch(onError);
};

export const makeTimeProcessingRequest = (data: IDateTimeValue[], rule: string, method: string, mode?: string) =>
  axios
    .request({
      method: 'POST',
      url: `${TIMEPROCESSING_URL}?rule=${rule}&interpolation_method=${method}&aggregate=${mode === 'aggregation'}`,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      data,
    })
    .then((r) => r.data);

export const makeHeatTransportRequest = (data: IHeatTransportRequest) => {
  const json = JSON.stringify(data);
  return axios
    .request({
      method: 'POST',
      url: 'https://opencpu.inowas.com/ocpu/library/kwb.heatsine.opencpu/R/run_optimisation/json',
      headers: {
        'Content-Type': 'application/json',
      },
      data: json,
    })
    .then((r) => r.data);
};

export const makeQmraRequest = (
  data: IQmraRequestConfig,
  onSuccess: (r: any) => any,
  onError: (e: AxiosError) => any
) => {
  const json = JSON.stringify(data);
  return axios
    .request({
      method: 'POST',
      url: 'https://opencpu.inowas.com/ocpu/library/kwb.qmra/R/opencpu_simulate_risk/json',
      headers: {
        'Content-Type': 'application/json',
      },
      data: json,
    })
    .then(onSuccess)
    .catch(onError);
};

export const fetchCalculationObservations = (calculationId: string) =>
  axios
    .request({
      method: 'GET',
      url: `${MODFLOW_CALCULATION_URL}/${calculationId}/results/types/observations`,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })
    .then((r) => r.data);

export const fetchCalculationDetails = (calculationId: string) => {
  return axios
    .request({
      method: 'GET',
      url: `${MODFLOW_CALCULATION_URL}/${calculationId}`,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      data: {},
    })
    .then((r) => r.data);
};

export const fetchCalculationResultsBudget = (
  { calculationId, totim }: { calculationId: string; totim: number },
  onSuccess: CallbackFunction<IBudgetData, void>,
  onError: (e: AxiosError) => any
) => {
  const url = `${MODFLOW_CALCULATION_URL}/${calculationId}/results/types/budget/idx/${totim}`;

  return axios
    .request({
      method: 'GET',
      url,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      data: {},
    })
    .then((response) => response.data)
    .then(onSuccess)
    .catch(onError);
};

interface IFetchCalculationResultsFlow {
  calculationId: string;
  layer: number;
  totim: number;
  type: string;
}

export const fetchCalculationResultsFlow = (
  { calculationId, layer, totim, type }: IFetchCalculationResultsFlow,
  onSuccess: CallbackFunction<Array2D<number>, void>,
  onError: ErrorCallbackFunction
) => {
  const url = `${MODFLOW_CALCULATION_URL}/${calculationId}/results/types/${type}/layers/${layer}/idx/${totim}`;

  return axios
    .request({
      method: 'GET',
      url,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      data: {},
    })
    .then((response) => response.data)
    .then(onSuccess)
    .catch(onError);
};

interface IFetchCalculationResultsTransport {
  calculationId: string;
  substance: number;
  layer: number;
  totim: number;
}

export const fetchCalculationResultsTransport = (
  { calculationId, substance, layer, totim }: IFetchCalculationResultsTransport,
  onSuccess: CallbackFunction<Array2D<number>, void>,
  onError: ErrorCallbackFunction
) => {
  const url =
    `${MODFLOW_CALCULATION_URL}/${calculationId}/results/types/concentration/substance/${substance}/` +
    `layers/${layer}/idx/${totim}`;

  return axios
    .request({
      method: 'GET',
      url,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      data: {},
    })
    .then((response) => response.data)
    .then(onSuccess)
    .catch(onError);
};

export const fetchModflowFile = (
  calculationId: string,
  fileName: string,
  onSuccess: CallbackFunction<IModflowFile, void>,
  onError: ErrorCallbackFunction
) => {
  const url = MODFLOW_CALCULATION_URL + '/' + calculationId + '/files/' + fileName;

  return axios
    .request({
      method: 'GET',
      url,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      data: {},
    })
    .then((response) => response.data)
    .then(onSuccess)
    .catch(onError);
};

export const fetchTool = (
  tool: string,
  id: string,
  onSuccess: CallbackFunction<ISimpleTool<any>, void>,
  onError: ErrorCallbackFunction
) => {
  const api = createApi(getToken());
  api
    .get(`tools/${tool}/${id}`)
    .then((response) => response.data)
    .then(onSuccess)
    .catch(onError);
};

export const asyncFetchTool = async (tool: string, id: string) => {
  const api = createApi(getToken());
  return await api.get(`tools/${tool}/${id}`).then((response) => response.data);
};

export const fetchUrl = (url: string, onSuccess?: CallbackFunction<any, void>, onError?: ErrorCallbackFunction) => {
  const api = createApi(getToken());
  api
    .get(url)
    .then((response) => response.data)
    .then(onSuccess)
    .catch(onError);
};

export const fetchApiWithToken = (url: string) => {
  const api = createApi(getToken());
  return api.get(url);
};

export const fetchUrlAndUpdate = (
  url: string,
  onUpcast: (data: any) => any,
  onSuccess?: CallbackFunction<any, void>,
  onError?: ErrorCallbackFunction
) => {
  const api = createApi(getToken());
  api
    .get(url)
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

export const submitSignUpCredentials = ({ name, email, password }: ISubmitSignUpCredentials) => {
  const api = createApi();
  return api.post('register', { name, email, password });
};

export const submitLoginCredentials = ({ username, password }: { username: string; password: string }) => {
  const api = createApi();
  return api.post('login_check', { username, password });
};

export const submitTokenLogin = (userId: string, token: string) => {
  const api = createApi();
  return api.post('token_login', { user_id: userId, token });
};

export const dropData = (data: any, onSuccess: CallbackFunction<any, void>, onError: ErrorCallbackFunction) => {
  return axios
    .request({
      method: 'POST',
      url: DATADROPPER_URL,
      data,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.data)
    .then(onSuccess)
    .catch(onError);
};

export const retrieveDroppedData = (
  filename: string,
  onSuccess: CallbackFunction<any, void>,
  onError: ErrorCallbackFunction
) => {
  const url = DATADROPPER_URL + '/' + filename;

  return axios
    .request({
      method: 'GET',
      url,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      data: {},
    })
    .then((response) => response.data)
    .then(onSuccess)
    .catch(onError);
};
