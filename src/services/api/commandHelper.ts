import ModflowModelCommand from '../../scenes/t03/commands/modflowModelCommand';
import {sendCommand} from './index';

// {raster, oldUrl, onSuccess}
export const sendCommands = (commands: ModflowModelCommand[], onSuccess: () => void, onError: () => void) => {
    if (commands.length === 0) {
        return;
    }

    const command = commands.shift();
    sendCommand(command, onSuccess, onError);

    sendCommands(commands, onSuccess, onError);
};
