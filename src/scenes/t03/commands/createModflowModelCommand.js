import Command from "./command";
import createModflowModelPayload from "./createModflowModelPayloadSchema";

export default class CreateModflowModelCommand extends Command {
    constructor(payload) {
        super("createModflowModel", payload, createModflowModelPayload);
    }
}
