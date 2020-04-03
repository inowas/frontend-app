import Uuid from 'uuid';
import {EMessageState, IMessage} from '../../../core/model/messages/Message.type';

export const messageDirty = (origin: string): IMessage => ({
    id: Uuid.v4(),
    name: 'dirty',
    origin,
    state: EMessageState.IN_PROGRESS,
});

export const messageSaving = (origin: string): IMessage => ({
    id: Uuid.v4(),
    name: 'saving',
    origin,
    state: EMessageState.IN_PROGRESS,
});

export const messageError = (origin: string, text: string): IMessage => ({
    id: Uuid.v4(),
    name: 'error',
    origin,
    text,
    state: EMessageState.ERROR
});

export interface IEditingState {
    [key: string]: IMessage | null;
}

export const initialEditingState: IEditingState = {
    dirty: null,
    saving: null
};
