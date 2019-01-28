import Ajv from 'ajv';
import ajv0 from 'ajv/lib/refs/json-schema-draft-04';
import jsrp from 'json-schema-ref-parser'
import uuid from 'uuid';


export default class AbstractCommand {

    metadata = {};
    uuid = uuid();

    constructor(name, payload, schema = null) {
        this.message_name = name;
        this.payload = payload;
        this.schema = schema;
        this.validate();
    }

    validate() {
        return new Promise((resolve) => {
            if (!this.schema) {
                const message = 'No schema given for validation';
                console.warn(message);
                resolve([false, message]);
                return;
            }

            const ajv = new Ajv({schemaId: 'auto'});

            // THE WAY WITH URLs
            if (this.schema.indexOf('https://') === 0) {
                jsrp.dereference({'$ref': this.schema})
                    .then(schema => {
                        const val = ajv.compile(schema);
                        const isValid = val(this.toObject());
                        const errors = val.errors;

                        if (!isValid) {
                            console.warn('Invalid payload sending ' + this.message_name, this.toObject(), this.schema, JSON.stringify(errors));
                        }

                        resolve([isValid, errors]);
                    })
                    .catch(e => resolve([false, e]));
                return;
            }

            // THE OLD WAY
            ajv.addMetaSchema(ajv0);
            const val = ajv.compile(this.schema);
            const isValid = val(this.payload);
            const errors = val.errors;

            if (!isValid) {
                console.warn('Invalid payload sending ' + this.message_name, JSON.stringify(errors));
            }
            resolve([isValid, errors]);
        });


    }

    toObject = () => ({
        uuid: this.uuid,
        message_name: this.message_name,
        metadata: this.metadata,
        payload: this.payload
    })
}
