import Command from "./command";
import createModflowModelPayload from "./createModflowModelPayload";

export default class CreateModflowModel extends Command {
    constructor(payload) {
        super("createModflowModel", payload, createModflowModelPayload);
    }
}
