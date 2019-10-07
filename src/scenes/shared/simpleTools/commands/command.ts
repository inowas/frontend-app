import uuid from 'uuid';
import AbstractCommand from '../../../../core/model/command/AbstractCommand';
import {ICommand} from './command.type';

class Command extends AbstractCommand {
    public static createToolInstance = (payload: any) => {
        return new Command('createToolInstance', payload);
    };

    public static updateToolInstance = (payload: any) => {
        return new Command('updateToolInstance', payload);
    };

    public static updateToolInstanceMetadata = (payload: any) => {
        return new Command('updateToolInstanceMetadata', payload);
    };

    protected _props: ICommand = {
        uuid: uuid(),
        message_name: '',
        metadata: {},
        payload: null
    };
}

export default Command;
