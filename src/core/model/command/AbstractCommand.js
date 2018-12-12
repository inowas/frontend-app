import Ajv from 'ajv';
import ajv0 from 'ajv/lib/refs/json-schema-draft-04';
import uuid from 'uuid';


export default class AbstractCommand {

    metadata = [];
    uuid = uuid();

    constructor(name, payload, schema = null) {
        this.message_name = name;
        this.payload = payload;
        this.schema = schema;

        const [isValid, errors] = this.validate();
        if (!isValid) {
            console.warn(
                'Invalid payload sending ' + this.message_name,
                JSON.stringify(errors)
            );
        }
    }

    validate() {
        const ajv = new Ajv({schemaId: 'auto'});

        if (!this.schema) {
            const message = 'No schema given for validation';
            console.warn(message);
            return [false, message];
        }

        ajv.addMetaSchema(ajv0);
        const val = ajv.compile(this.schema);
        const isValid = val(this.payload);
        const errors = val.errors;

        if (!isValid) {
            console.warn('Invalid payload sending ' + this.message_name, JSON.stringify(errors));
        }

        return [isValid, errors];
    }

    getPayload = () => {
        this.validate();
        return this.toObject()
    };

    toObject = () => ({
        uuid: this.uuid,
        message_name: this.message_name,
        metadata: this.metadata,
        payload: this.payload
    })
}
