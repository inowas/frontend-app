export enum EMessageState {
    IN_PROGRESS = 'inProgress',
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning'
}

export interface IMessage {
    id: string;
    name: string;
    text?: string;
    origin?: string;
    state?: EMessageState;
    timestamp?: number;
}
