import ModflowModelCommand from '../../scenes/t03/commands/modflowModelCommand';
import {sendCommand} from './index';

// {raster, oldUrl, onSuccess}
export const sendCommands = (commands: ModflowModelCommand[], onSuccess: () => void, onError: () => void,
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