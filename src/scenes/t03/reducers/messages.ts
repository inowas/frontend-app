import _ from 'lodash';
import {CLEAR} from './model';

export const ADD_MESSAGE = 'T03_ADD_MESSAGE';
export const REMOVE_MESSAGE = 'T03_REMOVE_MESSAGE';
export const UPDATE_MESSAGE = 'T03_UPDATE_MESSAGE';

export enum EMessageState {
    IN_PROGRESS = 'inProgress',
    SUCCESS = 'success',
    ERROR = 'error'
}

export interface IMessage {
    id: string;
    name: string;
    text?: string;
    origin?: string;
    state?: EMessageState;
    timestamp?: number;
}

const initialState = () => [];

const messages = (state: IMessage[] = [], action: { type: string, payload?: IMessage }) => {
    switch (action.type) {
        case CLEAR:
            return initialState();

        case ADD_MESSAGE:
            const cMessages = _.cloneDeep(state);
            if (action.payload) {
                cMessages.push(action.payload);
            }
            return cMessages;

        case REMOVE_MESSAGE:
            return state.filter((m) => action.payload ? m.id !== action.payload.id : true);

        case UPDATE_MESSAGE:
            return state.map((m) => {
                if (action.payload && m.id === action.payload.id) {
                    return action.payload;
                }
                return m;
            });

        default:
            return state;
    }
};

export default messages;
