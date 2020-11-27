import {sendCommand} from './index';
import ModflowModelCommand from '../../scenes/t03/commands/modflowModelCommand';

// {raster, oldUrl, onSuccess}
export const sendCommands = (commands: ModflowModelCommand[], onSuccess: () => void, onError: (e: any) => void,
                             onSendCommand: () => void = () => null) => {
    const handleSuccess = () => {
        if (commands.length === 0) {
            onSuccess();
        } else {
            sendCommands(commands, onSuccess, onError);
        }
    };

    const command = commands.shift();
    if (command) {
        onSendCommand();
        sendCommand(command, handleSuccess, onError);
    }
};
