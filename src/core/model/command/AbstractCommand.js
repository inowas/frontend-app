import Ajv from 'ajv';
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
                .catch(e => {
                    console.log(e);
                    resolve([false, e]);
                });
        });
    }

    toObject = () => ({
        uuid: this.uuid,
        message_name: this.message_name,
        metadata: this.metadata,
        payload: this.payload
    })
}
